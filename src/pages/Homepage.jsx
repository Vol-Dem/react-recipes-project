import SearchBox from "../components/search-bar/SearchBox";
import classes from "./Homepage.module.css";
import { useState, useEffect, useContext } from "react";
import RecipeCardList from "../components/recipe-card-list/RecipeCardList";
import Recipe from "../components/recipe/Recipe";
import Logo from "../components/layout/Logo";
import ErrorProvider from "../store/ErrorProvider";
import RecipeContext from "../store/recipe-context";

const Homepage = () => {
  const [searchResultIsOpen, setSearchResultIsOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [formData, setFormData] = useState({
    query: "",
    cuisine: "",
    diet: "",
    intolerance: "",
    type: "",
    maxReadyTime: "",
    minCalories: "",
    maxCalories: "",
  });

  const recipeCtx = useContext(RecipeContext);
  const recipeIsOpen = recipeCtx.recipeIsOpen;
  const closeRecipe = recipeCtx.setRecipeIsClosedHandler;

  const getFormDataHandler = (data) => {
    setFormData({
      query: "",
      cuisine: "",
      diet: "",
      intolerance: "",
      type: "",
      maxReadyTime: "",
      minCalories: "",
      maxCalories: "",
      ...data,
    });
    console.log(formData);
    setSearchResultIsOpen(true);
    closeRecipe();
  };

  useEffect(() => {
    const windowSizeHandler = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", windowSizeHandler);

    return () => {
      window.removeEventListener("resize", windowSizeHandler);
    };
  });

  return (
    <ErrorProvider>
      <section
        className={`${classes["section-search"]} ${
          searchResultIsOpen ? classes.animate : ""
        }`}
      >
        {!searchResultIsOpen && <Logo />}
        <SearchBox getFormData={getFormDataHandler} />
        <div
          className={`${classes.container} ${
            recipeIsOpen ? classes.recipe : ""
          }`}
        >
          <div>
            {searchResultIsOpen && (windowWidth > 768 || !recipeIsOpen) && (
              <RecipeCardList data={formData} windowWidth={windowWidth} />
            )}
          </div>
          {recipeIsOpen && <Recipe />}
        </div>
      </section>
    </ErrorProvider>
  );
};

export default Homepage;
