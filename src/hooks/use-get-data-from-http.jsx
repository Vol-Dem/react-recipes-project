import { useThrowAsyncError } from "./use-throw-async-error";
import { TIMEOUT_SEC } from "../variables/constants";
import { timeout } from "../variables/utils";
import { useContext } from "react";
import RecipeContext from "../store/recipe-context";
import { useCallback } from "react";

export const useGetDataFromHttp = () => {
  const throwAsyncError = useThrowAsyncError();

  const recipeCtx = useContext(RecipeContext);
  const onDailyLimitReached = recipeCtx.onDailyLimitReached;

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
          onDailyLimitReached();
          return;
        }

        if (data.status === "failure")
          throw new Error(`${data.message} (${data.code})`);

        transformData(data);
      } catch (error) {
        throwAsyncError(error);
      }
    },
    [onDailyLimitReached, throwAsyncError]
  );
  return getData;
};
