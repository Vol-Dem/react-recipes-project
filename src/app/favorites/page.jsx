import ProtectedRoute from "../../features/auth/components/ProtectedRoute/ProtectedRoute";
import FavoritesPage from "../../features/favorites/pages/FavoritesPage/FavoritesPage";

export const metadata = { title: "Favorites" };

const FavoritesRoute = () => (
  <ProtectedRoute>
    <FavoritesPage />
  </ProtectedRoute>
);

export default FavoritesRoute;
