import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { notificationActions } from "../../notifications/store/notificationSlice";
import { RECIPE_DAILY_LIMIT_NOTIFICATION } from "../constants/messages";
import { selectRecipeDailyLimitIsReached } from "../store/recipesSelectors";
import { recipeActions } from "../store/recipesSlice";
import { isRecipeApiLimitError } from "../utils/recipeErrors";
import type { AppDispatch } from "../../../app/store";

export const useRecipeApiFallback = (error: unknown) => {
  const dispatch = useDispatch<AppDispatch>();
  const dailyLimitIsReached = useSelector(selectRecipeDailyLimitIsReached);
  const shouldUseFallback =
    !dailyLimitIsReached && isRecipeApiLimitError(error);

  useEffect(() => {
    if (!shouldUseFallback) return;

    dispatch((dispatch, getState) => {
      // Concurrent search/detail failures and Strict Mode must announce once.
      if (selectRecipeDailyLimitIsReached(getState())) return;
      dispatch(recipeActions.setDailyLimitIsReached());
      dispatch(
        notificationActions.showNotification(RECIPE_DAILY_LIMIT_NOTIFICATION),
      );
    });
  }, [dispatch, shouldUseFallback]);

  return shouldUseFallback;
};
