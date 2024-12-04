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
    setSearchResult(state, actions) {
      state.searchResult = actions.payload;
    },
    setSortedRecipes(state, actions) {
      state.sortedRecipes = actions.payload;
    },
    setRecipesPerPage(state, actions) {
      state.recipesPerPage = actions.payload;
    },
    setOrderBy(state, actions) {
      state.orderBy = actions.payload;
    },
    setRecipesIsLoading(state, actions) {
      state.recipesIsLoading = actions.payload;
    },
    setCurrentPage(state, actions) {
      state.currentPage = actions.payload;
    },
    setIsLastPage(state, actions) {
      state.isLastPage = actions.payload;
    },
    setDailyLimitIsReached(state) {
      state.dailyLimitIsReached = true;
    },
    setTitle(state, actions) {
      state.title = actions.payload;
    },
    setOptions(state, actions) {
      state.options = actions.payload;
    },
    setEmptyMessage(state, actions) {
      state.emptyMessage = actions.payload;
    },
    setErrorMessage(state, actions) {
      state.errorMessage = actions.payload;
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
      const start = (currentPage - 1) * +process.env.REACT_APP_AMOUNT_PER_PAGE;
      const end = currentPage * +process.env.REACT_APP_AMOUNT_PER_PAGE;
      const recipes = sortedRecipes.slice(start, end);
      const amountOfPages = Math.ceil(
        sortedRecipes.length / +process.env.REACT_APP_AMOUNT_PER_PAGE
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
 *Retrive data from recipe object
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
 *Fetch data from firestore
 * @param {Array} queryParameters Array of parameters for firestore query function: firebase reference, filters, resultsAmount etc.
 * Requires firebase reference to be present
 * @param {Object} [position] Result of firestore startAt() or endAt() for firestore query.
 * @returns {Array} Array with fetched data
 */
export const getDataFromFireBase = (queryParameters, position) => {
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
        recipesData.docs.length <= +process.env.REACT_APP_AMOUNT_PER_PAGE;

      const recipes = recipesData.docs.flatMap((entry, i) => {
        const recipe = entry.data();

        if (i === +process.env.REACT_APP_AMOUNT_PER_PAGE) {
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
 * @param {Object} obj.firebaseRef - Reference to firebase
 * @param {Object} [obj.filter] - Result of firestore filter function (where()) for firestore query.
 * @param {Object} [obj.position] - Result of firestore startAt() or endAt() for firestore query.
 * @param {Object} obj.resultsAmount - Result of firestore limit() or limitToLast() function for firestore query. Amount of expected results from firestore
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
          getDataFromFireBase([firebaseRef, filter, resultsAmount], position)
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
    // finally {
    //   dispatch(recipeActions.setRecipesIsLoading(false));
    // }
  };
};

/**
 * Switch to next page.
 * When daily limit is reached dispatch thunk to fetch next portion of data from firestore.
 * @param {Object} firebaseRef- Reference to firebase
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
      const resultsAmount = limit(+process.env.REACT_APP_AMOUNT_PER_PAGE + 1);
      dispatch(getRecipes({ firebaseRef, filter, resultsAmount, position }));
    }
  };
};

/**
 * Switch to previous page.
 * When daily limit is reached dispatch thunk to fetch next portion of data from firestore.
 * @param {Object} firebaseRef- Reference to firebase
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
        +process.env.REACT_APP_AMOUNT_PER_PAGE + 1
      );
      dispatch(getRecipes({ firebaseRef, filter, resultsAmount, position }));
    }
  };
};

/**
 * Sort current recipes data
 * When daily limit is reached dispatch thunk to fetch sorted data from firestore
 * @param {Object} firebaseRef- Reference to firebase
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
      const resultsAmount = limit(+process.env.REACT_APP_AMOUNT_PER_PAGE + 1);
      dispatch(getRecipes({ firebaseRef, filter, resultsAmount }));
    }
  };
};

export const recipeActions = recipeSlice.actions;

export default recipeSlice;
