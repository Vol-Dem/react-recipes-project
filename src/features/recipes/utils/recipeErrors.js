import { ERROR_MESSAGE_OFFLINE } from "../../../shared/constants";
import {
  RECIPE_ERROR_MESSAGE_DEFAULT,
  RECIPE_ERROR_MESSAGE_NOT_FOUND,
  RECIPE_ERROR_MESSAGE_RATE_LIMIT,
  RECIPE_ERROR_MESSAGE_TIMEOUT,
} from "../constants/messages";

const API_DAILY_LIMIT_STATUS = 402;

const getHttpStatus = (value) => {
  const status = Number(value);

  return Number.isInteger(status) && status >= 400 && status < 600
    ? status
    : undefined;
};

const getErrorStatus = (error) =>
  getHttpStatus(error?.response?.data?.code) ??
  getHttpStatus(error?.response?.status) ??
  getHttpStatus(error?.status);

const isNetworkError = (error) =>
  error?.code === "ERR_NETWORK" ||
  error?.code === "unavailable" ||
  error instanceof TypeError;

const isTimeoutError = (error) =>
  error?.code === "ECONNABORTED" ||
  error?.code === "ETIMEDOUT" ||
  error?.name === "TimeoutError";

export const isRecipeApiLimitError = (error) =>
  getErrorStatus(error) === API_DAILY_LIMIT_STATUS;

export const getRecipeErrorMessage = (error) => {
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
