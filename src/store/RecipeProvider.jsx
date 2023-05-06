import { useState } from "react";
import RecipeContext from "./recipe-context";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { notificationActions } from "./notification";

const RecipeProvider = (props) => {
  const [recipeIsOpen, setRecipeIsOpen] = useState(false);
  const [currentRecipeId, setCurrentRecipeId] = useState(null);
  const [dailyLimitReached, setDailyLimitReached] = useState(false);

  const dispatch = useDispatch();

  const dailyLimitReachedHandler = useCallback(() => {
    setDailyLimitReached(true);
    dispatch(
      notificationActions.showNotification({
        title: "Daily limit of API is over :(",
        message:
          "The application will now enter test mode. The search result will remain the same. You can still use other features!",
      })
    );
  }, [dispatch]);

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
    dailyLimitReached: dailyLimitReached,
    onDailyLimitReached: dailyLimitReachedHandler,
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
