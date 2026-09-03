import { renderHook, waitFor } from "@testing-library/react";
import type { RootState } from "../../../app/store";
import { MESSAGE_EMPTY_FAVORITES } from "../../../shared/constants";
import { useFavoriteRecipes } from "./useFavoriteRecipes";

const hookMocks = vi.hoisted(() => ({
  buildUrl: vi.fn(() => "favorites-url"),
  createFilter: vi.fn(() => "favorites-filter"),
  createLimit: vi.fn(() => "results-limit"),
  dispatch: vi.fn(),
  getRecipes: vi.fn((payload: unknown) => ({ type: "getRecipes", payload })),
  state: {
    auth: { isLoggedIn: true },
    fav: { favList: [1, 2] },
    recipe: { dailyLimitIsReached: false },
  },
}));

vi.mock("react-redux", () => ({
  useDispatch: () => hookMocks.dispatch,
  useSelector: (selector: (state: RootState) => unknown) =>
    selector(hookMocks.state as unknown as RootState),
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
  recipeActions: {
    resetRecipes: () => ({ type: "recipe/resetRecipes" }),
    setCurrentPage: (payload: unknown) => ({
      type: "recipe/setCurrentPage",
      payload,
    }),
    setEmptyMessage: (payload: unknown) => ({
      type: "recipe/setEmptyMessage",
      payload,
    }),
    setOrderBy: (payload: unknown) => ({ type: "recipe/setOrderBy", payload }),
  },
}));
vi.mock("../../recipes/store/recipesThunks", () => ({
  getRecipes: hookMocks.getRecipes,
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

    const { result } = renderHook(() => useFavoriteRecipes());

    await waitFor(() =>
      expect(hookMocks.dispatch).toHaveBeenCalledWith({
        type: "recipe/setEmptyMessage",
        payload: MESSAGE_EMPTY_FAVORITES,
      }),
    );
    expect(result.current.filter).toBeUndefined();
    expect(hookMocks.createFilter).not.toHaveBeenCalled();
    expect(hookMocks.getRecipes).not.toHaveBeenCalled();
  });
});
