import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Homepage from "../../../pages/Homepage";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import axios from "axios";
import { recipeActions } from "../../../store/recipe";

jest.mock("axios");
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

describe("Homepage component", () => {
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
    jest.clearAllMocks();
  });

  it("sends request with correct URL and dispatches actions on form submission", async () => {
    // expect.assertions(6);

    const store = mockStore({
      recipe: initialState,
      auth: { isLoggedIn: false },
      fav: { favList: [] },
    });
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Homepage />
        </Provider>
      </BrowserRouter>
    );
    const inputQuery = "pasta";
    const expectedUrl = `${process.env.REACT_APP_SPOONACULAR_API_URL}/recipes/complexSearch?apiKey=${process.env.REACT_APP_SPOONACULAR_API_KEY}&query=${inputQuery}&cuisine=&diet=&intolerances=&type=&number=10&addRecipeNutrition=true`;
    const searchInput = screen.getByTestId("search-input");
    const submitBtn = screen.getByTestId("search-submit");

    fireEvent.change(searchInput, { target: { value: inputQuery } });
    userEvent.click(submitBtn);

    await waitFor(() => {
      const dispatchedActions = store.getActions();
      expect(axios.get).toBeCalledWith(expectedUrl);
      expect(dispatchedActions).toContainEqual(recipeActions.setTitle("pasta"));
      expect(dispatchedActions).toContainEqual(recipeActions.setCurrentPage(1));
      expect(dispatchedActions).toContainEqual(
        recipeActions.setEmptyMessage(
          'No results for "pasta". Try checking your spelling'
        )
      );
      expect(dispatchedActions).toContainEqual(recipeActions.setOrderBy([]));
      expect(dispatchedActions).toContainEqual(
        recipeActions.setSearchResult(expectedResult)
      );
    });
  });

  it("renders h1 'Your recipe book', SearchBox and does not render RecipeItemList, Recipe, ErrorMessage component", () => {
    expect.assertions(6);

    const store = mockStore({
      recipe: initialState,
      auth: { isLoggedIn: false },
      fav: { favList: [] },
    });
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Homepage />
        </Provider>
      </BrowserRouter>
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
  it("renders RecipeItemList with expected items and does not render Recipe, ErrorMessage component and h1 'Your recipe book' when search result is not empty", async () => {
    expect.assertions(7);

    const currentSate = {
      ...initialState,
      searchResult: expectedResult,
      sortedRecipes: expectedResult,
      recipesPerPage: expectedResult,
    };
    const store = mockStore({
      recipe: currentSate,
      auth: { isLoggedIn: false },
      fav: { favList: [] },
    });
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Homepage />
        </Provider>
      </BrowserRouter>
    );
    const h1El = screen.queryByText("Your recipe book");
    const pizzaEl = await screen.findByText("Pizza");
    // const pizzaEl = screen.queryByText("Pizza");
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
    expect(sectionSearchEl).toHaveClass("mt0");
  });

  it("renders error with expected error message", async () => {
    expect.assertions(7);

    const currentSate = {
      ...initialState,
      errorMessage: "Test error message",
    };
    const store = mockStore({
      recipe: currentSate,
      auth: { isLoggedIn: false },
      fav: { favList: [] },
    });
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Homepage />
        </Provider>
      </BrowserRouter>
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
    expect(h1El).toBeInTheDocument();
    expect(searchInputEl).toBeInTheDocument();
    expect(recipeItemListEl).not.toBeInTheDocument();
    expect(recipeEl).not.toBeInTheDocument();
    expect(sectionSearchEl).not.toHaveClass("mt0");
  });
});
