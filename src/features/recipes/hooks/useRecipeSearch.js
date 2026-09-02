import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  createRecipeResultsLimit,
  getRecipesCollection,
} from "../api/recipeRepository";
import { buildRecipeSearchUrl } from "../api/recipeUrls";
import { recipeActions } from "../store/recipesSlice";
import { getRecipes } from "../store/recipesThunks";

const recipeReference = getRecipesCollection();

export const useRecipeSearch = () => {
  const [searchTitle, setSearchTitle] = useState("Search result");
  const dispatch = useDispatch();
  const router = useRouter();

  const submitSearch = useCallback(
    (searchFilters) => {
      const {
        query = "",
        cuisine = "",
        diet = "",
        intolerance = "",
        type = "",
      } = searchFilters;
      const requestUrl = buildRecipeSearchUrl(searchFilters);
      const emptyMessage = `No results for "${query}". Try checking your spelling`;

      setSearchTitle(query || "Search result");
      dispatch(
        recipeActions.setOptions(
          [cuisine, diet, intolerance, type].filter(Boolean),
        ),
      );
      dispatch(recipeActions.setEmptyMessage(emptyMessage));
      dispatch(recipeActions.setOrderBy([]));
      dispatch(recipeActions.setCurrentPage(1));
      dispatch(
        getRecipes({
          requestUrl,
          firebaseRef: recipeReference,
          resultsAmount: createRecipeResultsLimit(),
        }),
      );
      router.push("/");
    },
    [dispatch, router],
  );

  useEffect(
    () => () => {
      dispatch(recipeActions.resetRecipes());
      dispatch(recipeActions.setOrderBy([]));
      dispatch(recipeActions.setErrorMessage(""));
      dispatch(recipeActions.setEmptyMessage(""));
      dispatch(recipeActions.setOptions([]));
    },
    [dispatch],
  );

  return {
    recipeReference,
    searchTitle,
    submitSearch,
  };
};
