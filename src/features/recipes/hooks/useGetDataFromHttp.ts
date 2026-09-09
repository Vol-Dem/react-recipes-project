import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useThrowAsyncError } from "../../../shared/hooks/useThrowAsyncError";
import { requestRecipeJson } from "../api/requestRecipeJson";
import { notificationActions } from "../../notifications/store/notificationSlice";
import { RECIPE_DAILY_LIMIT_NOTIFICATION } from "../constants/messages";
import { recipeActions } from "../store/recipesSlice";
import {
  getRecipeErrorMessage,
  isRecipeApiLimitError,
} from "../utils/recipeErrors";
import type { AppDispatch } from "../../../app/store";

interface HttpRequest {
  url: string;
  method?: string;
  headers?: HeadersInit;
  body?: unknown;
}

export type GetDataFromHttp = <Data>(
  request: HttpRequest,
  transformData: (data: Data) => void,
) => Promise<void>;

export const useGetDataFromHttp = () => {
  const throwAsyncError = useThrowAsyncError();
  const dispatch = useDispatch<AppDispatch>();

  const getData = useCallback<GetDataFromHttp>(
    async <Data>(
      { url, method, headers, body }: HttpRequest,
      transformData: (data: Data) => void,
    ) => {
      try {
        const data = await requestRecipeJson<Data>(url, {
          method: method || "GET",
          headers: headers || {},
          body: body ? JSON.stringify(body) : undefined,
        });

        transformData(data);
      } catch (error) {
        if (isRecipeApiLimitError(error)) {
          dispatch(recipeActions.setDailyLimitIsReached());
          dispatch(
            notificationActions.showNotification(
              RECIPE_DAILY_LIMIT_NOTIFICATION,
            ),
          );
          return;
        }

        throwAsyncError(new Error(getRecipeErrorMessage(error)));
      }
    },
    [throwAsyncError, dispatch],
  );
  return getData;
};
