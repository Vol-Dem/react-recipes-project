import React from "react";

const RecipeContext = React.createContext({
  recipeId: null,
  recipeIsOpen: false,
  dailyLimitReached: false,
  onDailyLimitReached: () => {},
  closeRecipe: () => {},
  openRecipe: () => {},
});

export default RecipeContext;
