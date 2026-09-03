import { favoritesActions } from "../../favorites/store/favoritesSlice";
import { loadFavorites } from "../../favorites/store/favoritesThunks";
import {
  authenticateWithEmail,
  authenticateWithGoogle,
  sendUserPasswordResetEmail,
  signOutUser,
  subscribeToAuthChanges,
  updateCurrentUserName,
  updateCurrentUserPassword,
} from "../api/authApi";
import {
  getAuthErrorMessage,
  getPasswordResetErrorMessage,
  isAuthCancellationError,
} from "../utils/authErrors";
import { authActions } from "./authSlice";
import type { User } from "firebase/auth";
import type { AppThunk } from "../../../app/store";
import type { AuthUser } from "../types";

type UserWithAccessToken = User & { accessToken?: string };

const createUserPayload = (user: User): AuthUser => ({
  idToken: (user as UserWithAccessToken).accessToken ?? "",
  uid: user.uid,
  email: user.email ?? "",
  userName: user.displayName ?? "",
  emailVerified: user.emailVerified,
});

export const initAuth = (): AppThunk<
  ReturnType<typeof subscribeToAuthChanges>
> => {
  return (dispatch) =>
    subscribeToAuthChanges(
      (user) => {
        if (user) {
          dispatch(authActions.login(createUserPayload(user)));
          dispatch(loadFavorites(user.uid));
        }

        dispatch(authActions.completeAuthInitialization());
      },
      (error) => {
        dispatch(authActions.setErrorMessage(getAuthErrorMessage(error)));
        dispatch(authActions.completeAuthInitialization());
      },
    );
};

export const authRequest = (
  isLogin: boolean,
  email: string,
  password: string,
): AppThunk<Promise<void>> => {
  return async (dispatch) => {
    dispatch(authActions.setIsLoading(true));

    try {
      const userCredential = await authenticateWithEmail(
        isLogin,
        email,
        password,
      );

      dispatch(authActions.login(createUserPayload(userCredential.user)));
      dispatch(authActions.closeAuthForm());
    } catch (error) {
      dispatch(authActions.setErrorMessage(getAuthErrorMessage(error)));
    } finally {
      dispatch(authActions.setIsLoading(false));
    }
  };
};

export const logoutUser = (): AppThunk<Promise<void>> => {
  return (dispatch) => {
    dispatch(authActions.logout());
    dispatch(favoritesActions.clearFavorites());

    return signOutUser();
  };
};

export const changeUserPassword = (
  password: string,
): AppThunk<Promise<void>> => {
  return async (dispatch) => {
    try {
      await updateCurrentUserPassword(password);
    } catch (error) {
      dispatch(authActions.setErrorMessage(getAuthErrorMessage(error)));
    }
  };
};

export const changeUserName = (name: string): AppThunk<Promise<void>> => {
  return async (dispatch) => {
    try {
      const user = await updateCurrentUserName(name);
      dispatch(authActions.login(createUserPayload(user)));
    } catch (error) {
      dispatch(authActions.setErrorMessage(getAuthErrorMessage(error)));
    }
  };
};

export const authWithGoogle = (): AppThunk<Promise<void>> => {
  return async (dispatch) => {
    try {
      const result = await authenticateWithGoogle();

      dispatch(authActions.login(createUserPayload(result.user)));
      dispatch(authActions.closeAuthForm());
    } catch (error) {
      if (!isAuthCancellationError(error)) {
        dispatch(authActions.setErrorMessage(getAuthErrorMessage(error)));
      }
    }
  };
};

export const resetUserPassword = (email: string): AppThunk<Promise<void>> => {
  return async (dispatch) => {
    try {
      await sendUserPasswordResetEmail(email);
      dispatch(authActions.setSuccessMessage("Password reset email sent!"));
    } catch (error) {
      dispatch(
        authActions.setErrorMessage(getPasswordResetErrorMessage(error)),
      );
    }
  };
};
