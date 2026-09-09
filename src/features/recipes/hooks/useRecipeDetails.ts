import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { recipeDetailsQueryOptions } from "../queries/recipeDetailsQuery";
import { selectRecipeDailyLimitIsReached } from "../store/recipesSelectors";
import { getRecipeErrorMessage } from "../utils/recipeErrors";
import { useRecipeApiFallback } from "./useRecipeApiFallback";

export const useRecipeDetails = (recipeId: string) => {
  const dailyLimitIsReached = useSelector(selectRecipeDailyLimitIsReached);
  const query = useQuery(
    recipeDetailsQueryOptions(
      recipeId,
      dailyLimitIsReached ? "firestore" : "api",
    ),
  );
  const shouldUseFallback = useRecipeApiFallback(query.error);

  if (query.error && !shouldUseFallback && !query.data) {
    throw new Error(getRecipeErrorMessage(query.error), { cause: query.error });
  }

  return {
    isLoading: query.isPending || shouldUseFallback,
    recipe: query.data ?? null,
  };
};
