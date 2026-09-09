import { requestRecipeJson } from "./requestRecipeJson";
import { buildRecipeDetailsUrl } from "./recipeUrls";
import type { RecipeApiResponse, RecipeDetails } from "../types";

export const fetchRecipesFromApi = async (
  requestUrl: string,
  signal?: AbortSignal,
): Promise<RecipeApiResponse> =>
  requestRecipeJson<RecipeApiResponse>(requestUrl, { signal });

export const fetchRecipeDetailsFromApi = (
  recipeId: string,
  signal?: AbortSignal,
): Promise<RecipeDetails> =>
  requestRecipeJson<RecipeDetails>(buildRecipeDetailsUrl(recipeId), { signal });
