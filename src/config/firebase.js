import { initializeApp } from "firebase/app";
import { FIREBASE_CONFIG } from "../shared/constants";

// Initialize Firebase
const firebaseApp = initializeApp(FIREBASE_CONFIG);

export default firebaseApp;
