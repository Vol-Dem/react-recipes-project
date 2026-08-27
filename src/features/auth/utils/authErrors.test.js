import { ERROR_MESSAGE_DEFAULT } from "../../../shared/constants";
import {
  getAuthErrorMessage,
  getPasswordResetErrorMessage,
  getReauthenticationErrorMessage,
} from "./authErrors";

describe("auth error messages", () => {
  it("maps Firebase authentication error codes", () => {
    expect(
      getAuthErrorMessage({ code: "auth/invalid-login-credentials" }),
    ).toBe("Invalid login credentials");
    expect(getAuthErrorMessage({ code: "auth/wrong-password" })).toBe(
      "Wrong password",
    );
  });

  it("falls back to the original error message", () => {
    expect(getAuthErrorMessage({ message: "Unknown Firebase error" })).toBe(
      "Unknown Firebase error",
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
    ).toBe("Invalid email");
    expect(getPasswordResetErrorMessage({ code: "auth/internal-error" })).toBe(
      ERROR_MESSAGE_DEFAULT,
    );
  });
});
