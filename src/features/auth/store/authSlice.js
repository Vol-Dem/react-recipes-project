import { createSlice } from "@reduxjs/toolkit";

const authInitialState = {
  isInitialized: false,
  isLoggedIn: false,
  authFormIsOpen: false,
  showResetPassword: false,
  isLoading: false,
  errorMessage: "",
  successMessage: "",
  user: {
    idToken: "",
    refreshToken: "",
    uid: "",
    email: "",
    userName: "",
    emailVerified: false,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState: authInitialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.user = {
        idToken: action.payload.accessToken,
        uid: action.payload.uid,
        email: action.payload.email,
        userName: action.payload.displayName,
        emailVerified: action.payload.emailVerified,
      };
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = Object.fromEntries(
        Object.keys(state.user).map((key) => [key, ""])
      );
    },
    completeAuthInitialization(state) {
      state.isInitialized = true;
    },
    openAuthForm(state) {
      state.authFormIsOpen = true;
    },
    closeAuthForm(state) {
      state.authFormIsOpen = false;
    },
    setShowResetPassword(state, action) {
      state.showResetPassword = action.payload;
    },
    setErrorMessage(state, action) {
      state.errorMessage = action.payload;
    },
    setSuccessMessage(state, action) {
      state.successMessage = action.payload;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;
