import {
  collection,
  doc,
  endAt,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  limitToLast,
  orderBy,
  query,
  startAt,
  where,
} from "firebase/firestore";
import firebaseApp from "../../../config/firebase";
import {
  FIRESTORE_COLLECTIONS,
  RECIPES_PER_PAGE,
} from "../../../shared/constants";

let firstVisible;
let lastVisible;

export const getRecipesCollection = () =>
  collection(
    getFirestore(firebaseApp),
    FIRESTORE_COLLECTIONS.recipes,
  );

export const createFavoriteRecipesFilter = (recipeIds) =>
  where("id", "in", recipeIds);

export const createRecipeResultsLimit = () => limit(RECIPES_PER_PAGE + 1);

export const createNextPageRequest = () => ({
  position: startAt(lastVisible),
  resultsAmount: createRecipeResultsLimit(),
});

export const createPreviousPageRequest = () => ({
  position: endAt(firstVisible),
  resultsAmount: limitToLast(RECIPES_PER_PAGE + 1),
});

export const fetchRecipesFromFirestore = async ({
  queryParameters,
  position,
  sortBy,
  sortType,
}) => {
  const order = sortBy ? orderBy(sortBy, sortType) : orderBy("nutrition");
  const constraints = [...queryParameters.filter(Boolean), order];

  if (position) constraints.push(position);

  const recipesSnapshot = await getDocs(query(...constraints));
  const isLastPage = recipesSnapshot.docs.length <= RECIPES_PER_PAGE;
  const recipes = recipesSnapshot.docs
    .slice(0, RECIPES_PER_PAGE)
    .map((entry) => entry.data());

  firstVisible = recipesSnapshot.docs[0];
  lastVisible = recipesSnapshot.docs[recipesSnapshot.docs.length - 1];

  return { recipes, isLastPage };
};

export const fetchRecipeFromFirestore = async (recipeId) => {
  const recipeReference = doc(
    getFirestore(firebaseApp),
    FIRESTORE_COLLECTIONS.recipes,
    String(recipeId),
  );
  const recipeSnapshot = await getDoc(recipeReference);

  return recipeSnapshot.data();
};
