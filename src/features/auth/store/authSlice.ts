import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, AuthUser } from "../types";

const emptyUser: AuthUser = {
  idToken: "",
  uid: "",
  email: "",
  userName: "",
  emailVerified: false,
};

const authInitialState: AuthState = {
  isInitialized: false,
  isLoggedIn: false,
  authFormIsOpen: false,
  showResetPassword: false,
  isLoading: false,
  errorMessage: "",
  successMessage: "",
  user: emptyUser,
};

const authSlice = createSlice({
  name: "auth",
  initialState: authInitialState,
  reducers: {
    login(state, action: PayloadAction<AuthUser>) {
      state.isLoggedIn = true;
      state.user = {
        idToken: action.payload.idToken,
        uid: action.payload.uid,
        email: action.payload.email,
        userName: action.payload.userName,
        emailVerified: action.payload.emailVerified,
      };
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = emptyUser;
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
    setShowResetPassword(state, action: PayloadAction<boolean>) {
      state.showResetPassword = action.payload;
    },
    setErrorMessage(state, action: PayloadAction<string>) {
      state.errorMessage = action.payload;
    },
    setSuccessMessage(state, action: PayloadAction<string>) {
      state.successMessage = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;
