import {
  INCLUDE_NUTRITION,
  INCLUDE_SEARCH_NUTRITION,
  RESULT_NUM,
  SPOONACULAR_API_KEY,
  SPOONACULAR_API_URL,
} from "../../../shared/constants";
import type { SearchFilters } from "../types";

type RecipeUrlParameters = Record<
  string,
  string | number | boolean | undefined
>;

const createRecipeUrl = (path: string, parameters: RecipeUrlParameters) => {
  const searchParameters = new URLSearchParams(
    Object.fromEntries(
      Object.entries(parameters)
        .filter(
          (entry): entry is [string, string | number | boolean] =>
            entry[1] !== undefined,
        )
        .map(([name, value]) => [name, String(value)]),
    ),
  );

  return `${SPOONACULAR_API_URL}${path}?${searchParameters}`;
};

export const buildRecipeSearchUrl = ({
  query = "",
  cuisine = "",
  diet = "",
  intolerance = "",
  type = "",
  maxReadyTime = "",
  minCalories = "",
  maxCalories = "",
}: SearchFilters = {}) => {
  const parameters: RecipeUrlParameters = {
    apiKey: SPOONACULAR_API_KEY,
    query,
    cuisine,
    diet,
    intolerances: intolerance,
    type,
  };

  if (maxReadyTime) parameters.maxReadyTime = maxReadyTime;
  if (minCalories) parameters.minCalories = minCalories;
  if (maxCalories) parameters.maxCalories = maxCalories;

  parameters.number = RESULT_NUM;
  parameters.addRecipeNutrition = INCLUDE_SEARCH_NUTRITION;

  return createRecipeUrl("/recipes/complexSearch", parameters);
};

export const buildFavoriteRecipesUrl = (recipeIds: number[]) =>
  createRecipeUrl("/recipes/informationBulk", {
    apiKey: SPOONACULAR_API_KEY,
    ids: recipeIds.join(","),
    includeNutrition: INCLUDE_SEARCH_NUTRITION,
  });

export const buildRecipeDetailsUrl = (recipeId: string | number) =>
  createRecipeUrl(`/recipes/${recipeId}/information`, {
    apiKey: SPOONACULAR_API_KEY,
    includeNutrition: INCLUDE_NUTRITION,
  });
