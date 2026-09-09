import {
  buildFavoriteRecipesUrl,
  buildRecipeDetailsUrl,
  buildRecipeSearchUrl,
} from "./recipeUrls";

describe("recipe URL builders", () => {
  it("builds a search URL with optional filters", () => {
    const url = buildRecipeSearchUrl({
      query: "pasta",
      cuisine: "italian",
      maxReadyTime: "30",
      minCalories: "200",
      maxCalories: "600",
    });

    expect(url).toBe(
      "/api/recipes/search?query=pasta&cuisine=italian&diet=&intolerance=&type=&maxReadyTime=30&minCalories=200&maxCalories=600",
    );
  });

  it("omits empty optional numeric filters", () => {
    const url = buildRecipeSearchUrl();

    expect(url).not.toContain("maxReadyTime");
    expect(url).not.toContain("minCalories");
    expect(url).not.toContain("maxCalories");
  });

  it("builds a favorite-recipes URL", () => {
    expect(buildFavoriteRecipesUrl([10, 20])).toBe(
      "/api/recipes/bulk?ids=10%2C20",
    );
  });

  it("builds a recipe-details URL", () => {
    expect(buildRecipeDetailsUrl(42)).toBe("/api/recipes/42");
  });
});
