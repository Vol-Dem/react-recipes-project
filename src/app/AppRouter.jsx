import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layout/Layout/Layout";
import Spinner from "../shared/components/ui/Spinner/Spinner";
import ProtectedRoute from "../features/auth/components/ProtectedRoute/ProtectedRoute";

const AboutPage = lazy(() => import("../pages/AboutPage/AboutPage"));
const ErrorPage = lazy(() => import("../pages/ErrorPage/ErrorPage"));
const FavoritesPage = lazy(() =>
  import("../features/favorites/pages/FavoritesPage/FavoritesPage")
);
const RecipesPage = lazy(() =>
  import("../features/recipes/pages/RecipesPage/RecipesPage")
);
const NotFoundPage = lazy(() => import("../pages/NotFoundPage/NotFoundPage"));
const PrivacyPolicyPage = lazy(() =>
  import("../features/legal/pages/PrivacyPolicyPage/PrivacyPolicyPage")
);
const Profile = lazy(() => import("../features/auth/pages/Profile/Profile"));
const RecipeDetailsPage = lazy(() =>
  import("../features/recipes/pages/RecipeDetailsPage/RecipeDetailsPage")
);
const TermsOfServicePage = lazy(() =>
  import("../features/legal/pages/TermsOfServicePage/TermsOfServicePage")
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <RecipesPage />,
        children: [
          {
            path: "recipe/:recipeId",
            element: <RecipeDetailsPage />,
            errorElement: <ErrorPage />,
          },
        ],
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "favorites",
            element: <FavoritesPage />,
            errorElement: <ErrorPage />,
            children: [
              {
                path: "recipe/:recipeId",
                element: <RecipeDetailsPage />,
                errorElement: <ErrorPage />,
              },
            ],
          },
        ],
      },
      {
        path: "tos",
        element: <TermsOfServicePage title="Terms of Service" />,
        errorElement: <ErrorPage />,
      },
      {
        path: "privacy",
        element: <PrivacyPolicyPage title="Privacy Policy" />,
        errorElement: <ErrorPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

const AppRouter = () => (
  <Suspense fallback={<Spinner />}>
    <RouterProvider router={router} />
  </Suspense>
);

export default AppRouter;
