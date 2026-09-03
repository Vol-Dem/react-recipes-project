import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useThrowAsyncError } from "../../../shared/hooks/useThrowAsyncError";
import { fetchRecipeFromFirestore } from "../api/recipeRepository";
import { buildRecipeDetailsUrl } from "../api/recipeUrls";
import { selectRecipeDailyLimitIsReached } from "../store/recipesSelectors";
import { useGetDataFromHttp } from "./useGetDataFromHttp";
import type { RecipeDetails } from "../types";

export const useRecipeDetails = (recipeId: string) => {
  const [recipe, setRecipe] = useState<RecipeDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const dailyLimitIsReached = useSelector(selectRecipeDailyLimitIsReached);
  const throwAsyncError = useThrowAsyncError();
  const getDataFromHttp = useGetDataFromHttp();

  useEffect(() => {
    setIsLoading(true);

    if (!dailyLimitIsReached) {
      const setRecipeData = (recipeData: RecipeDetails) => {
        setRecipe(recipeData);
        setIsLoading(false);
      };

      void getDataFromHttp<RecipeDetails>(
        { url: buildRecipeDetailsUrl(recipeId) },
        setRecipeData,
      );
      return;
    }

    const loadRecipeFromFirestore = async () => {
      try {
        const recipeData = await fetchRecipeFromFirestore(recipeId);

        if (!recipeData) {
          throw new Error("Recipe not found");
        }

        setRecipe(recipeData);
        setIsLoading(false);
      } catch (error) {
        throwAsyncError(error);
      }
    };

    void loadRecipeFromFirestore();
  }, [dailyLimitIsReached, getDataFromHttp, recipeId, throwAsyncError]);

  return { isLoading, recipe };
};
