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
  loadFav: (userId) => ({ type: "favorites/load", payload: userId }),
}));

import {
  authRequest,
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
      payload: "Invalid email",
    });
    expect(dispatch).toHaveBeenLastCalledWith({
      type: "auth/setIsLoading",
      payload: false,
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
