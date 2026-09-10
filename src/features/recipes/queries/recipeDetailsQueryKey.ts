export type RecipeDetailsSource = "api" | "firestore";

/** Shares detail identity between server hydration and browser queries while isolating API and Firestore data. */
export const recipeDetailsQueryKey = (
  recipeId: string,
  source: RecipeDetailsSource,
) => ["recipes", "detail", source, recipeId] as const;
