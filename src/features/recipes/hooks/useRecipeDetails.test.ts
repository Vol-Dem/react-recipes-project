import { renderHook, waitFor } from "@testing-library/react";
import { useRecipeDetails } from "./useRecipeDetails";

const hookMocks = vi.hoisted(() => ({
  fetchFromFirestore: vi.fn(),
  getDataFromHttp: vi.fn(),
  state: { recipe: { dailyLimitIsReached: false } },
  throwAsyncError: vi.fn(),
}));

vi.mock("react-redux", () => ({
  useSelector: <Result>(selector: (state: typeof hookMocks.state) => Result) =>
    selector(hookMocks.state),
}));
vi.mock("../../../shared/hooks/useThrowAsyncError", () => ({
  useThrowAsyncError: () => hookMocks.throwAsyncError,
}));
vi.mock("../api/recipeRepository", () => ({
  fetchRecipeFromFirestore: hookMocks.fetchFromFirestore,
}));
vi.mock("../api/recipeUrls", () => ({
  buildRecipeDetailsUrl: (recipeId: string) => `recipe-url/${recipeId}`,
}));
vi.mock("./useGetDataFromHttp", () => ({
  useGetDataFromHttp: () => hookMocks.getDataFromHttp,
}));

describe("useRecipeDetails", () => {
  beforeEach(() => {
    hookMocks.state.recipe.dailyLimitIsReached = false;
    vi.clearAllMocks();
  });

  it("loads recipe details over HTTP while the API is available", async () => {
    const recipe = { id: 42, title: "Pasta" };
    hookMocks.getDataFromHttp.mockImplementation((_, transformData) => {
      transformData(recipe);
    });

    const { result } = renderHook(() => useRecipeDetails("42"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.recipe).toEqual(recipe);
    expect(hookMocks.getDataFromHttp).toHaveBeenCalledWith(
      { url: "recipe-url/42" },
      expect.any(Function),
    );
  });

  it("loads recipe details from Firestore after the daily limit", async () => {
    const recipe = { id: 42, title: "Pasta" };
    hookMocks.state.recipe.dailyLimitIsReached = true;
    hookMocks.fetchFromFirestore.mockResolvedValue(recipe);

    const { result } = renderHook(() => useRecipeDetails("42"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.recipe).toEqual(recipe);
    expect(hookMocks.fetchFromFirestore).toHaveBeenCalledWith("42");
    expect(hookMocks.getDataFromHttp).not.toHaveBeenCalled();
  });
});
