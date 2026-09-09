export type RecipeDetailsSource = "api" | "firestore";

// Shared by server hydration and browser queries without importing Firebase.
export const recipeDetailsQueryKey = (
  recipeId: string,
  source: RecipeDetailsSource,
) => ["recipes", "detail", source, recipeId] as const;
