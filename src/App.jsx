import Layout from "./components/layout/layout/Layout";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { initAuth } from "./store/auth";
import { lazy } from "react";
import Recipe from "./components/recipe/recipe/Recipe";
import ErrorPage from "./pages/ErrorPage";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/routing/ProtectedRoute";

const Homepage = lazy(() => import("./pages/Homepage"));
const About = lazy(() => import("./pages/About"));
const Profile = lazy(() => import("./pages/Profile"));
const Favorites = lazy(() => import("./pages/Favorites"));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<ErrorPage />} path="/" element={<Layout />}>
      <Route path="" element={<Homepage />}>
        <Route
          path="recipe/:recipeId"
          errorElement={<ErrorPage />}
          element={<Recipe />}
        />
      </Route>
      <Route path="about" element={<About />} />
      <Route element={<ProtectedRoute />}>
        <Route path="profile" element={<Profile />} />
        <Route
          path="favorites"
          errorElement={<ErrorPage />}
          element={<Favorites />}
        >
          <Route
            path="recipe/:recipeId"
            errorElement={<ErrorPage />}
            element={<Recipe />}
          />
        </Route>
      </Route>
      <Route
        path="tos"
        errorElement={<ErrorPage />}
        element={<TermsOfService title="Terms of Service" />}
      />
      <Route
        path="privacy"
        errorElement={<ErrorPage />}
        element={<PrivacyPolicy title="Privacy Policy" />}
      />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = dispatch(initAuth());

    return unsubscribe;
  }, [dispatch]);

  return <RouterProvider router={router} />;
}

export default App;
