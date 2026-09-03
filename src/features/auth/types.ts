export interface AuthUser {
  idToken: string;
  uid: string;
  email: string;
  userName: string;
  emailVerified: boolean;
}

export interface AuthState {
  isInitialized: boolean;
  isLoggedIn: boolean;
  authFormIsOpen: boolean;
  showResetPassword: boolean;
  isLoading: boolean;
  errorMessage: string;
  successMessage: string;
  user: AuthUser;
}
