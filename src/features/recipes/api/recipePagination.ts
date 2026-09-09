import {
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  type QueryDocumentSnapshot,
  type QueryConstraint,
} from "firebase/firestore";
import { RECIPES_PER_PAGE } from "../../../shared/constants";
import { getRecipesCollection } from "./recipeRepository";
import { mapRecipe } from "../utils/mapRecipe";
import type { RecipeApiItem, RecipeSort } from "../types";

export type RecipePageCursor = QueryDocumentSnapshot | undefined;

// Cursors belong to individual query pages, not module globals or Redux.
export const fetchRecipePage = async (
  { sortBy, sortType }: RecipeSort,
  after?: RecipePageCursor,
  filter?: QueryConstraint,
) => {
  const snapshot = await getDocs(
    query(
      getRecipesCollection(),
      ...(filter ? [filter] : []),
      sortBy ? orderBy(sortBy, sortType) : orderBy("nutrition"),
      ...(after ? [startAfter(after)] : []),
      limit(RECIPES_PER_PAGE + 1),
    ),
  );
  const documents = snapshot.docs.slice(0, RECIPES_PER_PAGE);
  const isLastPage = snapshot.docs.length <= RECIPES_PER_PAGE;

  return {
    recipes: documents.map((document) =>
      mapRecipe(document.data() as RecipeApiItem),
    ),
    isLastPage,
    nextCursor: isLastPage ? undefined : documents.at(-1),
  };
};
