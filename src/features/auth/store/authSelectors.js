export const selectAuthState = (state) => state.auth;

export const selectAuthErrorMessage = (state) =>
  selectAuthState(state).errorMessage;
export const selectAuthFormIsOpen = (state) =>
  selectAuthState(state).authFormIsOpen;
export const selectAuthIsInitialized = (state) =>
  selectAuthState(state).isInitialized;
export const selectAuthIsLoading = (state) => selectAuthState(state).isLoading;
export const selectAuthIsLoggedIn = (state) =>
  selectAuthState(state).isLoggedIn;
export const selectAuthShowResetPassword = (state) =>
  selectAuthState(state).showResetPassword;
export const selectAuthSuccessMessage = (state) =>
  selectAuthState(state).successMessage;
export const selectAuthUser = (state) => selectAuthState(state).user;
export const selectAuthUserId = (state) => selectAuthUser(state).uid;

export const selectAuthDisplayName = (state) => {
  const { email, userName } = selectAuthUser(state);

  return userName || email.split("@")[0];
};
