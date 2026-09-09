import {
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { RECIPES_PER_PAGE } from "../../../shared/constants";
import { getRecipesCollection } from "./recipeRepository";
import { mapRecipe } from "../utils/mapRecipe";
import type { RecipeApiItem, RecipeSort } from "../types";

export type RecipeSearchCursor = QueryDocumentSnapshot | undefined;

// Cursors belong to individual query pages, not module globals or Redux.
export const fetchRecipeSearchPage = async (
  { sortBy, sortType }: RecipeSort,
  after?: RecipeSearchCursor,
) => {
  const snapshot = await getDocs(
    query(
      getRecipesCollection(),
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
