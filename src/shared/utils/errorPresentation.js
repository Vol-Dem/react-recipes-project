import { ERROR_MESSAGE_DEFAULT } from "../constants";

const ERROR_PRESENTATIONS = Object.freeze({
  400: {
    heading: "Invalid request",
    message: "We couldn't process that request. Please check it and try again",
  },
  401: {
    heading: "Authentication required",
    message: "Please sign in to continue",
  },
  403: {
    heading: "Access denied",
    message: "You don't have permission to view this page",
  },
  404: {
    heading: "Page not found",
    message: "The page you requested does not exist",
  },
  429: {
    heading: "Too many requests",
    message: "Please wait a moment and try again",
  },
  503: {
    heading: "Service unavailable",
    message: "The service is temporarily unavailable. Please try again later",
  },
});

const DEFAULT_ERROR_PRESENTATION = Object.freeze({
  heading: "Something went wrong",
  message: ERROR_MESSAGE_DEFAULT,
});

const getErrorStatus = (error) => {
  const status = Number(error?.status);

  return Number.isInteger(status) && status >= 400 && status < 600
    ? status
    : 500;
};

export const getErrorPresentation = (error) => {
  const status = getErrorStatus(error);

  return {
    status,
    ...(ERROR_PRESENTATIONS[status] ?? DEFAULT_ERROR_PRESENTATION),
  };
};

export const reportError = (error, context) => {
  if (process.env.NODE_ENV !== "production") {
    console.error("Application error", error, context);
  }
};
