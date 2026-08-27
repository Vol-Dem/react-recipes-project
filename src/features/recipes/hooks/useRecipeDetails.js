import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useThrowAsyncError } from "../../../shared/hooks/useThrowAsyncError";
import { fetchRecipeFromFirestore } from "../api/recipeRepository";
import { buildRecipeDetailsUrl } from "../api/recipeUrls";
import { useGetDataFromHttp } from "./useGetDataFromHttp";

export const useRecipeDetails = (recipeId) => {
  const [recipe, setRecipe] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const dailyLimitIsReached = useSelector(
    (state) => state.recipe.dailyLimitIsReached,
  );
  const throwAsyncError = useThrowAsyncError();
  const getDataFromHttp = useGetDataFromHttp();

  useEffect(() => {
    setIsLoading(true);

    if (!dailyLimitIsReached) {
      const setRecipeData = (recipeData) => {
        setRecipe(recipeData);
        setIsLoading(false);
      };

      getDataFromHttp(
        { url: buildRecipeDetailsUrl(recipeId) },
        setRecipeData,
      );
      return;
    }

    const loadRecipeFromFirestore = async () => {
      try {
        const recipeData = await fetchRecipeFromFirestore(recipeId);

        setRecipe(recipeData);
        setIsLoading(false);
      } catch (error) {
        throwAsyncError(error);
      }
    };

    loadRecipeFromFirestore();
  }, [
    dailyLimitIsReached,
    getDataFromHttp,
    recipeId,
    throwAsyncError,
  ]);

  return { isLoading, recipe };
};
