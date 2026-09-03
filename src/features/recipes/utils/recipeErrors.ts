import { ERROR_MESSAGE_OFFLINE } from "../../../shared/constants";
import {
  RECIPE_ERROR_MESSAGE_DEFAULT,
  RECIPE_ERROR_MESSAGE_NOT_FOUND,
  RECIPE_ERROR_MESSAGE_RATE_LIMIT,
  RECIPE_ERROR_MESSAGE_TIMEOUT,
} from "../constants/messages";

const API_DAILY_LIMIT_STATUS = 402;

interface RecipeErrorLike {
  code?: string;
  name?: string;
  status?: unknown;
  response?: {
    data?: { code?: unknown };
    status?: unknown;
  };
}

const asRecipeError = (error: unknown): RecipeErrorLike =>
  typeof error === "object" && error !== null ? error : {};

const getHttpStatus = (value: unknown) => {
  const status = Number(value);

  return Number.isInteger(status) && status >= 400 && status < 600
    ? status
    : undefined;
};

const getErrorStatus = (error: unknown) => {
  const errorLike = asRecipeError(error);

  return (
    getHttpStatus(errorLike.response?.data?.code) ??
    getHttpStatus(errorLike.response?.status) ??
    getHttpStatus(errorLike.status)
  );
};

const isNetworkError = (error: unknown) =>
  asRecipeError(error).code === "ERR_NETWORK" ||
  asRecipeError(error).code === "unavailable" ||
  error instanceof TypeError;

const isTimeoutError = (error: unknown) =>
  asRecipeError(error).code === "ECONNABORTED" ||
  asRecipeError(error).code === "ETIMEDOUT" ||
  asRecipeError(error).name === "TimeoutError";

export const isRecipeApiLimitError = (error: unknown) =>
  getErrorStatus(error) === API_DAILY_LIMIT_STATUS;

export const getRecipeErrorMessage = (error: unknown) => {
  if (isTimeoutError(error)) {
    return RECIPE_ERROR_MESSAGE_TIMEOUT;
  }

  if (isNetworkError(error)) {
    return ERROR_MESSAGE_OFFLINE;
  }

  const status = getErrorStatus(error);

  if (status === 404) {
    return RECIPE_ERROR_MESSAGE_NOT_FOUND;
  }

  if (status === 429) {
    return RECIPE_ERROR_MESSAGE_RATE_LIMIT;
  }

  return RECIPE_ERROR_MESSAGE_DEFAULT;
};
