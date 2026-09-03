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

interface AuthErrorLike {
  code?: string;
  message?: string;
}

const asAuthError = (error: unknown): AuthErrorLike =>
  typeof error === "object" && error !== null ? error : {};

const isFirebaseAuthError = (error: unknown) =>
  asAuthError(error).code?.startsWith("auth/") ?? false;

export const getAuthErrorMessage = (error: unknown) => {
  const { code, message } = asAuthError(error);
  const mappedMessage = code
    ? AUTH_ERROR_MESSAGES[code as keyof typeof AUTH_ERROR_MESSAGES]
    : undefined;

  if (mappedMessage) {
    return mappedMessage;
  }

  if (isFirebaseAuthError(error)) {
    return ERROR_MESSAGE_DEFAULT;
  }

  return message || ERROR_MESSAGE_DEFAULT;
};

export const isAuthCancellationError = (error: unknown) => {
  const code = asAuthError(error).code;

  return code ? AUTH_CANCELLATION_CODES.has(code) : false;
};

export const getReauthenticationErrorMessage = (error: unknown) => {
  const code = asAuthError(error).code;

  if (
    code === "auth/invalid-login-credentials" ||
    code === "auth/wrong-password"
  ) {
    return "The current password you entered did not match our records";
  }

  return getAuthErrorMessage(error);
};

export const getPasswordResetErrorMessage = (error: unknown) => {
  const code = asAuthError(error).code;

  return code && PASSWORD_RESET_ERROR_CODES.has(code)
    ? getAuthErrorMessage(error)
    : ERROR_MESSAGE_DEFAULT;
};
