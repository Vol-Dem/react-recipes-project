import { useState } from "react";
import RecipeContext from "./recipe-context";
import { useCallback } from "react";

const RecipeProvider = (props) => {
  const [recipeIsOpen, setRecipeIsOpen] = useState(false);
  const [currentRecipeId, setCurrentRecipeId] = useState(null);

  //   const setRecipeIdHandler = (id) => {
  //     setCurrentRecipeId(id);
  //   };

  const setRecipeIsOpenHandler = (id) => {
    setRecipeIsOpen(true);
    if (currentRecipeId !== id) setCurrentRecipeId(id);
  };

  const setRecipeIsClosedHandler = useCallback(() => {
    setRecipeIsOpen(false);
  }, []);

  const recipeContext = {
    recipeId: currentRecipeId,
    recipeIsOpen: recipeIsOpen,
    closeRecipe: setRecipeIsClosedHandler,
    openRecipe: setRecipeIsOpenHandler,
  };

  return (
    <RecipeContext.Provider value={recipeContext}>
      {props.children}
    </RecipeContext.Provider>
  );
};

export default RecipeProvider;
