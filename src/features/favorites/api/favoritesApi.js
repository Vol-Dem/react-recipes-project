import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import firebaseApp from "../../../config/firebase";
import { FIRESTORE_COLLECTIONS } from "../../../shared/constants";

const firestore = getFirestore(firebaseApp);

const getFavoritesReference = (userId) =>
  doc(firestore, FIRESTORE_COLLECTIONS.favorites, userId);

export const fetchFavoriteIds = async (userId) => {
  const favoritesSnapshot = await getDoc(getFavoritesReference(userId));

  if (!favoritesSnapshot.exists()) {
    return [];
  }

  const favoriteIds = favoritesSnapshot.data().favList;

  return Array.isArray(favoriteIds) ? favoriteIds : [];
};

export const updateFavorite = (
  userId,
  recipeId,
  shouldAddFavorite,
) =>
  setDoc(
    getFavoritesReference(userId),
    {
      favList: shouldAddFavorite
        ? arrayUnion(recipeId)
        : arrayRemove(recipeId),
    },
    { merge: true },
  );
