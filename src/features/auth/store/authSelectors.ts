import type { RootState } from "../../../app/store";

type AuthRootState = Pick<RootState, "auth">;

export const selectAuthState = (state: AuthRootState) => state.auth;

export const selectAuthErrorMessage = (state: AuthRootState) =>
  selectAuthState(state).errorMessage;
export const selectAuthFormIsOpen = (state: AuthRootState) =>
  selectAuthState(state).authFormIsOpen;
export const selectAuthIsInitialized = (state: AuthRootState) =>
  selectAuthState(state).isInitialized;
export const selectAuthIsLoading = (state: AuthRootState) =>
  selectAuthState(state).isLoading;
export const selectAuthIsLoggedIn = (state: AuthRootState) =>
  selectAuthState(state).isLoggedIn;
export const selectAuthShowResetPassword = (state: AuthRootState) =>
  selectAuthState(state).showResetPassword;
export const selectAuthSuccessMessage = (state: AuthRootState) =>
  selectAuthState(state).successMessage;
export const selectAuthUser = (state: AuthRootState) =>
  selectAuthState(state).user;
export const selectAuthUserId = (state: AuthRootState) =>
  selectAuthUser(state).uid;

export const selectAuthDisplayName = (state: AuthRootState) => {
  const { email, userName } = selectAuthUser(state);

  return userName || email.split("@")[0];
};
