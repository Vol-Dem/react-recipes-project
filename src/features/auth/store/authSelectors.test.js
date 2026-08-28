import {
  selectAuthDisplayName,
  selectAuthErrorMessage,
  selectAuthFormIsOpen,
  selectAuthIsInitialized,
  selectAuthIsLoading,
  selectAuthIsLoggedIn,
  selectAuthShowResetPassword,
  selectAuthState,
  selectAuthSuccessMessage,
  selectAuthUser,
  selectAuthUserId,
} from "./authSelectors";

const authState = {
  authFormIsOpen: true,
  errorMessage: "Authentication failed",
  isInitialized: true,
  isLoading: false,
  isLoggedIn: true,
  showResetPassword: false,
  successMessage: "Password reset sent",
  user: {
    email: "user@example.com",
    uid: "user-id",
    userName: "Test User",
  },
};
const state = { auth: authState };

describe("auth selectors", () => {
  it("selects authentication state fields", () => {
    expect(selectAuthState(state)).toBe(authState);
    expect(selectAuthErrorMessage(state)).toBe("Authentication failed");
    expect(selectAuthFormIsOpen(state)).toBe(true);
    expect(selectAuthIsInitialized(state)).toBe(true);
    expect(selectAuthIsLoading(state)).toBe(false);
    expect(selectAuthIsLoggedIn(state)).toBe(true);
    expect(selectAuthShowResetPassword(state)).toBe(false);
    expect(selectAuthSuccessMessage(state)).toBe("Password reset sent");
    expect(selectAuthUser(state)).toBe(authState.user);
    expect(selectAuthUserId(state)).toBe("user-id");
  });

  it("falls back to the email prefix for the display name", () => {
    expect(selectAuthDisplayName(state)).toBe("Test User");
    expect(
      selectAuthDisplayName({
        auth: {
          ...authState,
          user: { ...authState.user, userName: "" },
        },
      }),
    ).toBe("user");
  });
});
