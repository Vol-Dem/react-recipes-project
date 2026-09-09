import RecipeDetailsPage from "../../../../features/recipes/pages/RecipeDetailsPage/RecipeDetailsPage";
import { HydrationBoundary } from "@tanstack/react-query";
import { loadRecipeDetails } from "../../../../features/recipes/server/loadRecipeDetails";

export const metadata = { title: "Recipe Details" };

interface RecipeRouteProps {
  params: Promise<{ recipeId: string }>;
}

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
