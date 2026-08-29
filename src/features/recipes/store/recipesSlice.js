import { createSlice } from "@reduxjs/toolkit";

const recipeInitialState = {
  searchResult: [],
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
      state.searchResult = [];
    },
  },
});

export const recipeActions = recipeSlice.actions;

export default recipeSlice;
