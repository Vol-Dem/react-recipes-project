import {
  buildRecipeDetailsHref,
  buildRecipeSearchHref,
  parseRecipeSearchParams,
} from "./recipeNavigation";
import { INVALID_SEARCH_MESSAGE } from "../constants/search";

describe("recipe navigation URLs", () => {
  it("round-trips every submitted filter with safe URL encoding", () => {
    const filters = {
      query: "rice & beans?",
      cuisine: "Mediterranean",
      diet: "vegan",
      intolerance: "gluten",
      type: "main course",
      maxReadyTime: "30",
      minCalories: "100",
      maxCalories: "500",
    };
    const href = buildRecipeSearchHref(filters);
    expect(href).toContain("query=rice+%26+beans%3F");
    expect(
      parseRecipeSearchParams(
        new URL(href, "https://example.test").searchParams,
      ),
    ).toEqual({ filters, errorMessage: "" });
  });

  it("distinguishes the landing page from an intentionally empty search", () => {
    expect(
      parseRecipeSearchParams(new URLSearchParams("utm_source=example")),
    ).toEqual({ filters: null, errorMessage: "" });
    expect(parseRecipeSearchParams(null)).toEqual({
      filters: null,
      errorMessage: "",
    });
    expect(buildRecipeSearchHref({})).toBe("/?query=");
    expect(parseRecipeSearchParams(new URLSearchParams("query="))).toEqual({
      filters: { query: "" },
      errorMessage: "",
    });
  });

  it("accepts filter-only links and ignores unrelated parameters", () => {
    expect(
      parseRecipeSearchParams(
        new URLSearchParams("diet=vegan&tracking=ignored"),
      ),
    ).toEqual({ filters: { diet: "vegan" }, errorMessage: "" });
    expect(buildRecipeSearchHref({ diet: "vegan", cuisine: "" })).toBe(
      "/?query=&diet=vegan",
    );
  });

  it.each([
    "maxReadyTime=-1",
    "maxReadyTime=1000",
    "minCalories=not-a-number",
    "minCalories=500&maxCalories=100",
    `query=${"a".repeat(501)}`,
  ])("rejects invalid filters: %s", (query) => {
    expect(parseRecipeSearchParams(new URLSearchParams(query))).toEqual({
      filters: null,
      errorMessage: INVALID_SEARCH_MESSAGE,
    });
  });

  it("preserves search context in detail links without changing favorites routes", () => {
    expect(buildRecipeDetailsHref(152, "/?query=pasta&diet=vegan")).toBe(
      "/recipe/152?query=pasta&diet=vegan",
    );
    expect(buildRecipeDetailsHref(152, "/favorites")).toBe(
      "/favorites/recipe/152",
    );
    expect(buildRecipeDetailsHref(152, "/")).toBe("/recipe/152");
  });
});
