import { ERROR_MESSAGE_DEFAULT } from "../../../shared/constants";

const AUTH_ERROR_MESSAGES = Object.freeze({
  "auth/account-exists-with-different-credential":
    "An account already exists with this email using a different sign-in method",
  "auth/email-already-in-use":
    "An account already exists with this email address",
  "auth/invalid-email": "Invalid email address",
  "auth/invalid-login-credentials": "Invalid email or password",
  "auth/missing-password": "Please enter your password",
  "auth/network-request-failed":
    "Unable to connect. Check your internet connection and try again",
  "auth/operation-not-allowed":
    "This authentication method is currently unavailable",
  "auth/popup-blocked":
    "Your browser blocked the sign-in popup. Allow popups and try again",
  "auth/requires-recent-login":
    "Please sign in again before changing sensitive account information",
  "auth/too-many-requests":
    "Too many attempts. Please wait and try again later",
  "auth/user-disabled": "This account has been disabled",
  "auth/user-not-found": "User not found",
  "auth/weak-password": "Password does not meet the security requirements",
  "auth/wrong-password": "Wrong password",
});

const AUTH_CANCELLATION_CODES = new Set([
  "auth/cancelled-popup-request",
  "auth/popup-closed-by-user",
]);

const PASSWORD_RESET_ERROR_CODES = new Set([
  "auth/invalid-email",
  "auth/network-request-failed",
  "auth/operation-not-allowed",
  "auth/too-many-requests",
]);

const isFirebaseAuthError = (error) =>
  typeof error?.code === "string" && error.code.startsWith("auth/");

export const getAuthErrorMessage = (error) => {
  const mappedMessage = AUTH_ERROR_MESSAGES[error?.code];

  if (mappedMessage) {
    return mappedMessage;
  }

  if (isFirebaseAuthError(error)) {
    return ERROR_MESSAGE_DEFAULT;
  }

  return error?.message || ERROR_MESSAGE_DEFAULT;
};

export const isAuthCancellationError = (error) =>
  AUTH_CANCELLATION_CODES.has(error?.code);

export const getReauthenticationErrorMessage = (error) => {
  if (
    error?.code === "auth/invalid-login-credentials" ||
    error?.code === "auth/wrong-password"
  ) {
    return "The current password you entered did not match our records";
  }

  return getAuthErrorMessage(error);
};

export const getPasswordResetErrorMessage = (error) =>
  PASSWORD_RESET_ERROR_CODES.has(error?.code)
    ? getAuthErrorMessage(error)
    : ERROR_MESSAGE_DEFAULT;
