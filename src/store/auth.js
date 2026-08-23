import { createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  sendEmailVerification,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  EmailAuthProvider,
} from "firebase/auth";
import { ERROR_MESSAGE_DEFAULT } from "../variables/constants";
import firebaseApp from "../config";
import { loadFav } from "./fav";
import { getFirestore } from "firebase/firestore";

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
const provider = new GoogleAuthProvider();

const authInitialState = {
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
    login(state, actions) {
      state.isLoggedIn = true;
      state.user = {
        idToken: actions.payload.accessToken,
        uid: actions.payload.uid,
        email: actions.payload.email,
        userName: actions.payload.displayName,
        emailVerified: actions.payload.emailVerified,
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
    setShowResetPassword(state, actions) {
      state.showResetPassword = actions.payload;
    },
    setErrorMessage(state, actions) {
      state.errorMessage = actions.payload;
    },
    setSuccessMessage(state, actions) {
      state.successMessage = actions.payload;
    },
    setIsLoading(state, actions) {
      state.isLoading = actions.payload;
    },
  },
});

/**
 *Automatically authorizes the user and load related favlist if user object is exists.
 * @returns
 */
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
            emailVerified: user.emailVerified,
          })
        );
        dispatch(loadFav(user.uid));
      }
    });
  };
};

/**
 *Makes a firebase authentication request and authorizes the user.
 * @param {boolean} isLogin - Type of request. If false, create new user. If true, authorizes the user.
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns
 */
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
          emailVerified: user.emailVerified,
        })
      );
      dispatch(authActions.closeAuthForm());
    } catch (error) {
      let errMessage;
      switch (error.code) {
        case "auth/invalid-login-credentials":
          errMessage = "Invalid login credentials";
          break;
        case "auth/invalid-email":
          errMessage = "Invalid email";
          break;
        case "auth/wrong-password":
          errMessage = "Wrong password";
          break;
        case "auth/missing-password":
          errMessage = "Missing password";
          break;
        case "auth/user-not-found":
          errMessage = "User not found";
          break;
        case "auth/too-many-requests":
          errMessage =
            "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later";
          break;
        default:
          errMessage = error.message;
      }

      dispatch(authActions.setErrorMessage(errMessage));
    } finally {
      dispatch(authActions.setIsLoading(false));
    }
  };
};

/**
 * Change user password
 * @param {string} password - User password
 * @returns
 */
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

/**
 * Change user name
 * @param {string} name - User name
 * @returns
 */
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

export const authWithGoogle = () => {
  return (dispatch, getState) => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        dispatch(
          authActions.login({
            accessToken: user.accessToken,
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            emailVerified: user.emailVerified,
          })
        );
        dispatch(authActions.closeAuthForm());
      })
      .catch((error) => {
        dispatch(authActions.setErrorMessage(ERROR_MESSAGE_DEFAULT));
      });
  };
};

export const promptForCredentials = async (password) => {
  try {
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      password
    );

    return credential;
  } catch (error) {
    if (error.code === "auth/invalid-login-credentials") {
      throw new Error(
        "The current password you entered did not match our records"
      );
    } else if (error.code === "auth/too-many-requests") {
      throw new Error(
        "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later"
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export const reauthenticateUser = async (type, password) => {
  try {
    const user = auth.currentUser;

    if (type === "pass") {
      const credential = await promptForCredentials(password);
      await reauthenticateWithCredential(user, credential);
    }
    if (type === "popup") {
      await reauthenticateWithPopup(user, provider);
    }
  } catch (error) {
    if (error.code === "auth/invalid-login-credentials") {
      throw new Error(
        "The current password you entered did not match our records"
      );
    } else if (error.code === "auth/too-many-requests") {
      throw new Error(
        "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later"
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export const resetUserPassword = (email) => {
  return async (dispatch) => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        dispatch(authActions.setSuccessMessage("Password reset email sent!"));
      })
      .catch((error) => {
        if (error.code === "auth/invalid-email") {
          dispatch(authActions.setErrorMessage("Invalid email"));
        } else {
          dispatch(authActions.setErrorMessage(ERROR_MESSAGE_DEFAULT));
        }
      });
  };
};

export const authActions = authSlice.actions;

export default authSlice;
