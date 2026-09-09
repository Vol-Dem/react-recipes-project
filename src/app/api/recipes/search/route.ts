import { searchRecipes } from "../../../../features/recipes/server/spoonacular";
import { recipeResponse } from "../../../../features/recipes/server/recipeResponse";

export const GET = (request: Request) =>
  recipeResponse(() =>
    searchRecipes(Object.fromEntries(new URL(request.url).searchParams)),
  );
