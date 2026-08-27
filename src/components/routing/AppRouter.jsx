import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../layout/layout/Layout";
import Spinner from "../ui/Spinner";
import ProtectedRoute from "./ProtectedRoute";

const About = lazy(() => import("../../pages/About"));
const ErrorPage = lazy(() => import("../../pages/ErrorPage"));
const Favorites = lazy(() => import("../../pages/Favorites"));
const Homepage = lazy(() => import("../../pages/Homepage"));
const NotFound = lazy(() => import("../../pages/NotFound"));
const PrivacyPolicy = lazy(() => import("../../pages/PrivacyPolicy"));
const Profile = lazy(() => import("../../pages/Profile"));
const Recipe = lazy(() => import("../recipe/recipe/Recipe"));
const TermsOfService = lazy(() => import("../../pages/TermsOfService"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Homepage />,
        children: [
          {
            path: "recipe/:recipeId",
            element: <Recipe />,
            errorElement: <ErrorPage />,
          },
        ],
      },
      {
        path: "about",
        element: <About />,
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
            element: <Favorites />,
            errorElement: <ErrorPage />,
            children: [
              {
                path: "recipe/:recipeId",
                element: <Recipe />,
                errorElement: <ErrorPage />,
              },
            ],
          },
        ],
      },
      {
        path: "tos",
        element: <TermsOfService title="Terms of Service" />,
        errorElement: <ErrorPage />,
      },
      {
        path: "privacy",
        element: <PrivacyPolicy title="Privacy Policy" />,
        errorElement: <ErrorPage />,
      },
      {
        path: "*",
        element: <NotFound />,
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
