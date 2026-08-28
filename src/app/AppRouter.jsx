import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layout/Layout/Layout";
import Spinner from "../shared/components/ui/Spinner/Spinner";
import ProtectedRoute from "../features/auth/components/ProtectedRoute/ProtectedRoute";

const AboutPage = lazy(() => import("../pages/AboutPage/AboutPage"));
const ErrorPage = lazy(() => import("../pages/ErrorPage/ErrorPage"));
const FavoritesPage = lazy(
  () => import("../features/favorites/pages/FavoritesPage/FavoritesPage"),
);
const RecipesPage = lazy(
  () => import("../features/recipes/pages/RecipesPage/RecipesPage"),
);
const NotFoundPage = lazy(() => import("../pages/NotFoundPage/NotFoundPage"));
const PrivacyPolicyPage = lazy(
  () => import("../features/legal/pages/PrivacyPolicyPage/PrivacyPolicyPage"),
);
const Profile = lazy(() => import("../features/auth/pages/Profile/Profile"));
const RecipeDetailsPage = lazy(
  () => import("../features/recipes/pages/RecipeDetailsPage/RecipeDetailsPage"),
);
const TermsOfServicePage = lazy(
  () => import("../features/legal/pages/TermsOfServicePage/TermsOfServicePage"),
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage title="Error" />,
    children: [
      {
        path: "",
        element: (
          <RecipesPage title="Your recipe book - find and share everyday cooking inspiration" />
        ),
        children: [
          {
            path: "recipe/:recipeId",
            element: <RecipeDetailsPage title="Recipe Details" />,
            errorElement: <ErrorPage title="Error" />,
          },
        ],
      },
      {
        path: "about",
        element: <AboutPage title="About" />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "profile",
            element: <Profile title="Profile" />,
          },
          {
            path: "favorites",
            element: <FavoritesPage title="Favorites" />,
            errorElement: <ErrorPage title="Error" />,
            children: [
              {
                path: "recipe/:recipeId",
                element: <RecipeDetailsPage title="Recipe Details" />,
                errorElement: <ErrorPage title="Error" />,
              },
            ],
          },
        ],
      },
      {
        path: "tos",
        element: <TermsOfServicePage title="Terms of Service" />,
        errorElement: <ErrorPage title="Error" />,
      },
      {
        path: "privacy",
        element: <PrivacyPolicyPage title="Privacy Policy" />,
        errorElement: <ErrorPage title="Error" />,
      },
      {
        path: "*",
        element: <NotFoundPage title="Page Not Found" />,
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
