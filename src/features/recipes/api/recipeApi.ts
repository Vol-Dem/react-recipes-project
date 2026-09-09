import { requestRecipeJson } from "./requestRecipeJson";
import { buildRecipeDetailsUrl } from "./recipeUrls";
import type { RecipeApiResponse, RecipeDetails } from "../types";

export const fetchRecipesFromApi = async (
  requestUrl: string,
): Promise<RecipeApiResponse> =>
  requestRecipeJson<RecipeApiResponse>(requestUrl);

export const fetchRecipeDetailsFromApi = (
  recipeId: string,
  signal?: AbortSignal,
): Promise<RecipeDetails> =>
  requestRecipeJson<RecipeDetails>(buildRecipeDetailsUrl(recipeId), { signal });
