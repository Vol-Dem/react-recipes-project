import "server-only";
import { dehydrate } from "@tanstack/react-query";
import { makeQueryClient } from "../../../app/queryClient";
import { recipeDetailsQueryKey } from "../queries/recipeDetailsQueryKey";
import { isRecipeApiLimitError } from "../utils/recipeErrors";
import { getRecipeDetails } from "./spoonacular";

export const loadRecipeDetails = async (recipeId: string) => {
  const queryClient = makeQueryClient();
  let apiLimitReached = false;

  try {
    await queryClient.query({
      queryKey: recipeDetailsQueryKey(recipeId, "api"),
      // Call the server service directly, not our own HTTP route.
      queryFn: () => getRecipeDetails(recipeId),
      retry: false,
    });
  } catch (error) {
    // Failed queries are not dehydrated. Ordinary failures can retry through
    // the client loader; quota failures must go straight to its fallback.
    apiLimitReached = isRecipeApiLimitError(error);
  }

  const state = dehydrate(queryClient);
  queryClient.clear();
  return { state, apiLimitReached };
};
