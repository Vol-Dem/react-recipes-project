import classes from "./Homepage.module.scss";
import SearchBox from "../components/search/SearchBox";
import { useState, useContext } from "react";
import RecipeItemList from "../components/recipe/recipe-item-list/RecipeItemList";
import Recipe from "../components/recipe/recipe/Recipe";
import Logo from "../components/layout/logo/Logo";
import RecipeContext from "../store/recipe-context";
import ErrorBoundary from "../components/error-boundary/ErrorBoundary";
import { useEffect } from "react";

const Homepage = () => {
  const [searchResultIsOpen, setSearchResultIsOpen] = useState(false);
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
  const recipeId = recipeCtx.recipeId;
  const recipeIsOpen = recipeCtx.recipeIsOpen;
  const closeRecipe = recipeCtx.closeRecipe;

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
    return () => {
      closeRecipe();
    };
  }, [closeRecipe]);

  return (
    <>
      <section
        className={`${classes["section-search"]} ${
          searchResultIsOpen ? classes.mt0 : ""
        }`}
      >
        {!searchResultIsOpen && <Logo />}
        <SearchBox getFormData={getFormDataHandler} />
      </section>
      <section
        className={`${classes["section-content"]} ${
          recipeIsOpen ? classes["recipe-columns"] : ""
        }`}
      >
        <div>
          {searchResultIsOpen && (
            <ErrorBoundary key={formData.query}>
              <RecipeItemList data={formData} />
            </ErrorBoundary>
          )}
        </div>

        {recipeIsOpen && (
          <ErrorBoundary key={recipeId}>
            <Recipe />
          </ErrorBoundary>
        )}
      </section>
    </>
  );
};

export default Homepage;
