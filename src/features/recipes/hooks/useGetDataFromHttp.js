import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useMatches, useNavigate } from "react-router-dom";
import { TIMEOUT_SEC } from "../../../shared/constants";
import { useThrowAsyncError } from "../../../shared/hooks/useThrowAsyncError";
import { timeout } from "../../../shared/utils/async";
import { notificationActions } from "../../notifications/store/notificationSlice";
import { RECIPE_DAILY_LIMIT_NOTIFICATION } from "../constants/messages";
import { recipeActions } from "../store/recipesSlice";
import { getRecipes } from "../store/recipesThunks";
import {
  getRecipeErrorMessage,
  isRecipeApiLimitError,
} from "../utils/recipeErrors";

export const useGetDataFromHttp = () => {
  const throwAsyncError = useThrowAsyncError();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const matches = useMatches();

  const getData = useCallback(
    async ({ url, method, headers, body }, transformData) => {
      try {
        const response = fetch(`${url}`, {
          method: method || "GET",
          headers: headers || {},
          body: body ? JSON.stringify(body) : null,
        });

        const res = await Promise.race([response, timeout(TIMEOUT_SEC)]);
        const data = await res.json();
        const responseError = Object.assign(
          new Error("Recipe request failed"),
          { response: { data, status: res.status } },
        );

        if (isRecipeApiLimitError(responseError)) {
          dispatch(recipeActions.setDailyLimitIsReached());
          dispatch(recipeActions.resetRecipes());
          navigate(`${matches[1].pathname}`);
          dispatch(getRecipes({}));
          dispatch(
            notificationActions.showNotification(
              RECIPE_DAILY_LIMIT_NOTIFICATION,
            ),
          );
          return;
        }

        if (!res.ok || data.status === "failure") {
          throw responseError;
        }

        transformData(data);
      } catch (error) {
        throwAsyncError(new Error(getRecipeErrorMessage(error)));
      }
    },
    [throwAsyncError, dispatch, navigate, matches],
  );
  return getData;
};
