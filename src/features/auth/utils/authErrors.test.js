import { ERROR_MESSAGE_DEFAULT } from "../../../shared/constants";
import {
  getAuthErrorMessage,
  getPasswordResetErrorMessage,
  getReauthenticationErrorMessage,
  isAuthCancellationError,
} from "./authErrors";

describe("auth error messages", () => {
  it("maps Firebase authentication error codes", () => {
    expect(
      getAuthErrorMessage({ code: "auth/invalid-login-credentials" }),
    ).toBe("Invalid email or password");
    expect(getAuthErrorMessage({ code: "auth/wrong-password" })).toBe(
      "Wrong password",
    );
    expect(getAuthErrorMessage({ code: "auth/email-already-in-use" })).toBe(
      "An account already exists with this email address",
    );
  });

  it("does not expose raw messages from unknown Firebase errors", () => {
    expect(
      getAuthErrorMessage({
        code: "auth/internal-error",
        message: "Firebase: Error (auth/internal-error)",
      }),
    ).toBe(ERROR_MESSAGE_DEFAULT);
  });

  it("preserves messages from normalized application errors", () => {
    expect(getAuthErrorMessage({ message: "Unable to update profile" })).toBe(
      "Unable to update profile",
    );
  });

  it("provides context-specific reauthentication and reset messages", () => {
    expect(
      getReauthenticationErrorMessage({
        code: "auth/invalid-login-credentials",
      }),
    ).toBe("The current password you entered did not match our records");
    expect(
      getPasswordResetErrorMessage({ code: "auth/invalid-email" }),
    ).toBe("Invalid email address");
    expect(
      getPasswordResetErrorMessage({ code: "auth/network-request-failed" }),
    ).toBe("Unable to connect. Check your internet connection and try again");
    expect(getPasswordResetErrorMessage({ code: "auth/internal-error" })).toBe(
      ERROR_MESSAGE_DEFAULT,
    );
  });

  it("identifies user-cancelled authentication popups", () => {
    expect(
      isAuthCancellationError({ code: "auth/popup-closed-by-user" }),
    ).toBe(true);
    expect(
      isAuthCancellationError({ code: "auth/cancelled-popup-request" }),
    ).toBe(true);
    expect(isAuthCancellationError({ code: "auth/popup-blocked" })).toBe(false);
  });
});
