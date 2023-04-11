import React from "react";

const RecipeContext = React.createContext({
  recipeId: null,
  recipeIsOpen: false,
  closeRecipe: () => {},
  openRecipe: () => {},
});

export default RecipeContext;
