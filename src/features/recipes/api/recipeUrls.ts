import type { SearchFilters } from "../types";

type RecipeUrlParameters = Record<
  string,
  string | number | boolean | undefined
>;

const createRecipeUrl = (path: string, parameters: RecipeUrlParameters) => {
  const searchParameters = new URLSearchParams(
    Object.fromEntries(
      Object.entries(parameters)
        .filter(
          (entry): entry is [string, string | number | boolean] =>
            entry[1] !== undefined,
        )
        .map(([name, value]) => [name, String(value)]),
    ),
  );

  return `/api/recipes${path}?${searchParameters}`;
};

/** Builds a local API URL, retaining empty text filters and omitting unset numeric limits. */
export const buildRecipeSearchUrl = ({
  query = "",
  cuisine = "",
  diet = "",
  intolerance = "",
  type = "",
  maxReadyTime = "",
  minCalories = "",
  maxCalories = "",
}: SearchFilters = {}) => {
  const parameters: RecipeUrlParameters = {
    query,
    cuisine,
    diet,
    intolerance,
    type,
  };

  if (maxReadyTime) parameters.maxReadyTime = maxReadyTime;
  if (minCalories) parameters.minCalories = minCalories;
  if (maxCalories) parameters.maxCalories = maxCalories;

  return createRecipeUrl("/search", parameters);
};

/** Encodes numeric recipe IDs for the local bulk endpoint; callers handle empty lists. */
export const buildFavoriteRecipesUrl = (recipeIds: number[]) =>
  createRecipeUrl("/bulk", {
    ids: recipeIds.join(","),
  });

/** Encodes a single path segment for the local API, not the user-facing detail route. */
export const buildRecipeDetailsUrl = (recipeId: string | number) =>
  `/api/recipes/${encodeURIComponent(recipeId)}`;
