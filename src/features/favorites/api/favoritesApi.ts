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

const getFavoritesReference = (userId: string) =>
  doc(firestore, FIRESTORE_COLLECTIONS.favorites, userId);

/** Reads an account's numeric favorite IDs; missing documents or malformed lists produce an empty list. */
export const fetchFavoriteIds = async (userId: string): Promise<number[]> => {
  const favoritesSnapshot = await getDoc(getFavoritesReference(userId));

  if (!favoritesSnapshot.exists()) {
    return [];
  }

  const favoriteIds = favoritesSnapshot.data().favList;

  return Array.isArray(favoriteIds)
    ? favoriteIds.filter((id): id is number => typeof id === "number")
    : [];
};

/**
 * Atomically adds/removes one numeric ID, creating the favorites document if needed.
 * Merge writes preserve other fields. Authorization must be enforced by Firestore
 * rules; the supplied user ID alone does not authorize a write.
 */
export const updateFavorite = (
  userId: string,
  recipeId: number,
  shouldAddFavorite: boolean,
) =>
  setDoc(
    getFavoritesReference(userId),
    {
      favList: shouldAddFavorite ? arrayUnion(recipeId) : arrayRemove(recipeId),
    },
    { merge: true },
  );
