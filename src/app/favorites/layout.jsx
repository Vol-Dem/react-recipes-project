import ProtectedRoute from "../../features/auth/components/ProtectedRoute/ProtectedRoute";
import FavoritesPage from "../../features/favorites/pages/FavoritesPage/FavoritesPage";

export const metadata = { title: "Favorites" };

const FavoritesLayout = ({ children }) => (
  <ProtectedRoute>
    <FavoritesPage>{children}</FavoritesPage>
  </ProtectedRoute>
);

export default FavoritesLayout;
