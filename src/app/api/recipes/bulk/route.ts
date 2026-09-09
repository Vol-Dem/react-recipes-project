import { getFavoriteRecipes } from "../../../../features/recipes/server/spoonacular";
import { recipeResponse } from "../../../../features/recipes/server/recipeResponse";

export const GET = (request: Request) =>
  recipeResponse(() =>
    getFavoriteRecipes(Object.fromEntries(new URL(request.url).searchParams)),
  );
