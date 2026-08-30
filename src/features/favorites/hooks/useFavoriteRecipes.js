import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createFavoriteRecipesFilter,
  createRecipeResultsLimit,
  getRecipesCollection,
} from "../../recipes/api/recipeRepository";
import { buildFavoriteRecipesUrl } from "../../recipes/api/recipeUrls";
import { recipeActions } from "../../recipes/store/recipesSlice";
import { getRecipes } from "../../recipes/store/recipesThunks";
import { MESSAGE_EMPTY_FAVORITES } from "../../../shared/constants";
import { selectRecipeDailyLimitIsReached } from "../../recipes/store/recipesSelectors";
import { selectAuthIsLoggedIn } from "../../auth/store/authSelectors";
import { selectFavoriteIds } from "../store/favoritesSelectors";

const favoritesReference = getRecipesCollection();

export const useFavoriteRecipes = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectAuthIsLoggedIn);
  const favoriteIds = useSelector(selectFavoriteIds);
  const dailyLimitIsReached = useSelector(selectRecipeDailyLimitIsReached);
  const filter = useMemo(
    () =>
      favoriteIds.length ? createFavoriteRecipesFilter(favoriteIds) : undefined,
    [favoriteIds],
  );

  useEffect(() => {
    if (!favoriteIds.length) {
      dispatch(recipeActions.setEmptyMessage(MESSAGE_EMPTY_FAVORITES));
      return;
    }

    dispatch(recipeActions.setEmptyMessage(""));
    dispatch(recipeActions.setCurrentPage(1));
    dispatch(
      getRecipes({
        requestUrl: buildFavoriteRecipesUrl(favoriteIds),
        firebaseRef: favoritesReference,
        filter,
        resultsAmount: createRecipeResultsLimit(),
      }),
    );

    return () => {
      dispatch(recipeActions.setOrderBy([]));
      dispatch(recipeActions.resetRecipes());
      dispatch(recipeActions.setEmptyMessage(""));
    };
  }, [favoriteIds, dispatch, dailyLimitIsReached, filter]);

  return {
    favoriteIds,
    favoritesReference,
    filter,
    isAuthenticated,
  };
};
