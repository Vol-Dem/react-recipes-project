import { renderHook, waitFor } from "@testing-library/react";
import { MESSAGE_EMPTY_FAVORITES } from "../../../shared/constants";
import { useFavoriteRecipes } from "./useFavoriteRecipes";

const hookMocks = vi.hoisted(() => ({
  buildUrl: vi.fn(() => "favorites-url"),
  createFilter: vi.fn(() => "favorites-filter"),
  createLimit: vi.fn(() => "results-limit"),
  dispatch: vi.fn(),
  getRecipes: vi.fn((payload) => ({ type: "getRecipes", payload })),
  state: {
    auth: { isLoggedIn: true },
    fav: { favList: [1, 2] },
    recipe: { dailyLimitIsReached: false },
  },
}));

vi.mock("react-redux", () => ({
  useDispatch: () => hookMocks.dispatch,
  useSelector: (selector) => selector(hookMocks.state),
}));
vi.mock("../../recipes/api/recipeRepository", () => ({
  createFavoriteRecipesFilter: hookMocks.createFilter,
  createRecipeResultsLimit: hookMocks.createLimit,
  getRecipesCollection: () => "recipes-reference",
}));
vi.mock("../../recipes/api/recipeUrls", () => ({
  buildFavoriteRecipesUrl: hookMocks.buildUrl,
}));
vi.mock("../../recipes/store/recipesSlice", () => ({
  getRecipes: hookMocks.getRecipes,
  recipeActions: {
    resetRecipes: () => ({ type: "recipe/resetRecipes" }),
    setCurrentPage: (payload) => ({
      type: "recipe/setCurrentPage",
      payload,
    }),
    setEmptyMessage: (payload) => ({
      type: "recipe/setEmptyMessage",
      payload,
    }),
    setOrderBy: (payload) => ({ type: "recipe/setOrderBy", payload }),
  },
}));

describe("useFavoriteRecipes", () => {
  beforeEach(() => {
    hookMocks.state = {
      auth: { isLoggedIn: true },
      fav: { favList: [1, 2] },
      recipe: { dailyLimitIsReached: false },
    };
    vi.clearAllMocks();
  });

  it("loads the authenticated user's favorite recipes", async () => {
    const { result, unmount } = renderHook(() => useFavoriteRecipes());

    await waitFor(() => expect(hookMocks.getRecipes).toHaveBeenCalled());

    expect(result.current).toMatchObject({
      favoriteIds: [1, 2],
      favoritesReference: "recipes-reference",
      filter: "favorites-filter",
      isAuthenticated: true,
    });
    expect(hookMocks.getRecipes).toHaveBeenCalledWith({
      requestUrl: "favorites-url",
      firebaseRef: "recipes-reference",
      filter: "favorites-filter",
      resultsAmount: "results-limit",
    });

    unmount();
    expect(hookMocks.dispatch).toHaveBeenCalledWith({
      type: "recipe/resetRecipes",
    });
  });

  it("sets the empty message when the favorites list is empty", async () => {
    hookMocks.state.fav.favList = [];

    renderHook(() => useFavoriteRecipes());

    await waitFor(() =>
      expect(hookMocks.dispatch).toHaveBeenCalledWith({
        type: "recipe/setEmptyMessage",
        payload: MESSAGE_EMPTY_FAVORITES,
      }),
    );
    expect(hookMocks.getRecipes).not.toHaveBeenCalled();
  });
});
