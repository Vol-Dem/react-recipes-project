import RecipeDetailsPage from "../../../../features/recipes/pages/RecipeDetailsPage/RecipeDetailsPage";
import { HydrationBoundary } from "@tanstack/react-query";
import { loadRecipeDetails } from "../../../../features/recipes/server/loadRecipeDetails";
import { buildRecipeMetadata } from "../../../../features/recipes/utils/recipeMetadata";

interface RecipeRouteProps {
  params: Promise<{ recipeId: string }>;
}

export const generateMetadata = async ({ params }: RecipeRouteProps) => {
  const { recipeId } = await params;
  const { recipe } = await loadRecipeDetails(recipeId);
  return buildRecipeMetadata(recipe);
};

const RecipeRoute = async ({ params }: RecipeRouteProps) => {
  const { recipeId } = await params;
  const { state, apiLimitReached } = await loadRecipeDetails(recipeId);

  return (
    <HydrationBoundary state={state}>
      <RecipeDetailsPage initialApiLimitReached={apiLimitReached} />
    </HydrationBoundary>
  );
};

export default RecipeRoute;
