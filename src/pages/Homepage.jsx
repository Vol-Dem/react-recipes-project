import SearchBox from "../components/search/SearchBox";
import classes from "./Homepage.module.css";
import { useState, useContext } from "react";
import RecipeItemList from "../components/recipe/recipe-item-list/RecipeItemList";
import Recipe from "../components/recipe/recipe/Recipe";
import Logo from "../components/layout/logo/Logo";
import ErrorProvider from "../store/ErrorProvider";
import RecipeContext from "../store/recipe-context";

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

  return (
    <ErrorProvider>
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
        <div>{searchResultIsOpen && <RecipeItemList data={formData} />}</div>
        {recipeIsOpen && <Recipe />}
      </section>
    </ErrorProvider>
  );
};

export default Homepage;
