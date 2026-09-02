import { act, renderHook } from "@testing-library/react";
import { useRecipeListController } from "./useRecipeListController";

const hookMocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  nextPage: vi.fn((...payload) => ({ type: "recipes/next", payload })),
  prevPage: vi.fn((...payload) => ({
    type: "recipes/previous",
    payload,
  })),
  sortRecipes: vi.fn((...payload) => ({
    type: "recipes/sort",
    payload,
  })),
  state: {
    recipe: {
      currentPage: 2,
      dailyLimitIsReached: true,
      emptyMessage: "",
      errorMessage: "",
      isLastPage: false,
      options: ["vegan"],
      orderBy: {},
      recipesIsLoading: false,
      searchResult: [{ id: 1 }],
    },
  },
}));

vi.mock("react-redux", () => ({
  useDispatch: () => hookMocks.dispatch,
  useSelector: (selector) => selector(hookMocks.state),
}));
vi.mock("next/navigation", () => ({
  useParams: () => ({ recipeId: "1" }),
}));
vi.mock("../store/recipesThunks", () => ({
  nextPage: hookMocks.nextPage,
  prevPage: hookMocks.prevPage,
  sortRecipes: hookMocks.sortRecipes,
}));

describe("useRecipeListController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("provides recipe list view state", () => {
    const { result } = renderHook(() =>
      useRecipeListController({ firebaseRef: "recipes" }),
    );

    expect(result.current.list).toEqual({
      currentPage: 2,
      emptyMessage: "",
      errorMessage: "",
      hasRecipes: true,
      isLastPage: false,
      isLoading: false,
      isRecipeOpen: true,
      options: ["vegan"],
      recipes: [{ id: 1 }],
    });
  });

  it("dispatches pagination requests with repository parameters", () => {
    const filter = { type: "vegan" };
    const { result } = renderHook(() =>
      useRecipeListController({ firebaseRef: "recipes", filter }),
    );

    act(() => {
      result.current.actions.goToNextPage();
      result.current.actions.goToPreviousPage();
    });

    expect(hookMocks.nextPage).toHaveBeenCalledWith("recipes", filter);
    expect(hookMocks.prevPage).toHaveBeenCalledWith("recipes", filter);
  });

  it("updates the order before dispatching a sort request", () => {
    const filter = { type: "vegan" };
    const { result } = renderHook(() =>
      useRecipeListController({ firebaseRef: "recipes", filter }),
    );

    act(() => {
      result.current.actions.sortBySelection({
        target: { value: "calories-desc" },
      });
    });

    expect(hookMocks.dispatch).toHaveBeenNthCalledWith(1, {
      payload: { sortBy: "calories", sortType: "desc" },
      type: "recipe/setOrderBy",
    });
    expect(hookMocks.sortRecipes).toHaveBeenCalledWith("recipes", filter);
  });
});
