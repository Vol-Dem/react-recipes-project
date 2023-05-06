// import classes from "./App.module.scss";
import Layout from "./components/layout/layout/Layout";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import RecipeProvider from "./store/RecipeProvider";
import { useDispatch, useSelector } from "react-redux";
import ErrorMessage from "./components/ui/ErrorMessage";
import { useEffect } from "react";
import { initAuth } from "./store/auth";
import Card from "./components/ui/Card";
import { lazy } from "react";

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
      <Route
        errorElement={
          <Card>
            <ErrorMessage>404</ErrorMessage>
          </Card>
        }
        path="/"
        element={<Layout />}
      >
        <Route index element={<Homepage />} />
        <Route path="about" element={<About />} />
        {isAuth && <Route path="profile" element={<Profile />} />}
        {isAuth && <Route path="favorites" element={<Favorites />} />}
      </Route>
    )
  );

  return (
    <RecipeProvider>
      <RouterProvider router={router} />
    </RecipeProvider>
  );
}

export default App;
