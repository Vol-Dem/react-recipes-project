import { cleanup, renderHook, waitFor } from "@testing-library/react";
import {
  HydrationBoundary,
  QueryClientProvider,
  type QueryClient,
} from "@tanstack/react-query";
import { Provider } from "react-redux";
import type { PropsWithChildren } from "react";
import { makeQueryClient } from "../../../app/queryClient";
import { makeStore } from "../../../app/store";
import { fetchRecipeDetailsFromApi } from "../api/recipeApi";
import { fetchRecipeFromFirestore } from "../api/recipeRepository";
import { RecipeHttpError } from "../api/requestRecipeJson";
import { useRecipeDetails } from "../hooks/useRecipeDetails";
import { recipeDetailsQueryKey } from "../queries/recipeDetailsQueryKey";
import { recipeActions } from "../store/recipesSlice";
import { getRecipeDetails } from "./spoonacular";
import { loadRecipeDetails } from "./loadRecipeDetails";
import { notFound } from "next/navigation";
import type { RecipeDetails } from "../types";

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));
vi.mock("./spoonacular", () => ({ getRecipeDetails: vi.fn() }));
vi.mock("../api/recipeApi", () => ({ fetchRecipeDetailsFromApi: vi.fn() }));
vi.mock("../api/recipeRepository", () => ({
  fetchRecipeFromFirestore: vi.fn(),
}));

const recipe: RecipeDetails = {
  id: 42,
  title: "Pasta",
  image: "",
  diets: [],
  readyInMinutes: 20,
  servings: 2,
  extendedIngredients: [],
  instructions: "",
  nutrition: { nutrients: [] },
  creditsText: "",
  sourceName: "",
  sourceUrl: "",
};

describe("server recipe details hydration", () => {
  const clients: QueryClient[] = [];
  const setup = (
    initial: Awaited<ReturnType<typeof loadRecipeDetails>>,
    fallback = false,
  ) => {
    const client = makeQueryClient();
    const store = makeStore();
    clients.push(client);
    if (fallback) store.dispatch(recipeActions.setDailyLimitIsReached());
    const wrapper = ({ children }: PropsWithChildren) => (
      <Provider store={store}>
        <QueryClientProvider client={client}>
          <HydrationBoundary state={initial.state}>
            {children}
          </HydrationBoundary>
        </QueryClientProvider>
      </Provider>
    );
    return { wrapper, store, client };
  };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(notFound).mockImplementation(() => {
      throw new Error("NEXT_NOT_FOUND");
    });
    vi.mocked(getRecipeDetails).mockResolvedValue(recipe);
  });
  afterEach(() => {
    cleanup();
    clients.splice(0).forEach((client) => client.clear());
  });

  it("renders server data immediately and reuses it on reopening without an HTTP request", async () => {
    const initial = await loadRecipeDetails("42");
    expect(getRecipeDetails).toHaveBeenCalledExactlyOnceWith("42");
    expect(initial.state.queries).toHaveLength(1);
    expect(initial.state.queries[0].queryKey).toEqual(
      recipeDetailsQueryKey("42", "api"),
    );
    const { wrapper } = setup(initial);
    const first = renderHook(
      () => useRecipeDetails("42", initial.apiLimitReached),
      { wrapper },
    );
    expect(first.result.current).toEqual({ isLoading: false, recipe });
    first.unmount();
    const second = renderHook(() => useRecipeDetails("42"), { wrapper });
    expect(second.result.current).toEqual({ isLoading: false, recipe });
    expect(fetchRecipeDetailsFromApi).not.toHaveBeenCalled();
    expect(fetchRecipeFromFirestore).not.toHaveBeenCalled();
  });

  it("isolates caches between server requests", async () => {
    vi.mocked(getRecipeDetails).mockImplementation(async (id) => ({
      ...recipe,
      id: Number(id),
    }));
    const [first, second] = await Promise.all([
      loadRecipeDetails("42"),
      loadRecipeDetails("43"),
    ]);
    expect(first.state.queries.map((query) => query.queryKey)).toEqual([
      recipeDetailsQueryKey("42", "api"),
    ]);
    expect(second.state.queries.map((query) => query.queryKey)).toEqual([
      recipeDetailsQueryKey("43", "api"),
    ]);
    expect(JSON.parse(JSON.stringify(first.state))).toEqual(first.state);
  });

  it("passes quota failures to the client fallback without repeating the failed API request", async () => {
    vi.mocked(getRecipeDetails).mockRejectedValue(new RecipeHttpError(402));
    vi.mocked(fetchRecipeFromFirestore).mockResolvedValue(recipe);
    const initial = await loadRecipeDetails("42");
    expect(initial).toEqual({
      state: { mutations: [], queries: [] },
      apiLimitReached: true,
      recipe: null,
    });
    const { wrapper, store } = setup(initial);
    const { result } = renderHook(
      () => useRecipeDetails("42", initial.apiLimitReached),
      { wrapper },
    );
    await waitFor(() => expect(result.current.recipe).toEqual(recipe));
    expect(store.getState().recipe.dailyLimitIsReached).toBe(true);
    expect(store.getState().notification.title).toBe("Daily API limit reached");
    expect(getRecipeDetails).toHaveBeenCalledOnce();
    expect(fetchRecipeDetailsFromApi).not.toHaveBeenCalled();
    expect(fetchRecipeFromFirestore).toHaveBeenCalledExactlyOnceWith("42");
  });

  it("leaves ordinary failures to the existing client loader without serializing server errors", async () => {
    vi.mocked(getRecipeDetails).mockRejectedValue(
      new Error("Private upstream details"),
    );
    vi.mocked(fetchRecipeDetailsFromApi).mockResolvedValue(recipe);
    const initial = await loadRecipeDetails("42");
    expect(initial).toEqual({
      state: { mutations: [], queries: [] },
      apiLimitReached: false,
      recipe: null,
    });
    const { wrapper } = setup(initial);
    const { result } = renderHook(
      () => useRecipeDetails("42", initial.apiLimitReached),
      { wrapper },
    );
    await waitFor(() => expect(result.current.recipe).toEqual(recipe));
    expect(getRecipeDetails).toHaveBeenCalledOnce();
    expect(fetchRecipeDetailsFromApi).toHaveBeenCalledOnce();
  });

  it("honors an existing client fallback instead of mixing API and Firestore data", async () => {
    vi.mocked(fetchRecipeFromFirestore).mockResolvedValue({
      ...recipe,
      title: "Saved recipe",
    });
    const initial = await loadRecipeDetails("42");
    const { wrapper } = setup(initial, true);
    const { result } = renderHook(
      () => useRecipeDetails("42", initial.apiLimitReached),
      { wrapper },
    );
    expect(result.current.recipe).toBeNull();
    await waitFor(() =>
      expect(result.current.recipe?.title).toBe("Saved recipe"),
    );
    expect(fetchRecipeDetailsFromApi).not.toHaveBeenCalled();
  });

  it.each(["abc", "0", "-1", "1.5", "9007199254740992"])(
    "rejects invalid route ID %s before calling the provider",
    async (id) => {
      await expect(loadRecipeDetails(id)).rejects.toThrow("NEXT_NOT_FOUND");
      expect(notFound).toHaveBeenCalledOnce();
      expect(getRecipeDetails).not.toHaveBeenCalled();
    },
  );

  it("uses Next's not-found boundary for confirmed provider 404s", async () => {
    vi.mocked(getRecipeDetails).mockRejectedValue(new RecipeHttpError(404));
    await expect(loadRecipeDetails("42")).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalledOnce();
    expect(getRecipeDetails).toHaveBeenCalledOnce();
  });
});
