import {
  INCLUDE_NUTRITION,
  INCLUDE_SEARCH_NUTRITION,
  RESULT_NUM,
  SPOONACULAR_API_KEY,
  SPOONACULAR_API_URL,
} from "../../../shared/constants";
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
      `${SPOONACULAR_API_URL}/recipes/complexSearch?apiKey=${SPOONACULAR_API_KEY}&query=pasta&cuisine=italian&diet=&intolerances=&type=&maxReadyTime=30&minCalories=200&maxCalories=600&number=${RESULT_NUM}&addRecipeNutrition=${INCLUDE_SEARCH_NUTRITION}`,
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
      `${SPOONACULAR_API_URL}/recipes/informationBulk?apiKey=${SPOONACULAR_API_KEY}&ids=10%2C20&includeNutrition=${INCLUDE_SEARCH_NUTRITION}`,
    );
  });

  it("builds a recipe-details URL", () => {
    expect(buildRecipeDetailsUrl(42)).toBe(
      `${SPOONACULAR_API_URL}/recipes/42/information?apiKey=${SPOONACULAR_API_KEY}&includeNutrition=${INCLUDE_NUTRITION}`,
    );
  });
});
