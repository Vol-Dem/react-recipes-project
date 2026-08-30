import configureStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import axios from "axios";
import { getRecipes, nextPage, prevPage, sortRecipes } from "./recipesThunks";

const repositoryMocks = vi.hoisted(() => ({
  createLimit: vi.fn(() => "results-limit"),
  createNextPageRequest: vi.fn(() => ({
    position: "next-position",
    resultsAmount: "next-limit",
  })),
  createPreviousPageRequest: vi.fn(() => ({
    position: "previous-position",
    resultsAmount: "previous-limit",
  })),
  fetchFromFirestore: vi.fn(),
}));

vi.mock("axios");
vi.mock("../api/recipeRepository", () => ({
  createNextPageRequest: repositoryMocks.createNextPageRequest,
  createPreviousPageRequest: repositoryMocks.createPreviousPageRequest,
  createRecipeResultsLimit: repositoryMocks.createLimit,
  fetchRecipesFromFirestore: repositoryMocks.fetchFromFirestore,
}));

const mockStore = configureStore([thunk]);
const initialState = {
  currentPage: 1,
  dailyLimitIsReached: false,
  emptyMessage: "",
  errorMessage: "",
  isLastPage: false,
  orderBy: {},
  recipesIsLoading: false,
  searchResult: [],
  title: "",
};
const responseData = {
  results: [
    {
      id: 1,
      title: "title",
      image: "img",
      readyInMinutes: 20,
      nutrition: { nutrients: [{ name: "Calories", amount: 234 }] },
      servings: 3,
    },
    {
      id: 2,
      title: "title 2",
      image: "img",
      readyInMinutes: 15,
      nutrition: { nutrients: [{ name: "Calories", amount: 45 }] },
      servings: 4,
    },
  ],
};
const expectedResult = [
  {
    id: 1,
    title: "title",
    img: "img",
    readyInMinutes: 20,
    calories: 234,
    servings: 3,
  },
  {
    id: 2,
    title: "title 2",
    img: "img",
    readyInMinutes: 15,
    calories: 45,
    servings: 4,
  },
];

describe("recipe thunks", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("getRecipes", () => {
    const request = {
      requestUrl: "https://test.com/api",
      firebaseRef: "firebaseRef",
      filter: "filter",
      position: null,
      resultsAmount: 10,
    };

    it("stores the canonical API result", async () => {
      const store = mockStore({ recipe: initialState });
      axios.get.mockResolvedValue({ data: responseData });

      await store.dispatch(getRecipes(request));

      expect(axios.get).toHaveBeenCalledWith(request.requestUrl);
      expect(store.getActions()).toEqual([
        { type: "recipe/setRecipesIsLoading", payload: true },
        { type: "recipe/setSearchResult", payload: expectedResult },
        { type: "recipe/setRecipesIsLoading", payload: false },
      ]);
    });

    it("stores the fetched page and last-page flag in fallback mode", async () => {
      const store = mockStore({
        recipe: { ...initialState, dailyLimitIsReached: true },
      });
      repositoryMocks.fetchFromFirestore.mockResolvedValue({
        recipes: responseData.results,
        isLastPage: true,
      });

      await store.dispatch(getRecipes(request));

      expect(repositoryMocks.fetchFromFirestore).toHaveBeenCalledWith({
        queryParameters: [
          request.firebaseRef,
          request.filter,
          request.resultsAmount,
        ],
        position: request.position,
        sortBy: undefined,
        sortType: undefined,
      });
      expect(store.getActions()).toEqual([
        { type: "recipe/setIsLastPage", payload: false },
        { type: "recipe/setRecipesIsLoading", payload: true },
        { type: "recipe/setIsLastPage", payload: true },
        { type: "recipe/setSearchResult", payload: expectedResult },
        { type: "recipe/setRecipesIsLoading", payload: false },
      ]);
    });

    it("switches to fallback mode when the API limit is reached", async () => {
      const store = mockStore({ recipe: initialState });
      const expectedError = Object.assign(new Error("Payment required"), {
        response: { status: 402 },
      });
      axios.get
        .mockRejectedValueOnce(expectedError)
        .mockResolvedValueOnce({ data: responseData });

      await store.dispatch(getRecipes(request));

      expect(axios.get).toHaveBeenCalledTimes(2);
      expect(store.getActions()).toContainEqual({
        type: "recipe/setDailyLimitIsReached",
        payload: true,
      });
      expect(store.getActions()).toContainEqual({
        type: "notification/showNotification",
        payload: {
          message:
            "The application will now enter test mode. Search results will remain the same, and you can still use the other features.",
          title: "Daily API limit reached",
        },
      });
    });

    it("stores request errors", async () => {
      const store = mockStore({ recipe: initialState });
      axios.get.mockRejectedValue(new Error("Error message"));

      await store.dispatch(getRecipes(request));

      expect(store.getActions()).toEqual([
        { type: "recipe/setRecipesIsLoading", payload: true },
        {
          type: "recipe/setErrorMessage",
          payload: "Unable to load recipes. Please try again",
        },
        { type: "recipe/setRecipesIsLoading", payload: false },
      ]);
    });
  });

  it("changes local API pages without storing a derived collection", () => {
    const nextStore = mockStore({ recipe: initialState });
    const previousStore = mockStore({
      recipe: { ...initialState, currentPage: 2 },
    });

    nextStore.dispatch(nextPage("firebaseRef", "filter"));
    previousStore.dispatch(prevPage("firebaseRef", "filter"));

    expect(nextStore.getActions()).toEqual([
      { type: "recipe/setCurrentPage", payload: 2 },
    ]);
    expect(previousStore.getActions()).toEqual([
      { type: "recipe/setCurrentPage", payload: 1 },
    ]);
  });

  it("resets the page without storing a derived sort result", () => {
    const store = mockStore({
      recipe: {
        ...initialState,
        orderBy: { sortBy: "calories", sortType: "asc" },
        searchResult: expectedResult,
      },
    });

    store.dispatch(sortRecipes("firebaseRef", "filter"));

    expect(store.getActions()).toEqual([
      { type: "recipe/setCurrentPage", payload: 1 },
    ]);
  });
});
