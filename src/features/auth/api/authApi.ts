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
  type NextOrObserver,
  type User,
} from "firebase/auth";
import firebaseApp from "../../../config/firebase";
import { getReauthenticationErrorMessage } from "../utils/authErrors";

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const getCurrentUser = (): User => {
  if (!auth.currentUser) {
    throw new Error("No authenticated user is available");
  }

  return auth.currentUser;
};

export const subscribeToAuthChanges = (
  onUserChanged: NextOrObserver<User>,
  onError?: (error: Error) => void,
) => onAuthStateChanged(auth, onUserChanged, onError);

export const authenticateWithEmail = (
  isLogin: boolean,
  email: string,
  password: string,
) =>
  isLogin
    ? signInWithEmailAndPassword(auth, email, password)
    : createUserWithEmailAndPassword(auth, email, password);

export const authenticateWithGoogle = () =>
  signInWithPopup(auth, googleProvider);

export const signOutUser = () => signOut(auth);

export const updateCurrentUserPassword = (password: string) =>
  updatePassword(getCurrentUser(), password);

export const updateCurrentUserName = async (name: string) => {
  const currentUser = getCurrentUser();
  await updateProfile(currentUser, { displayName: name });

  return currentUser;
};

export const sendUserPasswordResetEmail = (email: string) =>
  sendPasswordResetEmail(auth, email);

const promptForCredentials = (password: string) => {
  const currentUser = getCurrentUser();

  if (!currentUser.email) {
    throw new Error("The authenticated user does not have an email address");
  }

  return EmailAuthProvider.credential(currentUser.email, password);
};

export const reauthenticateUser = async (
  type: "pass" | "popup",
  password: string,
) => {
  const currentUser = getCurrentUser();

  try {
    if (type === "pass") {
      const credential = promptForCredentials(password);
      await reauthenticateWithCredential(currentUser, credential);
    }

    if (type === "popup") {
      await reauthenticateWithPopup(currentUser, googleProvider);
    }
  } catch (error) {
    throw new Error(getReauthenticationErrorMessage(error));
  }
};
