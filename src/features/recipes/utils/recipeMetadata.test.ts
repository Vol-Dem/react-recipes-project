import { buildRecipeMetadata } from "./recipeMetadata";
import type { RecipeDetails } from "../types";

const recipe = {
  title: "Pasta & beans",
  readyInMinutes: 20,
  servings: 2,
  image: "https://img.spoonacular.com/recipes/42.jpg",
} as RecipeDetails;

describe("recipe metadata", () => {
  it("builds titles, descriptions, and social previews from the loaded recipe", () => {
    const metadata = buildRecipeMetadata(recipe);
    expect(metadata.title).toBe(recipe.title);
    expect(metadata.description).toContain("Ready in 20 minutes, serves 2");
    expect(metadata.openGraph).toMatchObject({
      title: recipe.title,
      images: [recipe.image],
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      images: [recipe.image],
    });
  });
  it.each(["", "/local.jpg", "javascript:alert(1)"])(
    "does not publish unusable social images: %s",
    (image) => {
      expect(buildRecipeMetadata({ ...recipe, image }).twitter).toMatchObject({
        card: "summary",
        images: [],
      });
    },
  );
  it("keeps generic metadata when the provider is unavailable", () => {
    expect(buildRecipeMetadata(null)).toEqual({ title: "Recipe Details" });
  });
});
