// @vitest-environment node
import { GET as search } from "../../../app/api/recipes/search/route";
import { GET as bulk } from "../../../app/api/recipes/bulk/route";
import { GET as details } from "../../../app/api/recipes/[recipeId]/route";
import { getPublicEnvironment } from "../../../../config/publicEnvironment";
import {
  INCLUDE_NUTRITION,
  INCLUDE_SEARCH_NUTRITION,
  RESULT_NUM,
} from "../../../shared/constants/app";

vi.mock("server-only", () => ({}));

const recipe = {
  id: 42,
  title: "Pasta",
  image: "https://img.spoonacular.com/recipes/42-312x231.jpg",
  readyInMinutes: 20,
  servings: 2,
  nutrition: { nutrients: [{ name: "Calories", amount: 200, unit: "kcal" }] },
};
const request = (path: string) =>
  new Request(`http://localhost/api/recipes/${path}`);
const recipeContext = (recipeId: string) => ({
  params: Promise.resolve({ recipeId }),
});

describe("recipe Route Handlers and Spoonacular service", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    vi.stubEnv("SPOONACULAR_API_URL", "https://api.spoonacular.com");
    vi.stubEnv("SPOONACULAR_API_KEY", "server-test-key");
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("validates search input and sends server-owned options upstream", async () => {
    vi.mocked(fetch).mockResolvedValue(
      Response.json({
        results: [recipe],
        totalResults: 1,
      }),
    );
    const response = await search(
      request(
        "search?query=pasta&intolerance=gluten&maxReadyTime=30&minCalories=0",
      ),
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ results: [recipe] });
    expect(response.headers.get("cache-control")).toBe("no-store");
    const [url, options] = vi.mocked(fetch).mock.calls[0];
    const upstream = new URL(String(url));
    expect(upstream.origin).toBe("https://api.spoonacular.com");
    expect(upstream.pathname).toBe("/recipes/complexSearch");
    expect(Object.fromEntries(upstream.searchParams)).toEqual({
      apiKey: "server-test-key",
      query: "pasta",
      intolerances: "gluten",
      maxReadyTime: "30",
      minCalories: "0",
      number: String(RESULT_NUM),
      addRecipeNutrition: String(INCLUDE_SEARCH_NUTRITION),
    });
    expect(options).toMatchObject({ cache: "no-store", redirect: "error" });
  });

  it("returns bulk recipes for favorites with nutrition enabled", async () => {
    vi.mocked(fetch).mockResolvedValue(Response.json([recipe]));
    const response = await bulk(request("bulk?ids=42,43"));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([recipe]);
    const upstream = new URL(String(vi.mocked(fetch).mock.calls[0][0]));
    expect(upstream.pathname).toBe("/recipes/informationBulk");
    expect(upstream.searchParams.get("ids")).toBe("42,43");
    expect(upstream.searchParams.get("includeNutrition")).toBe(
      String(INCLUDE_SEARCH_NUTRITION),
    );
  });

  it("handles missing optional details without requesting additional nutrition", async () => {
    vi.mocked(fetch).mockResolvedValue(
      Response.json({
        ...recipe,
        nutrition: undefined,
        instructions: null,
        extendedIngredients: [
          { id: null, name: "Salt", amount: 1, unit: null },
        ],
        sourceName: null,
      }),
    );
    const response = await details(request("42"), recipeContext("42"));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      title: "Pasta",
      instructions: "",
      diets: [],
      nutrition: { nutrients: [] },
      sourceName: "",
      creditsText: "",
      sourceUrl: "",
      extendedIngredients: [{ id: 0, name: "Salt", amount: 1, unit: "" }],
    });
    const upstream = new URL(String(vi.mocked(fetch).mock.calls[0][0]));
    expect(upstream.pathname).toBe("/recipes/42/information");
    expect(upstream.searchParams.get("includeNutrition")).toBe(
      String(INCLUDE_NUTRITION),
    );
  });

  it.each([
    "search?maxReadyTime=-1",
    "search?maxReadyTime=1000",
    "search?minCalories=invalid",
    "search?minCalories=500&maxCalories=100",
    "search?apiKey=client-key",
    "search?number=1000",
    "search?url=https://example.com",
  ])("rejects invalid search input before fetching: %s", async (path) => {
    const response = await search(request(path));
    expect(response.status).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each(["0", "-1", "abc", "../search", "9007199254740992"])(
    "rejects invalid recipe IDs: %s",
    async (id) => {
      const response = await details(request("invalid"), recipeContext(id));
      expect(response.status).toBe(400);
      expect(fetch).not.toHaveBeenCalled();
    },
  );

  it.each(["", "42,nope", "42,-1"])(
    "rejects invalid bulk IDs: %s",
    async (ids) => {
      const response = await bulk(
        request(`bulk?ids=${encodeURIComponent(ids)}`),
      );
      expect(response.status).toBe(400);
      expect(fetch).not.toHaveBeenCalled();
    },
  );

  it.each([402, 404, 429, 500])(
    "preserves status %s without exposing upstream error bodies",
    async (status) => {
      vi.mocked(fetch).mockResolvedValue(
        new Response("server-test-key: private details", { status }),
      );
      const response = await search(request("search"));
      expect(response.status).toBe(status);
      const data = await response.json();
      expect(data).toMatchObject({ status: "failure", code: status });
      expect(JSON.stringify(data)).not.toMatch(
        /server-test-key|private details/,
      );
    },
  );

  it("preserves quota failure codes returned with HTTP 200", async () => {
    vi.mocked(fetch).mockResolvedValue(
      Response.json({
        status: "failure",
        code: 402,
        message: "server-test-key",
      }),
    );
    const response = await details(request("42"), recipeContext("42"));
    expect(response.status).toBe(402);
    expect(await response.text()).not.toContain("server-test-key");
  });

  it("treats malformed provider data as 502 rather than invalid user input", async () => {
    vi.mocked(fetch).mockResolvedValue(
      Response.json({ results: [{ id: "invalid" }] }),
    );
    const response = await search(request("search"));
    expect(response.status).toBe(502);
  });

  it("treats invalid provider JSON as 502", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response("<html>not JSON</html>"));
    const response = await search(request("search"));
    expect(response.status).toBe(502);
  });

  it.each([
    [
      Object.assign(new Error("private timeout"), { name: "TimeoutError" }),
      504,
    ],
    [new TypeError("private network details"), 503],
    [new Error("server-test-key"), 500],
  ])("normalizes transport errors safely", async (error, status) => {
    vi.mocked(fetch).mockRejectedValue(error);
    const response = await search(request("search"));
    expect(response.status).toBe(status);
    expect(await response.text()).not.toMatch(/private|server-test-key/);
  });

  it("fails safely when server configuration is missing", async () => {
    vi.stubEnv("SPOONACULAR_API_KEY", "");
    const response = await search(request("search"));
    expect(response.status).toBe(500);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("does not expose Spoonacular values through the public environment bridge", () => {
    const publicValues = getPublicEnvironment({
      SPOONACULAR_API_KEY: "server-test-key",
      NEXT_PUBLIC_SPOONACULAR_API_KEY: "old-public-key",
      VITE_SPOONACULAR_API_KEY: "old-vite-key",
      VITE_FIREBASE_PROJECT_ID: "test-project",
    });
    expect(publicValues.NEXT_PUBLIC_FIREBASE_PROJECT_ID).toBe("test-project");
    expect(JSON.stringify(publicValues)).not.toMatch(
      /SPOONACULAR|server-test-key|old-public-key|old-vite-key/,
    );
  });
});
