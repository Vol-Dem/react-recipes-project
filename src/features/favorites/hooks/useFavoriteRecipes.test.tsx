import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { makeQueryClient } from "../../../app/queryClient";
import { makeStore } from "../../../app/store";
import { MESSAGE_EMPTY_FAVORITES } from "../../../shared/constants";
import { authActions } from "../../auth/store/authSlice";
import { recipeActions } from "../../recipes/store/recipesSlice";
import { RecipeHttpError } from "../../recipes/api/requestRecipeJson";
import { favoriteKeys } from "../constants/queryKeys";
import { FavoritesProvider, useFavorites } from "../context/FavoritesContext";
import {
  fetchFavoriteRecipes,
  fetchFavoriteRecipePage,
} from "../api/favoriteRecipesApi";
import { updateFavorite, fetchFavoriteIds } from "../api/favoritesApi";
import { useFavoriteRecipes } from "./useFavoriteRecipes";
import type { RecipeSummary } from "../../recipes/types";
import type { RecipePageCursor } from "../../recipes/api/recipePagination";
import type { PropsWithChildren } from "react";

vi.mock("next/navigation", () => ({ useParams: () => ({}) }));
vi.mock("../api/favoriteRecipesApi", () => ({
  fetchFavoriteRecipes: vi.fn(),
  fetchFavoriteRecipePage: vi.fn(),
}));
vi.mock("../api/favoritesApi", () => ({
  updateFavorite: vi.fn(),
  fetchFavoriteIds: vi.fn(),
}));

const recipes: RecipeSummary[] = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  title: `Recipe ${index + 1}`,
  img: "",
  readyInMinutes: index + 10,
  servings: 2,
  calories: index + 100,
}));
const user = (uid = "user-a") => ({
  uid,
  idToken: "token",
  email: "user@example.com",
  userName: "User",
  emailVerified: true,
});
const cursor = { id: "cursor" } as RecipePageCursor;
const firstPage = {
  recipes: recipes.slice(0, 8),
  isLastPage: false,
  nextCursor: cursor,
};
const lastPage = {
  recipes: recipes.slice(8),
  isLastPage: true,
  nextCursor: undefined,
};

describe("useFavoriteRecipes", () => {
  const clients: QueryClient[] = [];
  const setup = (
    ids = recipes.map(({ id }) => id),
    fallback = false,
    authenticated = true,
  ) => {
    const store = makeStore();
    const client = makeQueryClient();
    clients.push(client);
    if (authenticated) store.dispatch(authActions.login(user()));
    client.setQueryData(favoriteKeys.ids("user-a"), ids);
    vi.mocked(fetchFavoriteIds).mockResolvedValue(ids);
    if (fallback) store.dispatch(recipeActions.setDailyLimitIsReached());
    const wrapper = ({ children }: PropsWithChildren) => (
      <Provider store={store}>
        <QueryClientProvider client={client}>
          <FavoritesProvider>{children}</FavoritesProvider>
        </QueryClientProvider>
      </Provider>
    );
    return { store, client, wrapper };
  };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(fetchFavoriteRecipes).mockImplementation(async (ids) =>
      recipes.filter(({ id }) => ids.includes(id)),
    );
  });
  afterEach(() => {
    cleanup();
    clients.splice(0).forEach((client) => client.clear());
    vi.restoreAllMocks();
  });

  it("loads favorites into the query cache and reuses fresh results", async () => {
    const { wrapper, store } = setup();
    const first = renderHook(useFavoriteRecipes, { wrapper });
    await waitFor(() =>
      expect(first.result.current.controller.list.recipes).toHaveLength(8),
    );
    expect(store.getState().recipe).toEqual({ dailyLimitIsReached: false });
    first.rerender();
    expect(first.result.current.controller.list.isLoading).toBe(false);
    expect(first.result.current.controller.list.recipes).toHaveLength(8);
    expect(fetchFavoriteRecipes).toHaveBeenCalledOnce();
  });

  it.each([
    [true, false],
    [true, true],
    [false, false],
    [false, true],
  ])(
    "does not request data for empty or unauthenticated favorites (auth: %s, fallback: %s)",
    (authenticated, fallback) => {
      const { wrapper } = setup(
        authenticated ? [] : [1],
        fallback,
        authenticated,
      );
      const { result } = renderHook(useFavoriteRecipes, { wrapper });
      expect(result.current.controller.list.isLoading).toBe(false);
      expect(result.current.controller.list.recipes).toEqual([]);
      expect(result.current.controller.list.emptyMessage).toBe(
        MESSAGE_EMPTY_FAVORITES,
      );
      expect(fetchFavoriteRecipes).not.toHaveBeenCalled();
      expect(fetchFavoriteRecipePage).not.toHaveBeenCalled();
    },
  );

  it("sorts and paginates API favorites without fetching again", async () => {
    const { wrapper } = setup();
    const { result } = renderHook(useFavoriteRecipes, { wrapper });
    await waitFor(() =>
      expect(result.current.controller.list.hasRecipes).toBe(true),
    );
    act(() => result.current.controller.actions.goToNextPage());
    expect(result.current.controller.list.recipes.map(({ id }) => id)).toEqual([
      9, 10,
    ]);
    expect(result.current.controller.list.isLastPage).toBe(true);
    act(() =>
      result.current.controller.actions.sortBySelection("calories-desc"),
    );
    expect(result.current.controller.list.currentPage).toBe(1);
    expect(result.current.controller.list.recipes[0].id).toBe(10);
    act(() => result.current.controller.actions.sortBySelection("-"));
    expect(result.current.controller.list.recipes[0].id).toBe(1);
    expect(fetchFavoriteRecipes).toHaveBeenCalledOnce();
  });

  it("resets sorting and pagination when membership changes", async () => {
    const { wrapper, client } = setup();
    const { result } = renderHook(useFavoriteRecipes, { wrapper });
    await waitFor(() =>
      expect(result.current.controller.list.hasRecipes).toBe(true),
    );
    act(() =>
      result.current.controller.actions.sortBySelection("calories-desc"),
    );
    act(() => result.current.controller.actions.goToNextPage());
    act(() => client.setQueryData(favoriteKeys.ids("user-a"), [2]));
    await waitFor(() =>
      expect(
        result.current.controller.list.recipes.map(({ id }) => id),
      ).toEqual([2]),
    );
    expect(result.current.controller.list.currentPage).toBe(1);
    expect(result.current.controller.list.sortValue).toBe("-");
  });

  it("hides the last removed favorite immediately and restores it on mutation rollback", async () => {
    let fail!: (error: Error) => void;
    vi.mocked(updateFavorite).mockImplementation(
      () =>
        new Promise((_resolve, reject) => {
          fail = reject;
        }),
    );
    const { wrapper, store } = setup([1]);
    const { result } = renderHook(
      () => ({
        ...useFavoriteRecipes(),
        toggleFavorite: useFavorites().toggleFavorite,
      }),
      { wrapper },
    );
    await waitFor(() =>
      expect(result.current.controller.list.hasRecipes).toBe(true),
    );
    act(() => {
      result.current.toggleFavorite(1);
    });
    await waitFor(() =>
      expect(result.current.controller.list.recipes).toEqual([]),
    );
    expect(result.current.controller.list.emptyMessage).toBe(
      MESSAGE_EMPTY_FAVORITES,
    );
    await act(async () => {
      fail(new Error("Write failed"));
    });
    await waitFor(() =>
      expect(result.current.controller.list.recipes[0].id).toBe(1),
    );
    expect(fetchFavoriteRecipes).toHaveBeenCalledOnce();
    expect(store.getState().notification.isShown).toBe(true);
  });

  it("ignores an old account's late response and uses an account-specific cache", async () => {
    let finishOld!: (value: RecipeSummary[]) => void;
    vi.mocked(fetchFavoriteRecipes).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finishOld = resolve;
        }),
    );
    const { wrapper, store } = setup([1]);
    const { result } = renderHook(useFavoriteRecipes, { wrapper });
    const signal = vi.mocked(fetchFavoriteRecipes).mock.calls[0][1]!;
    act(() => store.dispatch(authActions.login(user("user-b"))));
    expect(result.current.controller.list.recipes).toEqual([]);
    await waitFor(() =>
      expect(result.current.controller.list.hasRecipes).toBe(true),
    );
    expect(signal.aborted).toBe(true);
    await act(async () =>
      finishOld([{ ...recipes[0], title: "Stale response" }]),
    );
    expect(result.current.controller.list.recipes[0].title).toBe("Recipe 1");
    expect(fetchFavoriteRecipes).toHaveBeenCalledTimes(2);
  });

  it("stops exposing cached favorites after logout", async () => {
    const { wrapper, store } = setup([1]);
    const { result } = renderHook(useFavoriteRecipes, { wrapper });
    await waitFor(() =>
      expect(result.current.controller.list.hasRecipes).toBe(true),
    );
    act(() => store.dispatch(authActions.logout()));
    expect(result.current.controller.list.recipes).toEqual([]);
    expect(result.current.isAuthenticated).toBe(false);
    expect(fetchFavoriteRecipes).toHaveBeenCalledOnce();
  });

  it("switches to Firestore when the bulk API reaches its quota", async () => {
    vi.mocked(fetchFavoriteRecipes).mockRejectedValue(new RecipeHttpError(402));
    vi.mocked(fetchFavoriteRecipePage).mockResolvedValue(firstPage);
    const { wrapper, store } = setup();
    const { result } = renderHook(useFavoriteRecipes, { wrapper });
    await waitFor(() =>
      expect(result.current.controller.list.hasRecipes).toBe(true),
    );
    expect(fetchFavoriteRecipes).toHaveBeenCalledOnce();
    expect(fetchFavoriteRecipePage).toHaveBeenCalledOnce();
    expect(store.getState().recipe.dailyLimitIsReached).toBe(true);
    expect(store.getState().notification.title).toBe("Daily API limit reached");
  });

  it("paginates Firestore favorites using cached pages and independent cursors", async () => {
    vi.mocked(fetchFavoriteRecipePage)
      .mockResolvedValueOnce(firstPage)
      .mockResolvedValueOnce(lastPage);
    const { wrapper } = setup(undefined, true);
    const { result } = renderHook(useFavoriteRecipes, { wrapper });
    await waitFor(() =>
      expect(result.current.controller.list.hasRecipes).toBe(true),
    );
    act(() => result.current.controller.actions.goToNextPage());
    await waitFor(() =>
      expect(
        result.current.controller.list.recipes.map(({ id }) => id),
      ).toEqual([9, 10]),
    );
    expect(fetchFavoriteRecipePage).toHaveBeenLastCalledWith(
      recipes.map(({ id }) => id),
      {},
      cursor,
    );
    act(() => result.current.controller.actions.goToPreviousPage());
    expect(result.current.controller.list.recipes[0].id).toBe(1);
    act(() => result.current.controller.actions.goToNextPage());
    expect(result.current.controller.list.recipes[0].id).toBe(9);
    expect(fetchFavoriteRecipePage).toHaveBeenCalledTimes(2);
    expect(fetchFavoriteRecipes).not.toHaveBeenCalled();
  });

  it("starts a new Firestore query on sort change", async () => {
    vi.mocked(fetchFavoriteRecipePage).mockResolvedValue(firstPage);
    const { wrapper } = setup(undefined, true);
    const { result } = renderHook(useFavoriteRecipes, { wrapper });
    await waitFor(() =>
      expect(result.current.controller.list.hasRecipes).toBe(true),
    );
    act(() =>
      result.current.controller.actions.sortBySelection("calories-desc"),
    );
    await waitFor(() =>
      expect(result.current.controller.list.isLoading).toBe(false),
    );
    expect(fetchFavoriteRecipePage).toHaveBeenLastCalledWith(
      recipes.map(({ id }) => id),
      { sortBy: "calories", sortType: "desc" },
      undefined,
    );
    expect(result.current.controller.list.currentPage).toBe(1);
  });

  it("shows a safe error without automatic retries", async () => {
    vi.mocked(fetchFavoriteRecipes).mockRejectedValue(new RecipeHttpError(500));
    const { wrapper } = setup([1]);
    const { result } = renderHook(useFavoriteRecipes, { wrapper });
    await waitFor(() =>
      expect(result.current.controller.list.errorMessage).toBe(
        "Unable to load recipes. Please try again",
      ),
    );
    expect(result.current.controller.list.isLoading).toBe(false);
    expect(fetchFavoriteRecipes).toHaveBeenCalledOnce();
  });
});
