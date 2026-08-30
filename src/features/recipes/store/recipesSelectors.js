import { createSelector } from "@reduxjs/toolkit";
import { paginateRecipes } from "../utils/paginateRecipes";
import { sortRecipeCollection } from "../utils/sortRecipes";

export const selectRecipeState = (state) => state.recipe;

export const selectRecipeCurrentPage = (state) =>
  selectRecipeState(state).currentPage;
export const selectRecipeDailyLimitIsReached = (state) =>
  selectRecipeState(state).dailyLimitIsReached;
export const selectRecipeEmptyMessage = (state) =>
  selectRecipeState(state).emptyMessage;
export const selectRecipeErrorMessage = (state) =>
  selectRecipeState(state).errorMessage;
const selectStoredIsLastPage = (state) => selectRecipeState(state).isLastPage;
export const selectRecipeIsLoading = (state) =>
  selectRecipeState(state).recipesIsLoading;
export const selectRecipeOptions = (state) => selectRecipeState(state).options;
export const selectRecipeOrderBy = (state) => selectRecipeState(state).orderBy;
export const selectRecipeSearchResult = (state) =>
  selectRecipeState(state).searchResult;

export const selectSortedRecipes = createSelector(
  [
    selectRecipeSearchResult,
    selectRecipeOrderBy,
    selectRecipeDailyLimitIsReached,
  ],
  (recipes, orderBy, dailyLimitIsReached) => {
    const { sortBy, sortType } = orderBy;

    if (dailyLimitIsReached || !sortBy) {
      return recipes;
    }

    return sortRecipeCollection(recipes, { sortBy, sortType });
  },
);

const selectRecipePage = createSelector(
  [
    selectSortedRecipes,
    selectRecipeCurrentPage,
    selectRecipeDailyLimitIsReached,
    selectStoredIsLastPage,
  ],
  (recipes, currentPage, dailyLimitIsReached, storedIsLastPage) => {
    if (dailyLimitIsReached) {
      return { recipes, isLastPage: storedIsLastPage };
    }

    return paginateRecipes(recipes, currentPage);
  },
);

export const selectRecipesPerPage = (state) => selectRecipePage(state).recipes;
export const selectRecipeIsLastPage = (state) =>
  selectRecipePage(state).isLastPage;

export const selectHasRecipesPerPage = (state) =>
  selectRecipesPerPage(state).length > 0;
export const selectRecipeOrderValue = (state) =>
  Object.values(selectRecipeOrderBy(state)).join("-");
