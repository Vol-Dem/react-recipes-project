import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import firebaseApp from "../../../config/firebase";
import { FIRESTORE_COLLECTIONS } from "../../../shared/constants";
import type { RecipeDetails } from "../types";

export const getRecipesCollection = () =>
  collection(getFirestore(firebaseApp), FIRESTORE_COLLECTIONS.recipes);

export const fetchRecipeFromFirestore = async (
  recipeId: string | number,
): Promise<RecipeDetails | undefined> => {
  const recipeReference = doc(
    getFirestore(firebaseApp),
    FIRESTORE_COLLECTIONS.recipes,
    String(recipeId),
  );
  const recipeSnapshot = await getDoc(recipeReference);
  return recipeSnapshot.data() as RecipeDetails | undefined;
};
