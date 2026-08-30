const authApiMocks = vi.hoisted(() => ({
  authenticateWithEmail: vi.fn(),
  authenticateWithGoogle: vi.fn(),
  sendUserPasswordResetEmail: vi.fn(),
  signOutUser: vi.fn(),
  subscribeToAuthChanges: vi.fn(),
  updateCurrentUserName: vi.fn(),
  updateCurrentUserPassword: vi.fn(),
}));

vi.mock("../api/authApi", () => authApiMocks);
vi.mock("../../favorites/store/favoritesSlice", () => ({
  favoritesActions: {
    clearFavorites: () => ({ type: "favorites/clear" }),
  },
}));
vi.mock("../../favorites/store/favoritesThunks", () => ({
  loadFavorites: (userId) => ({ type: "favorites/load", payload: userId }),
}));

import {
  authRequest,
  authWithGoogle,
  changeUserName,
  changeUserPassword,
  initAuth,
  logoutUser,
  resetUserPassword,
} from "./authThunks";

const user = {
  accessToken: "token",
  uid: "user-id",
  email: "user@example.com",
  displayName: "User",
  emailVerified: true,
};

describe("auth thunks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes the authenticated user and their favorites", () => {
    const unsubscribe = vi.fn();
    const dispatch = vi.fn();
    authApiMocks.subscribeToAuthChanges.mockImplementation((callback) => {
      callback(user);
      return unsubscribe;
    });

    expect(initAuth()(dispatch)).toBe(unsubscribe);
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: "auth/login" }),
    );
    expect(dispatch).toHaveBeenCalledWith({
      type: "favorites/load",
      payload: "user-id",
    });
    expect(dispatch).toHaveBeenLastCalledWith({
      type: "auth/completeAuthInitialization",
      payload: undefined,
    });
  });

  it("finishes initialization with a safe message when the observer fails", () => {
    const dispatch = vi.fn();
    authApiMocks.subscribeToAuthChanges.mockImplementation(
      (_onUserChanged, onError) => {
        onError({
          code: "auth/internal-error",
          message: "Firebase: Error (auth/internal-error)",
        });
      },
    );

    initAuth()(dispatch);

    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: "auth/setErrorMessage",
      payload: "Oops! Something went wrong. Try refreshing!",
    });
    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: "auth/completeAuthInitialization",
      payload: undefined,
    });
  });

  it("authenticates with email and closes the form", async () => {
    const dispatch = vi.fn();
    authApiMocks.authenticateWithEmail.mockResolvedValue({ user });

    await authRequest(true, user.email, "password")(dispatch);

    expect(authApiMocks.authenticateWithEmail).toHaveBeenCalledWith(
      true,
      user.email,
      "password",
    );
    expect(dispatch.mock.calls.map(([action]) => action.type)).toEqual([
      "auth/setIsLoading",
      "auth/login",
      "auth/closeAuthForm",
      "auth/setIsLoading",
    ]);
  });

  it("maps authentication failures and finishes loading", async () => {
    const dispatch = vi.fn();
    authApiMocks.authenticateWithEmail.mockRejectedValue({
      code: "auth/invalid-email",
    });

    await authRequest(true, "invalid", "password")(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: "auth/setErrorMessage",
      payload: "Invalid email address",
    });
    expect(dispatch).toHaveBeenLastCalledWith({
      type: "auth/setIsLoading",
      payload: false,
    });
  });

  it("maps an email already in use during sign-up", async () => {
    const dispatch = vi.fn();
    authApiMocks.authenticateWithEmail.mockRejectedValue({
      code: "auth/email-already-in-use",
      message: "Firebase: Error (auth/email-already-in-use)",
    });

    await authRequest(false, user.email, "password")(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: "auth/setErrorMessage",
      payload: "An account already exists with this email address",
    });
  });

  it("maps profile update failures", async () => {
    const dispatch = vi.fn();
    authApiMocks.updateCurrentUserName.mockRejectedValue({
      code: "auth/network-request-failed",
    });
    authApiMocks.updateCurrentUserPassword.mockRejectedValue({
      code: "auth/requires-recent-login",
    });

    await changeUserName("Updated User")(dispatch);
    await changeUserPassword("New-password1")(dispatch);

    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: "auth/setErrorMessage",
      payload: "Unable to connect. Check your internet connection and try again",
    });
    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: "auth/setErrorMessage",
      payload:
        "Please sign in again before changing sensitive account information",
    });
  });

  it("maps Google sign-in failures but ignores popup cancellation", async () => {
    const dispatch = vi.fn();
    authApiMocks.authenticateWithGoogle
      .mockRejectedValueOnce({ code: "auth/popup-blocked" })
      .mockRejectedValueOnce({ code: "auth/popup-closed-by-user" });

    await authWithGoogle()(dispatch);
    await authWithGoogle()(dispatch);

    expect(dispatch).toHaveBeenCalledOnce();
    expect(dispatch).toHaveBeenCalledWith({
      type: "auth/setErrorMessage",
      payload:
        "Your browser blocked the sign-in popup. Allow popups and try again",
    });
  });

  it("clears local auth state and signs out through the API", async () => {
    const dispatch = vi.fn();
    authApiMocks.signOutUser.mockResolvedValue();

    await logoutUser()(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: "auth/logout",
      payload: undefined,
    });
    expect(dispatch).toHaveBeenCalledWith({ type: "favorites/clear" });
    expect(authApiMocks.signOutUser).toHaveBeenCalledOnce();
  });

  it("reports successful password reset requests", async () => {
    const dispatch = vi.fn();
    authApiMocks.sendUserPasswordResetEmail.mockResolvedValue();

    await resetUserPassword(user.email)(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: "auth/setSuccessMessage",
      payload: "Password reset email sent!",
    });
  });
});
