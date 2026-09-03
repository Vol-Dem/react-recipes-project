import type { RecipeSortDirection } from "../types";

export const sortRecipeCollection = <
  SortKey extends PropertyKey,
  Recipe extends Record<SortKey, number>,
>(
  recipes: Recipe[],
  { sortBy, sortType }: { sortBy: SortKey; sortType: RecipeSortDirection },
) => {
  const direction = sortType === "asc" ? 1 : -1;

  return [...recipes].sort(
    (firstRecipe, secondRecipe) =>
      (firstRecipe[sortBy] - secondRecipe[sortBy]) * direction,
  );
};
