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
import { timeout } from "../variables/utils";
import { TIMEOUT_SEC } from "../variables/constants";
import { notificationActions } from "./notification";

const recipeInitialState = {
  searchResult: [],
  sortedRecipes: [],
  recipesPerPage: [],
  orderBy: [],
  recipesIsLoading: false,
  currentPage: null,
  isLastPage: false,
  dailyLimitIsReached: false,
  title: "",
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

export const setRecipesPerPageFromApi = () => {
  return (dispatch, getState) => {
    const currentPage = getState().recipe.currentPage;
    const sortedRecipes = getState().recipe.sortedRecipes;
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
  };
};

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

export const getRecipesFromFireBase = (firebaseQuery) => {
  return async (dispatch) => {
    try {
      dispatch(recipeActions.setRecipesIsLoading(true));
      const recipesData = await getDocs(firebaseQuery);

      const isLast =
        recipesData.docs.length <= +process.env.REACT_APP_AMOUNT_PER_PAGE;

      const recipes = recipesData.docs.flatMap((entry, i) => {
        const recipe = entry.data();

        if (i === +process.env.REACT_APP_AMOUNT_PER_PAGE) {
          return [];
        }
        return transformRecipe(recipe);
      });

      const lastVisibleRecipe = recipesData.docs[recipesData.docs.length - 1];
      const firstVisibleRecipe = recipesData.docs[0];
      firstVisible = firstVisibleRecipe;
      lastVisible = lastVisibleRecipe;
      dispatch(recipeActions.setRecipesPerPage(recipes));
      dispatch(recipeActions.setIsLastPage(isLast));
      dispatch(recipeActions.setRecipesIsLoading(false));
    } catch (error) {
      dispatch(recipeActions.setRecipesIsLoading(false));
      dispatch(recipeActions.setErrorMessage(error.message));
      console.log(error);
    }
  };
};

export const getRecipes = ({ requestUrl, firebaseRef, filter }) => {
  return async (dispatch, getState) => {
    const dailyLimitIsReached = getState().recipe.dailyLimitIsReached;

    dispatch(recipeActions.setCurrentPage(1));
    dispatch(recipeActions.setIsLastPage(false));
    dispatch(recipeActions.setRecipesIsLoading(true));

    if (!dailyLimitIsReached) {
      try {
        const response = fetch(`${requestUrl}`);
        const res = await Promise.race([response, timeout(TIMEOUT_SEC)]);
        const data = await res.json();

        if (data.code === 402) {
          dispatch(recipeActions.setDailyLimitIsReached(true));
          dispatch(getRecipes({ requestUrl, filter }));
          dispatch(
            notificationActions.showNotification({
              title: "Daily limit of API is over :(",
              message:
                "The application will now enter test mode. Search result will remain the same. You can still use other features!",
            })
          );
          return;
        }

        if (data.status === "failure")
          throw new Error(`${data.message} (${data.code})`);

        const recipesArr = data.results || data;

        const recipes = recipesArr.map((recipe) => {
          return transformRecipe(recipe);
        });

        console.log(recipes);
        dispatch(recipeActions.setSearchResult(recipes));
        dispatch(sortRecipes());
        dispatch(setRecipesPerPageFromApi());
        dispatch(recipeActions.setRecipesIsLoading(false));
      } catch (error) {
        dispatch(recipeActions.setErrorMessage(error.message));
        dispatch(recipeActions.setRecipesIsLoading(false));
        console.log(error.message);
      }
    } else {
      const [sortBy, sortType] = getState().recipe.orderBy;
      const order = sortBy
        ? orderBy(`${sortBy}`, `${sortType}`)
        : orderBy("nutrition");

      const recipeQuery = query(
        firebaseRef,
        filter,
        order,
        limit(+process.env.REACT_APP_AMOUNT_PER_PAGE + 1)
      );

      dispatch(getRecipesFromFireBase(recipeQuery));
    }
  };
};

export const nextPage = (firebaseRef, filter) => {
  return async (dispatch, getState) => {
    const dailyLimitIsReached = getState().recipe.dailyLimitIsReached;
    const currPage = getState().recipe.currentPage + 1;
    dispatch(recipeActions.setCurrentPage(currPage));

    if (!dailyLimitIsReached) {
      dispatch(setRecipesPerPageFromApi());
    } else {
      const [sortBy, sortType] = getState().recipe.orderBy;
      const order = sortBy
        ? orderBy(`${sortBy}`, `${sortType}`)
        : orderBy("nutrition");

      const recipeQuery = query(
        firebaseRef,
        filter,
        order,
        startAt(lastVisible),
        limit(+process.env.REACT_APP_AMOUNT_PER_PAGE + 1)
      );
      dispatch(getRecipesFromFireBase(recipeQuery));
    }
  };
};

export const prevPage = (firebaseRef, filter) => {
  return async (dispatch, getState) => {
    const dailyLimitIsReached = getState().recipe.dailyLimitIsReached;
    const currPage = getState().recipe.currentPage - 1;
    dispatch(recipeActions.setCurrentPage(currPage));

    if (!dailyLimitIsReached) {
      dispatch(setRecipesPerPageFromApi());
      dispatch(recipeActions.setIsLastPage(false));
    } else {
      const [sortBy, sortType] = getState().recipe.orderBy;
      const order = sortBy
        ? orderBy(`${sortBy}`, `${sortType}`)
        : orderBy("nutrition");

      const recipeQuery = query(
        firebaseRef,
        filter,
        order,
        endAt(firstVisible),
        limitToLast(+process.env.REACT_APP_AMOUNT_PER_PAGE + 1)
      );

      dispatch(getRecipesFromFireBase(recipeQuery));
    }
  };
};

export const sortRecipes = (firebaseRef, filter) => {
  return (dispatch, getState) => {
    dispatch(recipeActions.setCurrentPage(1));
    dispatch(recipeActions.setIsLastPage(false));
    const [sortBy, sortType] = getState().recipe.orderBy;
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
      dispatch(setRecipesPerPageFromApi());
    } else {
      dispatch(getRecipes({ firebaseRef, filter }));
    }
  };
};

export const recipeActions = recipeSlice.actions;

export default recipeSlice;
