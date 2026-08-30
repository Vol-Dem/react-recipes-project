import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RecipesPage from "./RecipesPage";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import axios from "axios";
import { recipeActions } from "../../store/recipesSlice";
import {
  INCLUDE_SEARCH_NUTRITION,
  RESULT_NUM,
  SPOONACULAR_API_KEY,
  SPOONACULAR_API_URL,
} from "../../../../shared/constants";

vi.mock("axios");
const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const expectedResult = [
  {
    id: 152,
    title: "Pizza",
    img: "",
    readyInMinutes: 35,
    calories: 237,
    servings: 4,
  },
];
const initialState = {
  searchResult: [],
  orderBy: {},
  recipesIsLoading: false,
  currentPage: 1,
  isLastPage: false,
  dailyLimitIsReached: false,
  title: "",
  emptyMessage: "",
  errorMessage: "",
  options: [],
};

describe("RecipesPage component", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        results: [
          {
            id: 152,
            title: "Pizza",
            image: "",
            readyInMinutes: 35,

            nutrition: {
              nutrients: [{ name: "Calories", amount: 237, unit: "kcal" }],
            },

            servings: 4,
          },
        ],
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("sends request with correct URL and dispatches actions on form submission", async () => {
    const store = mockStore({
      recipe: initialState,
      auth: { isLoggedIn: false },
      fav: { favList: [] },
    });
    render(
      <BrowserRouter>
        <Provider store={store}>
          <RecipesPage />
        </Provider>
      </BrowserRouter>,
    );
    const inputQuery = "pasta";
    const expectedUrl = `${SPOONACULAR_API_URL}/recipes/complexSearch?apiKey=${SPOONACULAR_API_KEY}&query=${inputQuery}&cuisine=&diet=&intolerances=&type=&number=${RESULT_NUM}&addRecipeNutrition=${INCLUDE_SEARCH_NUTRITION}`;
    const searchInput = screen.getByTestId("search-input");
    const submitBtn = screen.getByTestId("search-submit");

    fireEvent.change(searchInput, { target: { value: inputQuery } });
    const user = userEvent.setup();
    await user.click(submitBtn);

    await waitFor(() => {
      const dispatchedActions = store.getActions();
      expect(axios.get).toBeCalledWith(expectedUrl);
      expect(dispatchedActions).toContainEqual(recipeActions.setCurrentPage(1));
      expect(dispatchedActions).toContainEqual(
        recipeActions.setEmptyMessage(
          'No results for "pasta". Try checking your spelling',
        ),
      );
      expect(dispatchedActions).toContainEqual(recipeActions.setOrderBy([]));
      expect(dispatchedActions).toContainEqual(
        recipeActions.setSearchResult(expectedResult),
      );
    });
  });

  it("renders h1 'Your recipe book', SearchBox and no RecipeList, RecipeDetailsPage, or error", () => {
    expect.assertions(6);

    const store = mockStore({
      recipe: initialState,
      auth: { isLoggedIn: false },
      fav: { favList: [] },
    });
    render(
      <BrowserRouter>
        <Provider store={store}>
          <RecipesPage />
        </Provider>
      </BrowserRouter>,
    );
    const h1El = screen.getByText("Your recipe book");
    const searchInputEl = screen.getByTestId("search-input");
    const recipeItemListEl = screen.queryByTestId("recipe-item-list");
    const recipeEl = screen.queryByTestId("recipe");
    const errorEl = screen.queryByTestId("error-message");
    const sectionSearchEl = screen.queryByTestId("section-search");

    expect(h1El).toBeInTheDocument();
    expect(searchInputEl).toBeInTheDocument();
    expect(recipeItemListEl).not.toBeInTheDocument();
    expect(recipeEl).not.toBeInTheDocument();
    expect(errorEl).not.toBeInTheDocument();
    expect(sectionSearchEl).not.toHaveClass("mt0");
  });
  it("renders RecipeList results without RecipeDetailsPage, an error, or the heading", async () => {
    expect.assertions(7);

    const currentState = {
      ...initialState,
      searchResult: expectedResult,
    };
    const store = mockStore({
      recipe: currentState,
      auth: { isLoggedIn: false },
      fav: { favList: [] },
    });
    render(
      <BrowserRouter>
        <Provider store={store}>
          <RecipesPage />
        </Provider>
      </BrowserRouter>,
    );
    const h1El = screen.queryByText("Your recipe book");
    const pizzaEl = await screen.findByText("Pizza", {}, { timeout: 5000 });
    const searchInputEl = screen.getByTestId("search-input");
    const recipeItemListEl = screen.queryByTestId("recipe-item-list");
    const recipeEl = screen.queryByTestId("recipe");
    const errorEl = screen.queryByTestId("error-message");
    const sectionSearchEl = screen.queryByTestId("section-search");

    expect(h1El).not.toBeInTheDocument();
    expect(pizzaEl).toBeInTheDocument();
    expect(searchInputEl).toBeInTheDocument();
    expect(recipeItemListEl).toBeInTheDocument();
    expect(recipeEl).not.toBeInTheDocument();
    expect(errorEl).not.toBeInTheDocument();
    expect(sectionSearchEl.className).toMatch(/_mt0_/);
  });

  it("renders error with expected error message", async () => {
    expect.assertions(7);

    const currentState = {
      ...initialState,
      errorMessage: "Test error message",
    };
    const store = mockStore({
      recipe: currentState,
      auth: { isLoggedIn: false },
      fav: { favList: [] },
    });
    render(
      <BrowserRouter>
        <Provider store={store}>
          <RecipesPage />
        </Provider>
      </BrowserRouter>,
    );
    const errorEl = screen.queryByTestId("error-message");
    const errorMessageEl = screen.queryByText("Test error message");
    const h1El = screen.queryByText("Your recipe book");
    const searchInputEl = screen.getByTestId("search-input");
    const recipeItemListEl = screen.queryByTestId("recipe-item-list");
    const recipeEl = screen.queryByTestId("recipe");
    const sectionSearchEl = screen.queryByTestId("section-search");

    expect(errorEl).toBeInTheDocument();
    expect(errorMessageEl).toBeInTheDocument();
    expect(h1El).not.toBeInTheDocument();
    expect(searchInputEl).toBeInTheDocument();
    expect(recipeItemListEl).not.toBeInTheDocument();
    expect(recipeEl).not.toBeInTheDocument();
    expect(sectionSearchEl).not.toHaveClass("mt0");
  });
});
