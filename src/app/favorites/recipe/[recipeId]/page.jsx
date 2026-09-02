import ProtectedRoute from "../../../../features/auth/components/ProtectedRoute/ProtectedRoute";
import FavoritesPage from "../../../../features/favorites/pages/FavoritesPage/FavoritesPage";
import RecipeDetailsPage from "../../../../features/recipes/pages/RecipeDetailsPage/RecipeDetailsPage";

export const metadata = { title: "Recipe Details" };

const FavoriteRecipeRoute = () => (
  <ProtectedRoute>
    <FavoritesPage>
      <RecipeDetailsPage />
    </FavoritesPage>
  </ProtectedRoute>
);

export default FavoriteRecipeRoute;
