import React from "react";

const RecipeContext = React.createContext({
  recipeId: null,
  recipeIsOpen: false,
  setRecipeIsClosedHandler: () => {},
  setRecipeIsOpenHandler: () => {},
});

export default RecipeContext;
