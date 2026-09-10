import { Component, type PropsWithChildren } from "react";
import {
  act,
  cleanup,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { makeQueryClient } from "../../../app/queryClient";
import { makeStore } from "../../../app/store";
import { notificationActions } from "../../notifications/store/notificationSlice";
import { fetchRecipeDetailsFromApi } from "../api/recipeApi";
import { fetchRecipeFromFirestore } from "../api/recipeRepository";
import { RecipeHttpError } from "../api/requestRecipeJson";
import { RECIPE_DAILY_LIMIT_NOTIFICATION } from "../constants/messages";
import { recipeDetailsQueryOptions } from "../queries/recipeDetailsQuery";
import { recipeActions } from "../store/recipesSlice";
import { useRecipeDetails } from "./useRecipeDetails";
import type { RecipeDetails } from "../types";
import { notFound } from "next/navigation";

vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
}));

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

class TestErrorBoundary extends Component<
  PropsWithChildren,
  { error: Error | null }
> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    return this.state.error ? (
      <p role="alert">{this.state.error.message}</p>
    ) : (
      this.props.children
    );
  }
}

const DetailsProbe = () => {
  const { recipe, isLoading } = useRecipeDetails("42");
  return <p>{isLoading ? "Loading" : recipe?.title}</p>;
};

describe("useRecipeDetails", () => {
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
    vi.mocked(notFound).mockImplementation(() => {
      throw new Error("Recipe not found");
    });
  });
  afterEach(() => {
    cleanup();
    clients.splice(0).forEach((client) => client.clear());
    vi.restoreAllMocks();
  });

  it("loads details and reuses fresh data when the recipe reopens", async () => {
    vi.mocked(fetchRecipeDetailsFromApi).mockResolvedValue(recipe);
    const { wrapper } = setup();
    const first = renderHook(() => useRecipeDetails("42"), { wrapper });
    expect(first.result.current).toEqual({ isLoading: true, recipe: null });
    await waitFor(() => expect(first.result.current.recipe).toEqual(recipe));
    first.unmount();

    const second = renderHook(() => useRecipeDetails("42"), { wrapper });
    expect(second.result.current).toEqual({ isLoading: false, recipe });
    expect(fetchRecipeDetailsFromApi).toHaveBeenCalledExactlyOnceWith(
      "42",
      expect.any(AbortSignal),
    );
  });

  it("deduplicates requests shared by multiple observers", async () => {
    vi.mocked(fetchRecipeDetailsFromApi).mockResolvedValue(recipe);
    const { wrapper } = setup();
    const { result } = renderHook(
      () => [useRecipeDetails("42"), useRecipeDetails("42")],
      { wrapper },
    );
    await waitFor(() =>
      expect(result.current.every((details) => details.recipe === recipe)).toBe(
        true,
      ),
    );
    expect(fetchRecipeDetailsFromApi).toHaveBeenCalledOnce();
  });

  it("switches to Firestore on quota failure without retrying the API", async () => {
    vi.mocked(fetchRecipeDetailsFromApi).mockRejectedValue(
      new RecipeHttpError(402),
    );
    vi.mocked(fetchRecipeFromFirestore).mockResolvedValue(recipe);
    const { wrapper, store } = setup();
    const showNotification = vi.spyOn(notificationActions, "showNotification");
    const { result } = renderHook(
      () => [useRecipeDetails("42"), useRecipeDetails("42")],
      { wrapper },
    );
    await waitFor(() =>
      expect(result.current.every((details) => details.recipe === recipe)).toBe(
        true,
      ),
    );
    expect(store.getState().recipe.dailyLimitIsReached).toBe(true);
    expect(store.getState().notification).toMatchObject({
      ...RECIPE_DAILY_LIMIT_NOTIFICATION,
      isShown: true,
    });
    expect(showNotification).toHaveBeenCalledExactlyOnceWith(
      RECIPE_DAILY_LIMIT_NOTIFICATION,
    );
    expect(fetchRecipeDetailsFromApi).toHaveBeenCalledOnce();
    expect(fetchRecipeFromFirestore).toHaveBeenCalledExactlyOnceWith("42");
  });

  it("keeps API and fallback caches separate", async () => {
    vi.mocked(fetchRecipeFromFirestore).mockResolvedValue(recipe);
    const { wrapper, client } = setup(true);
    client.setQueryData(recipeDetailsQueryOptions("42", "api").queryKey, {
      ...recipe,
      title: "API version",
    });
    const { result } = renderHook(() => useRecipeDetails("42"), { wrapper });
    expect(result.current.recipe).toBeNull();
    await waitFor(() => expect(result.current.recipe).toEqual(recipe));
    expect(fetchRecipeDetailsFromApi).not.toHaveBeenCalled();
  });

  it("cancels the old HTTP request and does not show its result after the ID changes", async () => {
    let resolveOld!: (value: RecipeDetails) => void;
    vi.mocked(fetchRecipeDetailsFromApi)
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveOld = resolve;
          }),
      )
      .mockResolvedValueOnce({ ...recipe, id: 43, title: "Soup" });
    const { wrapper } = setup();
    const { result, rerender } = renderHook(({ id }) => useRecipeDetails(id), {
      wrapper,
      initialProps: { id: "42" },
    });
    const signal = vi.mocked(fetchRecipeDetailsFromApi).mock.calls[0][1]!;
    rerender({ id: "43" });
    expect(signal.aborted).toBe(true);
    expect(result.current.recipe).toBeNull();
    await waitFor(() => expect(result.current.recipe?.title).toBe("Soup"));
    await act(async () => {
      resolveOld(recipe);
    });
    expect(result.current.recipe?.title).toBe("Soup");
  });

  it("cancels a pending HTTP request when its last observer unmounts", () => {
    vi.mocked(fetchRecipeDetailsFromApi).mockImplementation(
      () => new Promise(() => {}),
    );
    const { wrapper } = setup();
    const { unmount } = renderHook(() => useRecipeDetails("42"), { wrapper });
    const signal = vi.mocked(fetchRecipeDetailsFromApi).mock.calls[0][1]!;
    unmount();
    expect(signal.aborted).toBe(true);
  });

  it.each([
    [
      false,
      new RecipeHttpError(500),
      "Unable to load recipes. Please try again",
    ],
    [
      false,
      new TypeError("Internal network details"),
      "Internet connection lost. Check your connection settings",
    ],
    [true, undefined, "Recipe not found"],
  ])(
    "handles failures with safe messages (fallback: %s)",
    async (fallback, error, message) => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      vi.mocked(fetchRecipeDetailsFromApi).mockRejectedValue(error);
      vi.mocked(fetchRecipeFromFirestore).mockResolvedValue(undefined);
      const { wrapper } = setup(fallback);
      render(
        <TestErrorBoundary>
          <DetailsProbe />
        </TestErrorBoundary>,
        { wrapper },
      );
      expect(await screen.findByRole("alert")).toHaveTextContent(message);
      expect(
        fallback ? fetchRecipeFromFirestore : fetchRecipeDetailsFromApi,
      ).toHaveBeenCalledOnce();
      if (fallback) expect(notFound).toHaveBeenCalled();
    },
  );
});
