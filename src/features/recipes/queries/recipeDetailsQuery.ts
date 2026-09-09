import { queryOptions } from "@tanstack/react-query";
import { fetchRecipeDetailsFromApi } from "../api/recipeApi";
import { fetchRecipeFromFirestore } from "../api/recipeRepository";
import { RecipeHttpError } from "../api/requestRecipeJson";
import {
  recipeDetailsQueryKey,
  type RecipeDetailsSource,
} from "./recipeDetailsQueryKey";
import {
  RECIPE_DETAILS_GC_TIME_MS,
  RECIPE_DETAILS_STALE_TIME_MS,
} from "../constants/queries";

export const recipeDetailsQueryOptions = (
  recipeId: string,
  source: RecipeDetailsSource,
) =>
  queryOptions({
    queryKey: recipeDetailsQueryKey(recipeId, source),
    queryFn: async ({ signal }) => {
      if (source === "api") {
        return fetchRecipeDetailsFromApi(recipeId, signal);
      }

      const recipe = await fetchRecipeFromFirestore(recipeId);

      if (!recipe) {
        throw new RecipeHttpError(404);
      }

      return recipe;
    },
    staleTime: RECIPE_DETAILS_STALE_TIME_MS,
    gcTime: RECIPE_DETAILS_GC_TIME_MS,
    // Keep quota usage predictable; navigating back can retry a failed request.
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
