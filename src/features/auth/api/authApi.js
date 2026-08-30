import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import firebaseApp from "../../../config/firebase";
import { getReauthenticationErrorMessage } from "../utils/authErrors";

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

export const subscribeToAuthChanges = (onUserChanged, onError) =>
  onAuthStateChanged(auth, onUserChanged, onError);

export const authenticateWithEmail = (isLogin, email, password) =>
  isLogin
    ? signInWithEmailAndPassword(auth, email, password)
    : createUserWithEmailAndPassword(auth, email, password);

export const authenticateWithGoogle = () =>
  signInWithPopup(auth, googleProvider);

export const signOutUser = () => signOut(auth);

export const updateCurrentUserPassword = (password) =>
  updatePassword(auth.currentUser, password);

export const updateCurrentUserName = async (name) => {
  await updateProfile(auth.currentUser, { displayName: name });

  return auth.currentUser;
};

export const sendUserPasswordResetEmail = (email) =>
  sendPasswordResetEmail(auth, email);

const promptForCredentials = (password) =>
  EmailAuthProvider.credential(auth.currentUser.email, password);

export const reauthenticateUser = async (type, password) => {
  try {
    if (type === "pass") {
      const credential = promptForCredentials(password);
      await reauthenticateWithCredential(auth.currentUser, credential);
    }

    if (type === "popup") {
      await reauthenticateWithPopup(auth.currentUser, googleProvider);
    }
  } catch (error) {
    throw new Error(getReauthenticationErrorMessage(error));
  }
};
