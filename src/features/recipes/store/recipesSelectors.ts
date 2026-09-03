import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../../app/store";
import { paginateRecipes } from "../utils/paginateRecipes";
import { sortRecipeCollection } from "../utils/sortRecipes";

type RecipeRootState = Pick<RootState, "recipe">;

export const selectRecipeState = (state: RecipeRootState) => state.recipe;

export const selectRecipeCurrentPage = (state: RecipeRootState) =>
  selectRecipeState(state).currentPage;
export const selectRecipeDailyLimitIsReached = (state: RecipeRootState) =>
  selectRecipeState(state).dailyLimitIsReached;
export const selectRecipeEmptyMessage = (state: RecipeRootState) =>
  selectRecipeState(state).emptyMessage;
export const selectRecipeErrorMessage = (state: RecipeRootState) =>
  selectRecipeState(state).errorMessage;
const selectStoredIsLastPage = (state: RecipeRootState) =>
  selectRecipeState(state).isLastPage;
export const selectRecipeIsLoading = (state: RecipeRootState) =>
  selectRecipeState(state).recipesIsLoading;
export const selectRecipeOptions = (state: RecipeRootState) =>
  selectRecipeState(state).options;
export const selectRecipeOrderBy = (state: RecipeRootState) =>
  selectRecipeState(state).orderBy;
export const selectRecipeSearchResult = (state: RecipeRootState) =>
  selectRecipeState(state).searchResult;

export const selectSortedRecipes = createSelector(
  [
    selectRecipeSearchResult,
    selectRecipeOrderBy,
    selectRecipeDailyLimitIsReached,
  ],
  (recipes, orderBy, dailyLimitIsReached) => {
    const { sortBy, sortType } = orderBy;

    if (dailyLimitIsReached || !sortBy || !sortType) {
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

export const selectRecipesPerPage = (state: RecipeRootState) =>
  selectRecipePage(state).recipes;
export const selectRecipeIsLastPage = (state: RecipeRootState) =>
  selectRecipePage(state).isLastPage;

export const selectHasRecipesPerPage = (state: RecipeRootState) =>
  selectRecipesPerPage(state).length > 0;
export const selectRecipeOrderValue = (state: RecipeRootState) =>
  Object.values(selectRecipeOrderBy(state)).join("-");
