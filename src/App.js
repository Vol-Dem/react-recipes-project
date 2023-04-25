import "./App.css";
import Layout from "./components/layout/layout/Layout";
import Homepage from "./pages/Homepage";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import About from "./pages/About";
import RecipeProvider from "./store/RecipeProvider";
import { useDispatch, useSelector } from "react-redux";
import Profile from "./pages/Profile";
import ErrorMessage from "./components/ui/ErrorMessage";
import { useEffect } from "react";
import { initAuth } from "./store/auth";
import Favorites from "./pages/Favorites";

function App() {
  const isAuth = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initAuth());
  }, [dispatch]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        errorElement={<ErrorMessage message="404" />}
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
