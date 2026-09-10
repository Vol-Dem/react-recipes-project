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

/**
 * Reads one Firestore page plus a look-ahead document to detect the final page.
 * Start a new cursor chain when sorting or filtering changes.
 *
 * @param after - Last displayed document from the preceding page, not the look-ahead document.
 * @param filter - Optional Firestore constraint, such as favorite ID membership.
 * @returns Mapped recipes and an opaque next-page cursor. Keep cursors in the
 * browser query cache; they are not safe for Redux or server dehydration.
 */
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
