import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createFavoriteRecipesFilter,
  createRecipeResultsLimit,
  getRecipesCollection,
} from "../../recipes/api/recipeRepository";
import { buildFavoriteRecipesUrl } from "../../recipes/api/recipeUrls";
import {
  getRecipes,
  recipeActions,
} from "../../recipes/store/recipesSlice";
import { MESSAGE_EMPTY_FAVORITES } from "../../../shared/constants";

const favoritesReference = getRecipesCollection();

export const useFavoriteRecipes = () => {
  const [filter, setFilter] = useState();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isLoggedIn);
  const favoriteIds = useSelector((state) => state.fav.favList);
  const dailyLimitIsReached = useSelector(
    (state) => state.recipe.dailyLimitIsReached,
  );

  useEffect(() => {
    if (!favoriteIds.length) {
      dispatch(recipeActions.setEmptyMessage(MESSAGE_EMPTY_FAVORITES));
      return;
    }

    const favoriteFilter = createFavoriteRecipesFilter(favoriteIds);

    setFilter(favoriteFilter);
    dispatch(recipeActions.setEmptyMessage(""));
    dispatch(recipeActions.setCurrentPage(1));
    dispatch(
      getRecipes({
        requestUrl: buildFavoriteRecipesUrl(favoriteIds),
        firebaseRef: favoritesReference,
        filter: favoriteFilter,
        resultsAmount: createRecipeResultsLimit(),
      }),
    );

    return () => {
      dispatch(recipeActions.setOrderBy([]));
      dispatch(recipeActions.resetRecipes());
      dispatch(recipeActions.setEmptyMessage(""));
    };
  }, [favoriteIds, dispatch, dailyLimitIsReached]);

  return {
    favoriteIds,
    favoritesReference,
    filter,
    isAuthenticated,
  };
};
