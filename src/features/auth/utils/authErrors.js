import { ERROR_MESSAGE_DEFAULT } from "../../../shared/constants";

const AUTH_ERROR_MESSAGES = Object.freeze({
  "auth/invalid-email": "Invalid email",
  "auth/invalid-login-credentials": "Invalid login credentials",
  "auth/missing-password": "Missing password",
  "auth/too-many-requests":
    "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later",
  "auth/user-not-found": "User not found",
  "auth/wrong-password": "Wrong password",
});

export const getAuthErrorMessage = (error) =>
  AUTH_ERROR_MESSAGES[error.code] ?? error.message ?? ERROR_MESSAGE_DEFAULT;

export const getReauthenticationErrorMessage = (error) => {
  if (error.code === "auth/invalid-login-credentials") {
    return "The current password you entered did not match our records";
  }

  return getAuthErrorMessage(error);
};

export const getPasswordResetErrorMessage = (error) =>
  error.code === "auth/invalid-email" ? "Invalid email" : ERROR_MESSAGE_DEFAULT;
