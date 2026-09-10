import "server-only";
import { cache } from "react";
import { notFound } from "next/navigation";
import { dehydrate } from "@tanstack/react-query";
import { makeQueryClient } from "../../../app/queryClient";
import { recipeDetailsQueryKey } from "../queries/recipeDetailsQueryKey";
import {
  isRecipeApiLimitError,
  isRecipeNotFoundError,
} from "../utils/recipeErrors";
import { getRecipeDetails } from "./spoonacular";
import { recipeIdSchema } from "./recipeSchemas";
import type { RecipeDetails } from "../types";

/**
 * Loads public recipe data and prepares a request-local query cache for hydration.
 * React memoization shares the result between metadata and page rendering within
 * a server request; it does not persist data across requests.
 *
 * @returns Successful recipe data and dehydrated state, or an empty state with
 * a quota flag. Non-quota failures are left to the client loader to retry.
 * @throws Next.js's not-found signal for invalid IDs or confirmed provider 404s.
 */
export const loadRecipeDetails = cache(async (recipeId: string) => {
  if (!recipeIdSchema.safeParse(recipeId).success) notFound();
  const queryClient = makeQueryClient();
  let apiLimitReached = false;
  let recipe: RecipeDetails | null = null;

  try {
    recipe = await queryClient.query({
      queryKey: recipeDetailsQueryKey(recipeId, "api"),
      // Call the server service directly, not our own HTTP route.
      queryFn: () => getRecipeDetails(recipeId),
      retry: false,
    });
  } catch (error) {
    if (isRecipeNotFoundError(error)) {
      queryClient.clear();
      notFound();
    }
    // Failed queries are not dehydrated. Ordinary failures can retry through
    // the client loader; quota failures must go straight to its fallback.
    apiLimitReached = isRecipeApiLimitError(error);
  }

  const state = dehydrate(queryClient);
  queryClient.clear();
  return { state, apiLimitReached, recipe };
});
