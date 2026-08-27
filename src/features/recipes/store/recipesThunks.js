import { notificationActions } from "../../notifications/store/notificationSlice";
import { fetchRecipesFromApi } from "../api/recipeApi";
import {
  createNextPageRequest,
  createPreviousPageRequest,
  createRecipeResultsLimit,
  fetchRecipesFromFirestore,
} from "../api/recipeRepository";
import { mapRecipe } from "../utils/mapRecipe";
import { paginateRecipes } from "../utils/paginateRecipes";
import { sortRecipeCollection } from "../utils/sortRecipes";
import { recipeActions } from "./recipesSlice";

export const splitRecipesPerPage = () => (dispatch, getState) => {
  const {
    currentPage,
    dailyLimitIsReached,
    sortedRecipes,
  } = getState().recipe;

  if (dailyLimitIsReached) {
    dispatch(recipeActions.setRecipesPerPage(sortedRecipes));
    return;
  }

  const { recipes, isLastPage } = paginateRecipes(
    sortedRecipes,
    currentPage,
  );

  dispatch(recipeActions.setRecipesPerPage(recipes));
  if (isLastPage) {
    dispatch(recipeActions.setIsLastPage(true));
  }
};

export const getRecipes = ({
  requestUrl,
  firebaseRef,
  filter,
  position,
  resultsAmount,
}) => {
  return async (dispatch, getState) => {
    const dailyLimitIsReached = getState().recipe.dailyLimitIsReached;

    dispatch(recipeActions.setIsLastPage(false));
    dispatch(recipeActions.setRecipesIsLoading(true));

    try {
      let searchResult;

      if (!dailyLimitIsReached) {
        searchResult = await fetchRecipesFromApi(requestUrl);
      } else {
        const { sortBy, sortType } = getState().recipe.orderBy;
        const firestoreResult = await fetchRecipesFromFirestore({
          queryParameters: [firebaseRef, filter, resultsAmount],
          position,
          sortBy,
          sortType,
        });

        dispatch(recipeActions.setIsLastPage(firestoreResult.isLastPage));
        searchResult = firestoreResult.recipes;
      }

      const recipesData = searchResult.results || searchResult;
      const recipes = recipesData.map(mapRecipe);

      dispatch(recipeActions.setSearchResult(recipes));
      dispatch(recipeActions.setSortedRecipes(recipes));
      dispatch(splitRecipesPerPage());
      dispatch(recipeActions.setRecipesIsLoading(false));
    } catch (error) {
      console.log(error.message);

      if (error.message.includes("402")) {
        dispatch(recipeActions.setDailyLimitIsReached(true));
        dispatch(
          notificationActions.showNotification({
            title: "Daily limit of API is over :(",
            message:
              "The application will now enter test mode. Search result will remain the same. You can still use other features!",
          }),
        );
        dispatch(
          getRecipes({
            requestUrl,
            firebaseRef,
            filter,
            position,
            resultsAmount,
          }),
        );
        return;
      }

      dispatch(recipeActions.setErrorMessage(error.message));
      dispatch(recipeActions.setRecipesIsLoading(false));
    }
  };
};

export const nextPage = (firebaseRef, filter) => {
  return async (dispatch, getState) => {
    const { currentPage, dailyLimitIsReached } = getState().recipe;

    dispatch(recipeActions.setCurrentPage(currentPage + 1));

    if (!dailyLimitIsReached) {
      dispatch(splitRecipesPerPage());
      return;
    }

    const { position, resultsAmount } = createNextPageRequest();
    dispatch(getRecipes({ firebaseRef, filter, resultsAmount, position }));
  };
};

export const prevPage = (firebaseRef, filter) => {
  return async (dispatch, getState) => {
    const { currentPage, dailyLimitIsReached } = getState().recipe;

    dispatch(recipeActions.setCurrentPage(currentPage - 1));

    if (!dailyLimitIsReached) {
      dispatch(splitRecipesPerPage());
      dispatch(recipeActions.setIsLastPage(false));
      return;
    }

    const { position, resultsAmount } = createPreviousPageRequest();
    dispatch(getRecipes({ firebaseRef, filter, resultsAmount, position }));
  };
};

export const sortRecipes = (firebaseRef, filter) => {
  return (dispatch, getState) => {
    dispatch(recipeActions.setCurrentPage(1));
    dispatch(recipeActions.setIsLastPage(false));

    const {
      dailyLimitIsReached,
      orderBy: { sortBy, sortType },
      searchResult,
    } = getState().recipe;

    if (!dailyLimitIsReached) {
      const sortedRecipes = sortRecipeCollection(searchResult, {
        sortBy,
        sortType,
      });

      dispatch(recipeActions.setSortedRecipes(sortedRecipes));
      dispatch(splitRecipesPerPage());
      return;
    }

    dispatch(
      getRecipes({
        firebaseRef,
        filter,
        resultsAmount: createRecipeResultsLimit(),
      }),
    );
  };
};
