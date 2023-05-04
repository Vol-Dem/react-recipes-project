import { getDocs } from "firebase/firestore";
import { useCallback } from "react";
import { useState } from "react";

export const useGetDataFromFirebase = () => {
  const [lastVisible, setLastVisible] = useState();
  const [firstVisible, setFirstVisible] = useState();

  const getRecipesFromFireBase = useCallback(async (query) => {
    const recipesData = await getDocs(query);

    const isLast =
      recipesData.docs.length <= +process.env.REACT_APP_AMOUNT_PER_PAGE;
    const recipes = recipesData.docs.flatMap((entry, i) => {
      const recipe = entry.data();

      if (i === +process.env.REACT_APP_AMOUNT_PER_PAGE) {
        return [];
      }
      return {
        id: recipe.id,
        title: recipe.title,
        img: recipe.image,
        time: recipe.readyInMinutes,
        calories: recipe.nutrition.nutrients.find(
          ({ name }) => name === "Calories"
        ).amount,
        servings: recipe.servings,
      };
    });

    const lastVisibleRecipe = recipesData.docs[recipesData.docs.length - 1];
    const firstVisibleRecipe = recipesData.docs[0];

    setLastVisible(lastVisibleRecipe);
    setFirstVisible(firstVisibleRecipe);

    return [recipes, isLast];
  }, []);

  return [
    {
      lastVisible: lastVisible,
      firstVisible: firstVisible,
    },
    getRecipesFromFireBase,
  ];
};
