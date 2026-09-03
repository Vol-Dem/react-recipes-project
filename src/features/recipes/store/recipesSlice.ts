import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RecipeSort, RecipeState, RecipeSummary } from "../types";

const recipeInitialState: RecipeState = {
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
    setSearchResult(state, action: PayloadAction<RecipeSummary[]>) {
      state.searchResult = action.payload;
    },
    setOrderBy(state, action: PayloadAction<RecipeSort>) {
      state.orderBy = action.payload;
    },
    setRecipesIsLoading(state, action: PayloadAction<boolean>) {
      state.recipesIsLoading = action.payload;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    setIsLastPage(state, action: PayloadAction<boolean>) {
      state.isLastPage = action.payload;
    },
    setDailyLimitIsReached(state) {
      state.dailyLimitIsReached = true;
    },
    setTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;
    },
    setOptions(state, action: PayloadAction<string[]>) {
      state.options = action.payload;
    },
    setEmptyMessage(state, action: PayloadAction<string>) {
      state.emptyMessage = action.payload;
    },
    setErrorMessage(state, action: PayloadAction<string>) {
      state.errorMessage = action.payload;
    },
    resetRecipes(state) {
      state.searchResult = [];
    },
  },
});

export const recipeActions = recipeSlice.actions;

export default recipeSlice;
