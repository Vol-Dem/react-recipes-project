import { getRecipeDetails } from "../../../../features/recipes/server/spoonacular";
import { recipeResponse } from "../../../../features/recipes/server/recipeResponse";

interface RecipeRouteContext {
  params: Promise<{ recipeId: string }>;
}

export const GET = (_request: Request, { params }: RecipeRouteContext) =>
  recipeResponse(async () => getRecipeDetails((await params).recipeId));
