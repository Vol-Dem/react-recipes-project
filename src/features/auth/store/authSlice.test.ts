import authSlice, { authActions } from "./authSlice";

describe("authSlice", () => {
  const reducer = authSlice.reducer;

  it("stores an authenticated user", () => {
    const state = reducer(
      undefined,
      authActions.login({
        idToken: "token",
        uid: "user-id",
        email: "user@example.com",
        userName: "User",
        emailVerified: true,
      }),
    );

    expect(state.isLoggedIn).toBe(true);
    expect(state.user).toEqual({
      idToken: "token",
      uid: "user-id",
      email: "user@example.com",
      userName: "User",
      emailVerified: true,
    });
  });

  it("clears authentication state without performing side effects", () => {
    const authenticatedState = reducer(
      undefined,
      authActions.login({
        idToken: "token",
        uid: "user-id",
        email: "user@example.com",
        userName: "User",
        emailVerified: true,
      }),
    );

    const state = reducer(authenticatedState, authActions.logout());

    expect(state.isLoggedIn).toBe(false);
    expect(state.user).toEqual({
      idToken: "",
      uid: "",
      email: "",
      userName: "",
      emailVerified: false,
    });
  });
});
