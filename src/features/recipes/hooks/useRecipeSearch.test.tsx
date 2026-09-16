import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { makeQueryClient } from "../../../app/queryClient";
import { makeStore } from "../../../app/store";
import { fetchRecipesFromApi } from "../api/recipeApi";
import { fetchRecipePage } from "../api/recipePagination";
import { RecipeHttpError } from "../api/requestRecipeJson";
import { recipeActions } from "../store/recipesSlice";
import { mapRecipe } from "../utils/mapRecipe";
import { useRecipeSearch } from "./useRecipeSearch";
import { mockNextHistory } from "../../../test-utils/nextHistory";
import type { RecipeApiItem, RecipeApiResponse } from "../types";
import type { QueryDocumentSnapshot } from "firebase/firestore";
import type { PropsWithChildren } from "react";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", async () => ({
  useSearchParams: (await import("../../../test-utils/nextHistory"))
    .useTestSearchParams,
  usePathname: () => window.location.pathname,
  useRouter: () => ({ push }),
  useParams: () => ({}),
}));
vi.mock("../api/recipeApi", () => ({ fetchRecipesFromApi: vi.fn() }));
vi.mock("../api/recipePagination", () => ({
  fetchRecipePage: vi.fn(),
}));

const recipes: RecipeApiItem[] = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  title: `Recipe ${index + 1}`,
  image: "",
  readyInMinutes: index + 10,
  servings: 2,
  nutrition: { nutrients: [{ name: "Calories", amount: index + 100 }] },
}));
const cursor = { id: "cursor" } as QueryDocumentSnapshot;
const firstPage = {
  recipes: recipes.slice(0, 8).map(mapRecipe),
  isLastPage: false,
  nextCursor: cursor,
};
const lastPage = {
  recipes: recipes.slice(8).map(mapRecipe),
  isLastPage: true,
  nextCursor: undefined,
};

describe("useRecipeSearch", () => {
  const clients: QueryClient[] = [];
  const setup = (fallback = false) => {
    const store = makeStore();
    const client = makeQueryClient();
    clients.push(client);
    if (fallback) store.dispatch(recipeActions.setDailyLimitIsReached());
    const wrapper = ({ children }: PropsWithChildren) => (
      <Provider store={store}>
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      </Provider>
    );
    return { store, client, wrapper };
  };
  beforeEach(() => {
    vi.resetAllMocks();
    mockNextHistory();
    vi.mocked(fetchRecipesFromApi).mockResolvedValue({ results: recipes });
  });
  afterEach(() => {
    cleanup();
    clients.splice(0).forEach((client) => client.clear());
    vi.restoreAllMocks();
  });

  it("waits for submission and keeps server results out of Redux", async () => {
    const { wrapper, store } = setup();
    const { result } = renderHook(useRecipeSearch, { wrapper });
    expect(result.current.controller.list.isLoading).toBe(false);
    expect(fetchRecipesFromApi).not.toHaveBeenCalled();
    act(() => result.current.submitSearch({ query: "pasta", diet: "vegan" }));
    await waitFor(() =>
      expect(result.current.controller.list.recipes).toHaveLength(8),
    );
    expect(result.current.searchTitle).toBe("pasta");
    expect(result.current.controller.list.options).toEqual(["vegan"]);
    expect(fetchRecipesFromApi).toHaveBeenCalledWith(
      "/api/recipes/search?query=pasta&cuisine=&diet=vegan&intolerance=&type=",
      expect.any(AbortSignal),
    );
    expect(store.getState().recipe).not.toHaveProperty("searchResult");
    expect(window.location.search).toBe("?query=pasta&diet=vegan");
    expect(push).not.toHaveBeenCalled();
  });

  it("paginates and sorts API data without extra requests", async () => {
    const { wrapper } = setup();
    const { result } = renderHook(useRecipeSearch, { wrapper });
    act(() => result.current.submitSearch({ query: "pasta" }));
    await waitFor(() =>
      expect(result.current.controller.list.recipes).toHaveLength(8),
    );
    act(() => result.current.controller.actions.goToNextPage());
    expect(result.current.controller.list.currentPage).toBe(2);
    expect(
      result.current.controller.list.recipes.map((recipe) => recipe.id),
    ).toEqual([9, 10]);
    expect(result.current.controller.list.isLastPage).toBe(true);
    act(() =>
      result.current.controller.actions.sortBySelection("calories-desc"),
    );
    expect(result.current.controller.list.currentPage).toBe(1);
    expect(result.current.controller.list.recipes[0].id).toBe(10);
    expect(result.current.controller.list.sortValue).toBe("calories-desc");
    act(() => result.current.controller.actions.sortBySelection("-"));
    expect(result.current.controller.list.recipes[0].id).toBe(1);
    expect(fetchRecipesFromApi).toHaveBeenCalledOnce();
  });

  it("loads a bookmarked search and restores it after remounting", async () => {
    window.history.replaceState(null, "", "/?query=pasta&diet=vegan");
    const first = renderHook(useRecipeSearch, { wrapper: setup().wrapper });
    await waitFor(() =>
      expect(first.result.current.controller.list.hasRecipes).toBe(true),
    );
    first.unmount();
    const { result } = renderHook(useRecipeSearch, {
      wrapper: setup().wrapper,
    });
    await waitFor(() =>
      expect(result.current.controller.list.hasRecipes).toBe(true),
    );
    expect(result.current.searchTitle).toBe("pasta");
    expect(result.current.controller.list.options).toEqual(["vegan"]);
    expect(result.current.controller.listHref).toBe("/?query=pasta&diet=vegan");
    expect(fetchRecipesFromApi).toHaveBeenCalledTimes(2);
  });

  it("restores searches on back/forward navigation and returns to the landing page", async () => {
    const { result } = renderHook(useRecipeSearch, {
      wrapper: setup().wrapper,
    });
    act(() => result.current.submitSearch({ query: "pasta" }));
    await waitFor(() =>
      expect(result.current.controller.list.hasRecipes).toBe(true),
    );
    act(() => result.current.submitSearch({ query: "soup", diet: "vegan" }));
    await waitFor(() =>
      expect(result.current.controller.list.isLoading).toBe(false),
    );
    await act(async () => {
      window.history.back();
      await new Promise<void>((resolve) =>
        window.addEventListener("popstate", () => resolve(), { once: true }),
      );
    });
    expect(result.current.searchTitle).toBe("pasta");
    expect(result.current.controller.list.options).toEqual([]);
    expect(result.current.controller.list.currentPage).toBe(1);
    await act(async () => {
      window.history.forward();
      await new Promise<void>((resolve) =>
        window.addEventListener("popstate", () => resolve(), { once: true }),
      );
    });
    expect(result.current.searchTitle).toBe("soup");
    expect(result.current.controller.list.options).toEqual(["vegan"]);
    expect(fetchRecipesFromApi).toHaveBeenCalledTimes(2);
    act(() => window.history.pushState(null, "", "/"));
    expect(result.current.controller.list.hasRecipes).toBe(false);
    expect(result.current.controller.list.isLoading).toBe(false);
    expect(result.current.controller.list.emptyMessage).toBe("");
  });

  it("rejects malformed URL filters without fetching and allows a valid replacement", async () => {
    window.history.replaceState(null, "", "/?query=pasta&maxReadyTime=-1");
    const { result } = renderHook(useRecipeSearch, {
      wrapper: setup().wrapper,
    });
    expect(result.current.controller.list.errorMessage).toContain(
      "Invalid search filters",
    );
    expect(fetchRecipesFromApi).not.toHaveBeenCalled();
    expect(fetchRecipePage).not.toHaveBeenCalled();
    act(() => result.current.submitSearch({ query: "soup" }));
    await waitFor(() =>
      expect(result.current.controller.list.hasRecipes).toBe(true),
    );
    expect(result.current.controller.list.errorMessage).toBe("");
  });

  it("runs an intentional empty search without duplicating history entries", async () => {
    const { result } = renderHook(useRecipeSearch, {
      wrapper: setup().wrapper,
    });
    act(() => result.current.submitSearch({}));
    await waitFor(() =>
      expect(result.current.controller.list.hasRecipes).toBe(true),
    );
    act(() => result.current.submitSearch({ query: "" }));
    expect(window.location.search).toBe("?query=");
    expect(window.history.pushState).toHaveBeenCalledOnce();
    expect(fetchRecipesFromApi).toHaveBeenCalledOnce();
  });

  it("navigates from recipe details to a newly submitted search", () => {
    window.history.replaceState(null, "", "/recipe/152");
    const { result } = renderHook(useRecipeSearch, {
      wrapper: setup().wrapper,
    });
    act(() => result.current.submitSearch({ query: "soup" }));
    expect(push).toHaveBeenCalledWith("/?query=soup", { scroll: false });
    expect(window.history.pushState).not.toHaveBeenCalled();
  });

  it("reuses fresh searches and resets pagination, sorting, and labels on submission", async () => {
    const { wrapper } = setup();
    const { result } = renderHook(useRecipeSearch, { wrapper });
    act(() => result.current.submitSearch({ query: "pasta", diet: "vegan" }));
    await waitFor(() =>
      expect(result.current.controller.list.hasRecipes).toBe(true),
    );
    act(() => result.current.controller.actions.goToNextPage());
    act(() => result.current.submitSearch({ query: "soup" }));
    await waitFor(() =>
      expect(result.current.controller.list.isLoading).toBe(false),
    );
    expect(result.current.controller.list.options).toEqual([]);
    act(() =>
      result.current.controller.actions.sortBySelection("calories-desc"),
    );
    act(() => result.current.submitSearch({ query: "pasta", diet: "vegan" }));
    expect(result.current.controller.list.currentPage).toBe(1);
    expect(result.current.controller.list.sortValue).toBe("-");
    expect(result.current.controller.list.hasRecipes).toBe(true);
    expect(fetchRecipesFromApi).toHaveBeenCalledTimes(2);
  });

  it("cancels superseded requests and ignores late results", async () => {
    let resolveOld!: (response: RecipeApiResponse) => void;
    vi.mocked(fetchRecipesFromApi).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveOld = resolve;
        }),
    );
    const { wrapper } = setup();
    const { result } = renderHook(useRecipeSearch, { wrapper });
    act(() => result.current.submitSearch({ query: "old" }));
    const signal = vi.mocked(fetchRecipesFromApi).mock.calls[0][1]!;
    act(() => result.current.submitSearch({ query: "new" }));
    expect(signal.aborted).toBe(true);
    await waitFor(() =>
      expect(result.current.controller.list.hasRecipes).toBe(true),
    );
    await act(async () => {
      resolveOld({ results: [] });
    });
    expect(result.current.searchTitle).toBe("new");
    expect(result.current.controller.list.recipes).toHaveLength(8);
  });

  it("shows empty results and allows failed searches to be resubmitted", async () => {
    vi.mocked(fetchRecipesFromApi)
      .mockRejectedValueOnce(new RecipeHttpError(500))
      .mockResolvedValueOnce({ results: [] });
    const { wrapper } = setup();
    const { result } = renderHook(useRecipeSearch, { wrapper });
    act(() => result.current.submitSearch({ query: "pasta" }));
    await waitFor(() =>
      expect(result.current.controller.list.errorMessage).toBe(
        "Unable to load recipes. Please try again",
      ),
    );
    expect(fetchRecipesFromApi).toHaveBeenCalledOnce();
    act(() => result.current.submitSearch({ query: "pasta" }));
    await waitFor(() =>
      expect(result.current.controller.list.emptyMessage).toBe(
        'No results for "pasta". Try checking your spelling',
      ),
    );
    expect(result.current.controller.list.errorMessage).toBe("");
    expect(fetchRecipesFromApi).toHaveBeenCalledTimes(2);
  });

  it("switches to Firestore once on quota failure", async () => {
    vi.mocked(fetchRecipesFromApi).mockRejectedValue(new RecipeHttpError(402));
    vi.mocked(fetchRecipePage).mockResolvedValue(firstPage);
    const { wrapper, store } = setup();
    const { result } = renderHook(useRecipeSearch, { wrapper });
    act(() => result.current.submitSearch({ query: "pasta" }));
    await waitFor(() =>
      expect(result.current.controller.list.recipes).toHaveLength(8),
    );
    expect(store.getState().recipe.dailyLimitIsReached).toBe(true);
    expect(store.getState().notification.title).toBe("Daily API limit reached");
    expect(fetchRecipesFromApi).toHaveBeenCalledOnce();
    expect(fetchRecipePage).toHaveBeenCalledExactlyOnceWith({}, undefined);
  });

  it("keeps fallback cursors in query pages and reuses previous pages", async () => {
    vi.mocked(fetchRecipePage)
      .mockResolvedValueOnce(firstPage)
      .mockResolvedValueOnce(lastPage);
    const { wrapper, store } = setup(true);
    const { result } = renderHook(useRecipeSearch, { wrapper });
    act(() => result.current.submitSearch({ query: "pasta" }));
    await waitFor(() =>
      expect(result.current.controller.list.hasRecipes).toBe(true),
    );
    act(() => result.current.controller.actions.goToNextPage());
    await waitFor(() =>
      expect(
        result.current.controller.list.recipes.map((recipe) => recipe.id),
      ).toEqual([9, 10]),
    );
    expect(fetchRecipePage).toHaveBeenLastCalledWith({}, cursor);
    expect(result.current.controller.list.isLastPage).toBe(true);
    act(() => result.current.controller.actions.goToPreviousPage());
    expect(result.current.controller.list.recipes[0].id).toBe(1);
    act(() => result.current.controller.actions.goToNextPage());
    expect(result.current.controller.list.recipes[0].id).toBe(9);
    expect(fetchRecipePage).toHaveBeenCalledTimes(2);
    expect(fetchRecipesFromApi).not.toHaveBeenCalled();
    expect(store.getState().recipe).not.toHaveProperty("searchResult");
  });

  it("starts a new fallback cursor chain when sorting changes", async () => {
    vi.mocked(fetchRecipePage).mockResolvedValue(firstPage);
    const { wrapper } = setup(true);
    const { result } = renderHook(useRecipeSearch, { wrapper });
    act(() => result.current.submitSearch({ query: "pasta" }));
    await waitFor(() =>
      expect(result.current.controller.list.hasRecipes).toBe(true),
    );
    act(() =>
      result.current.controller.actions.sortBySelection("calories-desc"),
    );
    await waitFor(() =>
      expect(result.current.controller.list.isLoading).toBe(false),
    );
    expect(fetchRecipePage).toHaveBeenLastCalledWith(
      { sortBy: "calories", sortType: "desc" },
      undefined,
    );
    expect(result.current.controller.list.currentPage).toBe(1);
  });

  it("resets an API-only page when another consumer reaches the quota", async () => {
    vi.mocked(fetchRecipePage).mockResolvedValue(firstPage);
    const { wrapper, store } = setup();
    const { result } = renderHook(useRecipeSearch, { wrapper });
    act(() => result.current.submitSearch({ query: "pasta" }));
    await waitFor(() =>
      expect(result.current.controller.list.hasRecipes).toBe(true),
    );
    act(() => result.current.controller.actions.goToNextPage());
    act(() => store.dispatch(recipeActions.setDailyLimitIsReached()));
    await waitFor(() =>
      expect(result.current.controller.list.isLoading).toBe(false),
    );
    expect(result.current.controller.list.currentPage).toBe(1);
    expect(result.current.controller.list.recipes[0].id).toBe(1);
  });

  it("does not fetch fallback data before a search is submitted", () => {
    const { wrapper } = setup(true);
    const { result } = renderHook(useRecipeSearch, { wrapper });
    expect(result.current.controller.list.isLoading).toBe(false);
    expect(fetchRecipePage).not.toHaveBeenCalled();
  });
});
