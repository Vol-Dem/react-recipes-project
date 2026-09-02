import RecipeDetailsPage from "../../../features/recipes/pages/RecipeDetailsPage/RecipeDetailsPage";
import RecipesPage from "../../../features/recipes/pages/RecipesPage/RecipesPage";

export const metadata = { title: "Recipe Details" };

const RecipeRoute = () => (
  <RecipesPage>
    <RecipeDetailsPage />
  </RecipesPage>
);

export default RecipeRoute;
