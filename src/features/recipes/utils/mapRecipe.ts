import type { RecipeApiItem, RecipeSummary } from "../types";

export const mapRecipe = (recipe: RecipeApiItem): RecipeSummary => ({
  id: recipe.id,
  title: recipe.title,
  img: recipe.image,
  readyInMinutes: recipe.readyInMinutes,
  calories:
    recipe.nutrition.nutrients.find(({ name }) => name === "Calories")
      ?.amount ?? 0,
  servings: recipe.servings,
});
