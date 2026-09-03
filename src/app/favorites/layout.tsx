import ProtectedRoute from "../../features/auth/components/ProtectedRoute/ProtectedRoute";
import FavoritesPage from "../../features/favorites/pages/FavoritesPage/FavoritesPage";
import type { PropsWithChildren } from "react";

export const metadata = { title: "Favorites" };

const FavoritesLayout = ({ children }: PropsWithChildren) => (
  <ProtectedRoute>
    <FavoritesPage>{children}</FavoritesPage>
  </ProtectedRoute>
);

export default FavoritesLayout;
