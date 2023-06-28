import {
  splitRecipesPerPage,
  getDataFromApi,
  getRecipes,
  nextPage,
  prevPage,
  sortRecipes,
} from "../../../store/recipe";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import axios from "axios";

jest.mock("axios");
const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const initialState = {
  searchResult: [],
  sortedRecipes: [],
  recipesPerPage: [],
  orderBy: {},
  recipesIsLoading: false,
  currentPage: 1,
  isLastPage: false,
  dailyLimitIsReached: false,
  title: "",
  emptyMessage: "",
  errorMessage: "",
};

jest.mock("firebase/firestore", () => ({
  query: jest.fn(),
  getDocs: jest.fn(),
}));

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

describe("recipeSlice", () => {
  beforeAll(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {});

  describe("getDataFromApi", () => {
    beforeEach(() => {});

    const requestUrl = "https://test.com/api";

    it("should return the data if the request is successful", async () => {
      expect.assertions(2);

      axios.get.mockResolvedValue({ data: responseData });
      const result = await getDataFromApi(requestUrl);

      expect(axios.get).toHaveBeenCalledWith(requestUrl);
      expect(result).toEqual(responseData);
    });

    it("should throw an error if the request fails", async () => {
      expect.assertions(1);

      const expectedError = new Error("Network error");
      axios.get.mockRejectedValue(expectedError);

      await expect(getDataFromApi(requestUrl)).rejects.toThrow(
        "Error: Network error"
      );
    });
  });

  describe("getRecipes", () => {
    const requestUrl = "https://test.com/api";
    const firebaseRef = "firebaseRef";
    const filter = "filter";
    const position = null;
    const resultsAmount = 10;
    beforeEach(() => {});

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should dispatch setSearchResult and setSortedResult with the API result if daily limit is not reached", async () => {
      expect.assertions(13);

      const store = mockStore({
        recipe: initialState,
      });
      axios.get.mockImplementation(() =>
        Promise.resolve({ data: responseData })
      );
      await store.dispatch(
        getRecipes({ requestUrl, firebaseRef, filter, position, resultsAmount })
      );
      const actions = store.getActions();

      expect(axios.get).toHaveBeenCalledWith(requestUrl);
      expect(actions[0].type).toEqual("recipe/setIsLastPage");
      expect(actions[0].payload).toEqual(false);
      expect(actions[1].type).toEqual("recipe/setRecipesIsLoading");
      expect(actions[1].payload).toEqual(true);
      expect(actions[2].type).toEqual("recipe/setSearchResult");
      expect(actions[2].payload).toEqual(expectedResult);
      expect(actions[3].type).toEqual("recipe/setSortedRecipes");
      expect(actions[3].payload).toEqual(expectedResult);
      expect(actions[4].type).toEqual("recipe/setRecipesPerPage");
      expect(actions[4].payload).toEqual([]);
      expect(actions[5].type).toEqual("recipe/setRecipesIsLoading");
      expect(actions[5].payload).toEqual(false);
    });

    it('should handle the "Daily limit reached" error by dispatching setDailyLimitIsReached, showNotification and retrying the request', async () => {
      expect.assertions(15);

      const store = mockStore({
        recipe: initialState,
      });
      const expectedError = new Error(
        "AxiosError: Request failed with status code 402"
      );
      axios.get.mockImplementation(() => Promise.reject(expectedError));
      await store.dispatch(
        getRecipes({ requestUrl, firebaseRef, filter, position, resultsAmount })
      );
      const actions = store.getActions();

      expect(axios.get).toHaveBeenCalledWith(requestUrl);
      expect(actions[0].type).toEqual("recipe/setIsLastPage");
      expect(actions[0].payload).toEqual(false);
      expect(actions[1].type).toEqual("recipe/setRecipesIsLoading");
      expect(actions[1].payload).toEqual(true);
      expect(actions[2].type).toEqual("recipe/setDailyLimitIsReached");
      expect(actions[2].payload).toEqual(true);
      expect(actions[3].type).toEqual("notification/showNotification");
      expect(actions[3].payload).toEqual({
        message:
          "The application will now enter test mode. Search result will remain the same. You can still use other features!",
        title: "Daily limit of API is over :(",
      });
      expect(actions[4].type).toEqual("recipe/setIsLastPage");
      expect(actions[4].payload).toEqual(false);
      expect(actions[5].type).toEqual("recipe/setRecipesIsLoading");
      expect(actions[5].payload).toEqual(true);
      expect(actions[6].type).toEqual("recipe/setRecipesIsLoading");
      expect(actions[6].payload).toEqual(false);
    });

    it("should handle errors by dispatching setErrorMessage ", async () => {
      expect.assertions(9);

      const store = mockStore({
        recipe: initialState,
      });
      const expectedError = new Error("Error message");
      axios.get.mockImplementation(() => Promise.reject(expectedError));
      await store.dispatch(
        getRecipes({ requestUrl, firebaseRef, filter, position, resultsAmount })
      );
      const actions = store.getActions();

      expect(axios.get).toHaveBeenCalledWith(requestUrl);
      expect(actions[0].type).toEqual("recipe/setIsLastPage");
      expect(actions[0].payload).toEqual(false);
      expect(actions[1].type).toEqual("recipe/setRecipesIsLoading");
      expect(actions[1].payload).toEqual(true);
      expect(actions[2].type).toEqual("recipe/setErrorMessage");
      expect(actions[2].payload).toEqual("Error: Error message");
      expect(actions[3].type).toEqual("recipe/setRecipesIsLoading");
      expect(actions[3].payload).toEqual(false);
    });
  });

  describe("nextPage", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should handle page switching by dispatching setCurrentPage if daily limit is not reached", () => {
      expect.assertions(3);

      const store = mockStore({
        recipe: initialState,
      });

      const firebaseRef = "firebaseRef";
      const filter = "filter";

      store.dispatch(nextPage(firebaseRef, filter));

      const actions = store.getActions();

      expect(actions[0].type).toEqual("recipe/setCurrentPage");
      expect(actions[0].payload).toEqual(2);
      expect(actions[1].type).toEqual("recipe/setRecipesPerPage");
    });
  });

  describe("prevtPage", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should handle page switching by dispatching setCurrentPage if daily limit is not reached", () => {
      expect.assertions(3);

      const store = mockStore({
        recipe: initialState,
      });

      const firebaseRef = "firebaseRef";
      const filter = "filter";

      store.dispatch(prevPage(firebaseRef, filter));

      const actions = store.getActions();

      expect(actions[0].type).toEqual("recipe/setCurrentPage");
      expect(actions[0].payload).toEqual(0);
      expect(actions[1].type).toEqual("recipe/setRecipesPerPage");
    });
  });

  describe("sortRecipes", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should handle sorting by dispatching setSortedRecipes with sorted data if daily limit is not reached", () => {
      expect.assertions(8);

      const expectedSortedResult = [
        {
          id: 2,
          title: "title 2",
          img: "img",
          readyInMinutes: 15,
          calories: 45,
          servings: 4,
        },
        {
          id: 1,
          title: "title",
          img: "img",
          readyInMinutes: 20,
          calories: 234,
          servings: 3,
        },
      ];

      const store = mockStore({
        recipe: {
          searchResult: expectedResult,
          sortedRecipes: expectedSortedResult,
          recipesPerPage: [],
          orderBy: { sortBy: "calories", sortType: "asc" },
          recipesIsLoading: false,
          currentPage: 1,
          isLastPage: false,
          dailyLimitIsReached: false,
          title: "",
          emptyMessage: "",
          errorMessage: "",
        },
      });

      const firebaseRef = "firebaseRef";
      const filter = "filter";

      store.dispatch(sortRecipes(firebaseRef, filter));

      const actions = store.getActions();

      expect(actions[0].type).toEqual("recipe/setCurrentPage");
      expect(actions[0].payload).toEqual(1);
      expect(actions[1].type).toEqual("recipe/setIsLastPage");
      expect(actions[1].payload).toEqual(false);
      expect(actions[2].type).toEqual("recipe/setSortedRecipes");
      expect(actions[2].payload).toEqual(expectedSortedResult);
      expect(actions[3].type).toEqual("recipe/setRecipesPerPage");
      expect(actions[3].payload).toEqual(expectedSortedResult);
    });
  });

  describe("splitRecipesPerPage", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should handle spliting per page by dispatching setSortedRecipes with corect amount of data and not dispatch setIsLastPage if sortedRecipes > REACT_APP_AMOUNT_PER_PAGE when daily limit is not reached", () => {
      expect.assertions(3);
      const sortedRecipesData = [...Array(15).keys()];
      const expectedRecipesPerPage = [
        ...Array(+process.env.REACT_APP_AMOUNT_PER_PAGE).keys(),
      ];

      const store = mockStore({
        recipe: {
          searchResult: sortedRecipesData,
          sortedRecipes: sortedRecipesData,
          recipesPerPage: [],
          orderBy: {},
          recipesIsLoading: false,
          currentPage: 1,
          isLastPage: false,
          dailyLimitIsReached: false,
          title: "",
          emptyMessage: "",
          errorMessage: "",
        },
      });

      store.dispatch(splitRecipesPerPage());

      const actions = store.getActions();

      expect(actions[0].type).toEqual("recipe/setRecipesPerPage");
      expect(actions[0].payload).toEqual(expectedRecipesPerPage);
      expect(actions[1]?.type).not.toEqual("recipe/setIsLastPage");
    });

    it("should handle spliting per page by dispatching setSortedRecipes with corect amount of data and dispatch setIsLastPage if sortedRecipes <= REACT_APP_AMOUNT_PER_PAGE when daily limit is not reached", () => {
      expect.assertions(4);
      const sortedRecipesData = [...Array(8).keys()];
      const expectedRecipesPerPage = [
        ...Array(+process.env.REACT_APP_AMOUNT_PER_PAGE).keys(),
      ];

      const store = mockStore({
        recipe: {
          searchResult: sortedRecipesData,
          sortedRecipes: sortedRecipesData,
          recipesPerPage: [],
          orderBy: {},
          recipesIsLoading: false,
          currentPage: 1,
          isLastPage: false,
          dailyLimitIsReached: false,
          title: "",
          emptyMessage: "",
          errorMessage: "",
        },
      });

      store.dispatch(splitRecipesPerPage());

      const actions = store.getActions();

      expect(actions[0].type).toEqual("recipe/setRecipesPerPage");
      expect(actions[0].payload).toEqual(expectedRecipesPerPage);
      expect(actions[1].type).toEqual("recipe/setIsLastPage");
      expect(actions[1].payload).toEqual(true);
    });

    it("should handle spliting per page by dispatching setSortedRecipes with corect amount of data and not dispatch setIsLastPage if daily limit is reached", () => {
      expect.assertions(3);

      const sortedRecipesData = [...Array(10).keys()];

      const store = mockStore({
        recipe: {
          searchResult: sortedRecipesData,
          sortedRecipes: sortedRecipesData,
          recipesPerPage: [],
          orderBy: {},
          recipesIsLoading: false,
          currentPage: 1,
          isLastPage: false,
          dailyLimitIsReached: true,
          title: "",
          emptyMessage: "",
          errorMessage: "",
        },
      });

      store.dispatch(splitRecipesPerPage());

      const actions = store.getActions();

      expect(actions[0].type).toEqual("recipe/setRecipesPerPage");
      expect(actions[0].payload).toEqual(sortedRecipesData);
      expect(actions[1]?.type).not.toEqual("recipe/setIsLastPage");
    });
  });
});
