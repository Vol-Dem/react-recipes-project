import { fetchRecipeDetailsFromApi, fetchRecipesFromApi } from "./recipeApi";
import {
  isRecipeApiLimitError,
  getRecipeErrorMessage,
} from "../utils/recipeErrors";

describe("recipe HTTP requests", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it.each([{ results: [{ id: 1 }] }, [{ id: 1 }]])(
    "preserves successful endpoint response shapes",
    async (data) => {
      vi.mocked(fetch).mockResolvedValue(Response.json(data));
      await expect(fetchRecipesFromApi("/api/recipes/search")).resolves.toEqual(
        data,
      );
      expect(fetch).toHaveBeenCalledWith("/api/recipes/search", {
        signal: expect.any(AbortSignal),
      });
    },
  );

  it("preserves quota errors even when the response is not JSON", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response("Upstream error", { status: 402 }),
    );
    const error = await fetchRecipesFromApi("/api/recipes/search").catch(
      (error) => error,
    );
    expect(isRecipeApiLimitError(error)).toBe(true);
    expect(error.message).not.toContain("Upstream");
  });

  it("recognizes quota failures inside successful HTTP responses", async () => {
    vi.mocked(fetch).mockResolvedValue(
      Response.json({ status: "failure", code: 402 }),
    );
    await expect(
      fetchRecipesFromApi("/api/recipes/search"),
    ).rejects.toMatchObject({ status: 402 });
  });

  it("reports invalid JSON as an upstream error", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response("<html>Error</html>"));
    await expect(
      fetchRecipesFromApi("/api/recipes/search"),
    ).rejects.toMatchObject({ status: 502 });
  });

  it("preserves fetch failures", async () => {
    const error = new TypeError("Failed to fetch");
    vi.mocked(fetch).mockRejectedValue(error);
    await expect(fetchRecipesFromApi("/api/recipes/search")).rejects.toBe(
      error,
    );
  });

  it("aborts a pending request on timeout", async () => {
    const controller = new AbortController();
    vi.spyOn(AbortSignal, "timeout").mockReturnValue(controller.signal);
    vi.mocked(fetch).mockImplementation(
      (_url, options) =>
        new Promise((_resolve, reject) => {
          options!.signal!.addEventListener("abort", () =>
            reject(options!.signal!.reason),
          );
        }),
    );
    const request = fetchRecipesFromApi("/api/recipes/search");
    const assertion = expect(request).rejects.toMatchObject({
      name: "TimeoutError",
    });
    controller.abort(new DOMException("Timed out", "TimeoutError"));
    await assertion;
  });

  it("loads details through the local endpoint and forwards cancellation", async () => {
    const controller = new AbortController();
    vi.mocked(fetch).mockResolvedValue(Response.json({}));
    await fetchRecipeDetailsFromApi("42", controller.signal);
    expect(fetch).toHaveBeenCalledWith("/api/recipes/42", {
      signal: expect.any(AbortSignal),
    });
    const signal = vi.mocked(fetch).mock.calls[0][1]!.signal!;
    controller.abort();
    expect(signal.aborted).toBe(true);
  });

  it("presents server timeout responses as timeouts", () => {
    expect(getRecipeErrorMessage({ status: 504 })).toBe(
      "The recipe request took too long. Please try again",
    );
  });
});
