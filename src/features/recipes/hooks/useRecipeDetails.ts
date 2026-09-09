import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { notificationActions } from "../../notifications/store/notificationSlice";
import { RECIPE_DAILY_LIMIT_NOTIFICATION } from "../constants/messages";
import { recipeDetailsQueryOptions } from "../queries/recipeDetailsQuery";
import { selectRecipeDailyLimitIsReached } from "../store/recipesSelectors";
import { recipeActions } from "../store/recipesSlice";
import {
  getRecipeErrorMessage,
  isRecipeApiLimitError,
} from "../utils/recipeErrors";
import type { AppDispatch } from "../../../app/store";

export const useRecipeDetails = (recipeId: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const dailyLimitIsReached = useSelector(selectRecipeDailyLimitIsReached);
  const query = useQuery(
    recipeDetailsQueryOptions(
      recipeId,
      dailyLimitIsReached ? "firestore" : "api",
    ),
  );
  const shouldUseFallback =
    !dailyLimitIsReached && isRecipeApiLimitError(query.error);

  useEffect(() => {
    if (!shouldUseFallback) return;

    dispatch((dispatch, getState) => {
      // Multiple observers (or Strict Mode) must announce the quota switch once.
      if (selectRecipeDailyLimitIsReached(getState())) return;

      dispatch(recipeActions.setDailyLimitIsReached());
      dispatch(
        notificationActions.showNotification(RECIPE_DAILY_LIMIT_NOTIFICATION),
      );
    });
  }, [dispatch, shouldUseFallback]);

  if (query.error && !shouldUseFallback && !query.data) {
    throw new Error(getRecipeErrorMessage(query.error), { cause: query.error });
  }

  return {
    isLoading: query.isPending || shouldUseFallback,
    recipe: query.data ?? null,
  };
};
