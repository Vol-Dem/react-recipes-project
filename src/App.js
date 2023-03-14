import "./App.css";
import Layout from "./components/layout/Layout";
import Homepage from "./pages/Homepage";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import About from "./pages/About";
import RecipeProvider from "./store/RecipeProvider";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index element={<Homepage />} />
        <Route path="about" element={<About />} />
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
