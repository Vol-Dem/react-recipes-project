import { createSlice } from "@reduxjs/toolkit";
import {
  endAt,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  startAt,
} from "firebase/firestore";
import { notificationActions } from "./notification";
import axios from "axios";

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

let firstVisible;
let lastVisible;

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
      const start = (currentPage - 1) * +import.meta.env.VITE_AMOUNT_PER_PAGE;
      const end = currentPage * +import.meta.env.VITE_AMOUNT_PER_PAGE;
      const recipes = sortedRecipes.slice(start, end);
      const amountOfPages = Math.ceil(
        sortedRecipes.length / +import.meta.env.VITE_AMOUNT_PER_PAGE
      );

      dispatch(recipeActions.setRecipesPerPage(recipes));
      if (currentPage === amountOfPages) {
        dispatch(recipeActions.setIsLastPage(true));
      }
    } else {
      dispatch(recipeActions.setRecipesPerPage(sortedRecipes));
    }
  };
};

/**
 * Retrieves data from a recipe object.
 * @param {Object} recipe Recipe data to transform
 * @returns {Object} Transformed data (recipe)
 */
const transformRecipe = (recipe) => {
  return {
    id: recipe.id,
    title: recipe.title,
    img: recipe.image,
    readyInMinutes: recipe.readyInMinutes,
    calories: recipe.nutrition.nutrients.find(({ name }) => name === "Calories")
      .amount,
    servings: recipe.servings,
  };
};

/**
 * Fetches data from Firestore.
 * @param {Array} queryParameters Array of parameters for the Firestore query function: Firebase reference, filters, resultsAmount, etc.
 * Requires a Firebase reference to be present.
 * @param {Object} [position] Result of Firestore startAt() or endAt() for the Firestore query.
 * @returns {Array} Array with fetched data
 */
export const getDataFromFirebase = (queryParameters, position) => {
  return async (dispatch, getState) => {
    try {
      const { sortBy, sortType } = getState().recipe.orderBy;
      const order = sortBy
        ? orderBy(`${sortBy}`, `${sortType}`)
        : orderBy("nutrition");

      let firebaseQuery;
      if (position) {
        firebaseQuery = query(...queryParameters, order, position);
      } else {
        firebaseQuery = query(...queryParameters, order);
      }

      const recipesData = await getDocs(firebaseQuery);

      const isLast =
        recipesData.docs.length <= +import.meta.env.VITE_AMOUNT_PER_PAGE;

      const recipes = recipesData.docs.flatMap((entry, i) => {
        const recipe = entry.data();

        if (i === +import.meta.env.VITE_AMOUNT_PER_PAGE) {
          return [];
        }
        return recipe;
      });

      const lastVisibleRecipe = recipesData.docs[recipesData.docs.length - 1];
      const firstVisibleRecipe = recipesData.docs[0];
      firstVisible = firstVisibleRecipe;
      lastVisible = lastVisibleRecipe;
      dispatch(recipeActions.setIsLastPage(isLast));
      return recipes;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  };
};

/**
 *Fetch data from API
 * @param {string} requestUrl The URL for API with parameters
 * @returns {Array} Array with fetched data
 */
export const getDataFromApi = async (requestUrl) => {
  try {
    const response = await axios.get(requestUrl);
    const data = response.data;

    return data;
  } catch (error) {
    throw new Error(error);
  }
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
        searchResult = await getDataFromApi(requestUrl);
      } else {
        searchResult = await dispatch(
          getDataFromFirebase([firebaseRef, filter, resultsAmount], position)
        );
      }
      const recipesArr = searchResult.results || searchResult;
      const recipes = recipesArr.map((recipe) => transformRecipe(recipe));

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
      const position = startAt(lastVisible);
      const resultsAmount = limit(+import.meta.env.VITE_AMOUNT_PER_PAGE + 1);
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
      const position = endAt(firstVisible);
      const resultsAmount = limitToLast(
        +import.meta.env.VITE_AMOUNT_PER_PAGE + 1
      );
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
      const sortedRecipes = searchResult.slice().sort((a, b) => {
        if (sortType === "asc") {
          return a[sortBy] - b[sortBy];
        }
        if (sortType === "desc") {
          return b[sortBy] - a[sortBy];
        }
        return true;
      });

      dispatch(recipeActions.setSortedRecipes(sortedRecipes));
      dispatch(splitRecipesPerPage());
    } else {
      const resultsAmount = limit(+import.meta.env.VITE_AMOUNT_PER_PAGE + 1);
      dispatch(getRecipes({ firebaseRef, filter, resultsAmount }));
    }
  };
};

export const recipeActions = recipeSlice.actions;

export default recipeSlice;
