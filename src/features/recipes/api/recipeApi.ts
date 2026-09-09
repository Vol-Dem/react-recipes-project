import { requestRecipeJson } from "./requestRecipeJson";
import type { RecipeApiResponse } from "../types";

export const fetchRecipesFromApi = async (
  requestUrl: string,
): Promise<RecipeApiResponse> =>
  requestRecipeJson<RecipeApiResponse>(requestUrl);
