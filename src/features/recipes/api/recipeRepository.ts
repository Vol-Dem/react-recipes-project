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
  type CollectionReference,
  type DocumentData,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import firebaseApp from "../../../config/firebase";
import {
  FIRESTORE_COLLECTIONS,
  RECIPES_PER_PAGE,
} from "../../../shared/constants";
import type { RecipeApiItem, RecipeDetails } from "../types";

let firstVisible: QueryDocumentSnapshot<DocumentData> | undefined;
let lastVisible: QueryDocumentSnapshot<DocumentData> | undefined;

export const getRecipesCollection = (): CollectionReference<DocumentData> =>
  collection(getFirestore(firebaseApp), FIRESTORE_COLLECTIONS.recipes);

export const createFavoriteRecipesFilter = (recipeIds: number[]) =>
  where("id", "in", recipeIds);

export const createRecipeResultsLimit = () => limit(RECIPES_PER_PAGE + 1);

export const createNextPageRequest = () => ({
  position: startAt(lastVisible!),
  resultsAmount: createRecipeResultsLimit(),
});

export const createPreviousPageRequest = () => ({
  position: endAt(firstVisible!),
  resultsAmount: limitToLast(RECIPES_PER_PAGE + 1),
});

interface FirestoreRecipeRequest {
  queryParameters: [
    CollectionReference<DocumentData>,
    ...(QueryConstraint | undefined)[],
  ];
  position?: QueryConstraint;
  sortBy?: string;
  sortType?: "asc" | "desc";
}

export const fetchRecipesFromFirestore = async ({
  queryParameters,
  position,
  sortBy,
  sortType,
}: FirestoreRecipeRequest): Promise<{
  recipes: RecipeApiItem[];
  isLastPage: boolean;
}> => {
  const order = sortBy ? orderBy(sortBy, sortType) : orderBy("nutrition");
  const [collectionReference, ...optionalConstraints] = queryParameters;
  const constraints = [
    ...optionalConstraints.filter((constraint): constraint is QueryConstraint =>
      Boolean(constraint),
    ),
    order,
  ];

  if (position) constraints.push(position);

  const recipesSnapshot = await getDocs(
    query(collectionReference, ...constraints),
  );
  const isLastPage = recipesSnapshot.docs.length <= RECIPES_PER_PAGE;
  const recipes = recipesSnapshot.docs
    .slice(0, RECIPES_PER_PAGE)
    .map((entry) => entry.data() as RecipeApiItem);

  firstVisible = recipesSnapshot.docs[0];
  lastVisible = recipesSnapshot.docs[recipesSnapshot.docs.length - 1];

  return { recipes, isLastPage };
};

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
