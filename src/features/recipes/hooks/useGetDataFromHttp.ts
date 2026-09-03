import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
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
  const pathname = usePathname() ?? "";
  const router = useRouter();

  const getData = useCallback<GetDataFromHttp>(
    async <Data>(
      { url, method, headers, body }: HttpRequest,
      transformData: (data: Data) => void,
    ) => {
      try {
        const response = fetch(`${url}`, {
          method: method || "GET",
          headers: headers || {},
          body: body ? JSON.stringify(body) : undefined,
        });

        const res = await Promise.race([response, timeout(TIMEOUT_SEC)]);
        const data = (await res.json()) as Data & { status?: string };
        const responseError = Object.assign(
          new Error("Recipe request failed"),
          { response: { data, status: res.status } },
        );

        if (isRecipeApiLimitError(responseError)) {
          dispatch(recipeActions.setDailyLimitIsReached());
          dispatch(recipeActions.resetRecipes());
          router.replace(
            pathname.startsWith("/favorites") ? "/favorites" : "/",
          );
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
    [throwAsyncError, dispatch, pathname, router],
  );
  return getData;
};
