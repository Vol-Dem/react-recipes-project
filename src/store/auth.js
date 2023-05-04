import { createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import firebaseApp from "../config";
import { loadFav } from "./fav";

const auth = getAuth(firebaseApp);

const authInitialState = {
  isLoggedIn: false,
  authFormIsOpen: false,
  isLoading: false,
  errorMessage: "",
  user: {
    idToken: "",
    refreshToken: "",
    uid: "",
    email: "",
    userName: "",
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState: authInitialState,
  reducers: {
    login(state, actions) {
      state.isLoggedIn = true;
      state.user = {
        idToken: actions.payload.accessToken,
        uid: actions.payload.uid,
        email: actions.payload.email,
        userName: actions.payload.displayName,
      };
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = Object.fromEntries(
        Object.keys(state.user).map((key) => [key, ""])
      );

      signOut(auth);
    },
    openAuthForm(state) {
      state.authFormIsOpen = true;
    },
    closeAuthForm(state) {
      state.authFormIsOpen = false;
    },
    setErrorMessage(state, actions) {
      state.errorMessage = actions.payload;
    },
    setIsLoading(state, actions) {
      state.isLoading = actions.payload;
    },
  },
});

export const initAuth = () => {
  return (dispatch) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          authActions.login({
            accessToken: user.accessToken,
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          })
        );
        dispatch(loadFav(user.uid));
      }
    });
  };
};

export const authRequest = (isLogin, email, password) => {
  return async (dispatch) => {
    dispatch(authActions.setIsLoading(true));
    try {
      let userCredential = {};
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      } else {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      }

      const user = userCredential.user;
      dispatch(
        authActions.login({
          accessToken: user.accessToken,
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        })
      );
      dispatch(authActions.closeAuthForm());
    } catch (error) {
      dispatch(authActions.setErrorMessage(error.message));
    }
    dispatch(authActions.setIsLoading(false));
  };
};

export const changeUserPassword = (password) => {
  return async (dispatch) => {
    try {
      const user = auth.currentUser;
      await updatePassword(user, password);
    } catch (error) {
      dispatch(authActions.setErrorMessage(error.message));
    }
  };
};

export const changeUserName = (name) => {
  return async (dispatch) => {
    try {
      const user = auth.currentUser;
      await updateProfile(user, { displayName: name });
      dispatch(
        authActions.login({
          accessToken: user.accessToken,
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        })
      );
      console.log(user);
    } catch (error) {
      dispatch(authActions.setErrorMessage(error.message));
    }
  };
};

export const authActions = authSlice.actions;

export default authSlice;
