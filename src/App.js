// import classes from "./App.module.scss";
import Layout from "./components/layout/layout/Layout";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { initAuth } from "./store/auth";
import { lazy } from "react";
import Recipe from "./components/recipe/recipe/Recipe";
import ErrorPage from "./pages/ErrorPage";

const Homepage = lazy(() => import("./pages/Homepage"));
const About = lazy(() => import("./pages/About"));
const Profile = lazy(() => import("./pages/Profile"));
const Favorites = lazy(() => import("./pages/Favorites"));

function App() {
  const isAuth = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initAuth());
  }, [dispatch]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route errorElement={<ErrorPage />} path="/" element={<Layout />}>
        <Route path="/" errorElement={<ErrorPage />} element={<Homepage />}>
          <Route
            path="recipe/:recipeId"
            errorElement={<ErrorPage />}
            element={<Recipe />}
          ></Route>
        </Route>
        <Route path="about" element={<About />} />
        {isAuth && <Route path="profile" element={<Profile />} />}
        {isAuth && (
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
        )}
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
