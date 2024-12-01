import { useThrowAsyncError } from "./use-throw-async-error";
import { TIMEOUT_SEC } from "../variables/constants";
import { timeout } from "../variables/utils";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { getRecipes, recipeActions } from "../store/recipe";
import { notificationActions } from "../store/notification";
import { useMatches, useNavigate } from "react-router-dom";

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

        if (data.code === 402) {
          dispatch(recipeActions.setDailyLimitIsReached());
          dispatch(recipeActions.resetRecipes());
          navigate(`${matches[1].pathname}`);
          dispatch(getRecipes({}));
          dispatch(
            notificationActions.showNotification({
              title: "Daily limit of API is over :(",
              message:
                "The application will now enter test mode. Search result will remain the same. You can still use other features!",
            })
          );
          return;
        }

        if (data.status === "failure")
          throw new Error(`${data.message} (${data.code})`);

        transformData(data);
      } catch (error) {
        throwAsyncError(error);
      }
    },
    [throwAsyncError, dispatch, navigate, matches]
  );
  return getData;
};
