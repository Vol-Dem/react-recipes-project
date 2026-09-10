import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { notFound } from "next/navigation";
import { recipeDetailsQueryOptions } from "../queries/recipeDetailsQuery";
import { selectRecipeDailyLimitIsReached } from "../store/recipesSelectors";
import {
  getRecipeErrorMessage,
  isRecipeNotFoundError,
} from "../utils/recipeErrors";
import { useRecipeApiFallback } from "./useRecipeApiFallback";

export const useRecipeDetails = (
  recipeId: string,
  initialApiLimitReached = false,
) => {
  const dailyLimitIsReached = useSelector(selectRecipeDailyLimitIsReached);
  const query = useQuery({
    ...recipeDetailsQueryOptions(
      recipeId,
      dailyLimitIsReached ? "firestore" : "api",
    ),
    // Do not repeat a server request that already exhausted the API quota.
    enabled: !initialApiLimitReached || dailyLimitIsReached,
  });
  const shouldUseFallback = useRecipeApiFallback(
    query.error,
    initialApiLimitReached,
  );

  if (query.error && !shouldUseFallback && !query.data) {
    if (isRecipeNotFoundError(query.error)) notFound();
    throw new Error(getRecipeErrorMessage(query.error), { cause: query.error });
  }

  return {
    isLoading: query.isPending || shouldUseFallback,
    recipe: query.data ?? null,
  };
};
