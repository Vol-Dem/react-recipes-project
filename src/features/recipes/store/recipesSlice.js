import { createSlice } from "@reduxjs/toolkit";
import { notificationActions } from "../../notifications/store/notificationSlice";
import { mapRecipe } from "../utils/mapRecipe";
import { paginateRecipes } from "../utils/paginateRecipes";
import { sortRecipeCollection } from "../utils/sortRecipes";
import { fetchRecipesFromApi } from "../api/recipeApi";
import {
  createNextPageRequest,
  createPreviousPageRequest,
  createRecipeResultsLimit,
  fetchRecipesFromFirestore,
} from "../api/recipeRepository";

const recipeInitialState = {
  searchResult: [],
  sortedRecipes: [],
  recipesPerPage: [],
  orderBy: {},
  recipesIsLoading: false,
  currentPage: 1,
  isLastPage: false,
  dailyLimitIsReached: false,
  title: "",
  options: [],
  emptyMessage: "",
  errorMessage: "",
};

const recipeSlice = createSlice({
  name: "recipe",
  initialState: recipeInitialState,
  reducers: {
    setSearchResult(state, action) {
      state.searchResult = action.payload;
    },
    setSortedRecipes(state, action) {
      state.sortedRecipes = action.payload;
    },
    setRecipesPerPage(state, action) {
      state.recipesPerPage = action.payload;
    },
    setOrderBy(state, action) {
      state.orderBy = action.payload;
    },
    setRecipesIsLoading(state, action) {
      state.recipesIsLoading = action.payload;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    setIsLastPage(state, action) {
      state.isLastPage = action.payload;
    },
    setDailyLimitIsReached(state) {
      state.dailyLimitIsReached = true;
    },
    setTitle(state, action) {
      state.title = action.payload;
    },
    setOptions(state, action) {
      state.options = action.payload;
    },
    setEmptyMessage(state, action) {
      state.emptyMessage = action.payload;
    },
    setErrorMessage(state, action) {
      state.errorMessage = action.payload;
    },
    resetRecipes(state) {
      state.recipesPerPage = [];
    },
  },
});

/**
 * Split recipes per page
 * @returns
 */
export const splitRecipesPerPage = () => {
  return (dispatch, getState) => {
    const dailyLimitIsReached = getState().recipe.dailyLimitIsReached;
    const sortedRecipes = getState().recipe.sortedRecipes;
    if (!dailyLimitIsReached) {
      const currentPage = getState().recipe.currentPage;
      const { recipes, isLastPage } = paginateRecipes(
        sortedRecipes,
        currentPage,
      );

      dispatch(recipeActions.setRecipesPerPage(recipes));
      if (isLastPage) {
        dispatch(recipeActions.setIsLastPage(true));
      }
    } else {
      dispatch(recipeActions.setRecipesPerPage(sortedRecipes));
    }
  };
};

/**
 *Fetch data from API if daily limit is not reached or from firestore if it was reached and dispatch actions to set recipe data.
 Dispatch notification about daily limit when a 402 error occurs.
 Dispatch error message if error occurs.
 * @param {Object} obj - An object.
 * @param {string} obj.requestUrl - URL with parameters to fetch data from API
 * @param {Object} obj.firebaseRef - Reference to Firebase.
 * @param {Object} [obj.filter] - Result of the Firestore filter function (where()) for the Firestore query.
 * @param {Object} [obj.position] - Result of Firestore startAt() or endAt() for the Firestore query.
 * @param {Object} obj.resultsAmount - Result of Firestore limit() or limitToLast() for the query. Amount of expected results from Firestore.
 * @returns 
 */
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
      const recipesArr = searchResult.results || searchResult;
      const recipes = recipesArr.map(mapRecipe);

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
          })
        );
        dispatch(
          getRecipes({
            requestUrl,
            firebaseRef,
            filter,
            position,
            resultsAmount,
          })
        );
      } else {
        dispatch(recipeActions.setErrorMessage(error.message));
        dispatch(recipeActions.setRecipesIsLoading(false));
      }
    }
  };
};

/**
 * Switch to next page.
 * When the daily limit is reached, dispatches a thunk to fetch the next portion of data from Firestore.
 * @param {Object} firebaseRef - Reference to Firebase.
 * @param {Object} [filter] - Firestore filter function (where()) for firestore query.
 * @returns
 */
export const nextPage = (firebaseRef, filter) => {
  return async (dispatch, getState) => {
    const dailyLimitIsReached = getState().recipe.dailyLimitIsReached;
    const currPage = getState().recipe.currentPage + 1;
    dispatch(recipeActions.setCurrentPage(currPage));

    if (!dailyLimitIsReached) {
      dispatch(splitRecipesPerPage());
    } else {
      const { position, resultsAmount } = createNextPageRequest();
      dispatch(getRecipes({ firebaseRef, filter, resultsAmount, position }));
    }
  };
};

/**
 * Switch to previous page.
 * When the daily limit is reached, dispatches a thunk to fetch the previous portion of data from Firestore.
 * @param {Object} firebaseRef - Reference to Firebase.
 * @param {Object} [filter] - Firestore filter function (where()) for firestore query.
 * @returns
 */
export const prevPage = (firebaseRef, filter) => {
  return async (dispatch, getState) => {
    const dailyLimitIsReached = getState().recipe.dailyLimitIsReached;
    const currPage = getState().recipe.currentPage - 1;
    dispatch(recipeActions.setCurrentPage(currPage));

    if (!dailyLimitIsReached) {
      dispatch(splitRecipesPerPage());
      dispatch(recipeActions.setIsLastPage(false));
    } else {
      const { position, resultsAmount } = createPreviousPageRequest();
      dispatch(getRecipes({ firebaseRef, filter, resultsAmount, position }));
    }
  };
};

/**
 * Sort current recipes data
 * When the daily limit is reached, dispatches a thunk to fetch sorted data from Firestore.
 * @param {Object} firebaseRef - Reference to Firebase.
 * @param {Object} [filter] - Firestore filter function (where()) for firestore query.
 * @returns
 */
export const sortRecipes = (firebaseRef, filter) => {
  return (dispatch, getState) => {
    dispatch(recipeActions.setCurrentPage(1));
    dispatch(recipeActions.setIsLastPage(false));
    const { sortBy, sortType } = getState().recipe.orderBy;
    const searchResult = getState().recipe.searchResult;
    const dailyLimitIsReached = getState().recipe.dailyLimitIsReached;

    if (!dailyLimitIsReached) {
      const sortedRecipes = sortRecipeCollection(searchResult, {
        sortBy,
        sortType,
      });

      dispatch(recipeActions.setSortedRecipes(sortedRecipes));
      dispatch(splitRecipesPerPage());
    } else {
      const resultsAmount = createRecipeResultsLimit();
      dispatch(getRecipes({ firebaseRef, filter, resultsAmount }));
    }
  };
};

export const recipeActions = recipeSlice.actions;

export default recipeSlice;
