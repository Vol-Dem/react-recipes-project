export const selectRecipeState = (state) => state.recipe;

export const selectRecipeCurrentPage = (state) =>
  selectRecipeState(state).currentPage;
export const selectRecipeDailyLimitIsReached = (state) =>
  selectRecipeState(state).dailyLimitIsReached;
export const selectRecipeEmptyMessage = (state) =>
  selectRecipeState(state).emptyMessage;
export const selectRecipeErrorMessage = (state) =>
  selectRecipeState(state).errorMessage;
export const selectRecipeIsLastPage = (state) =>
  selectRecipeState(state).isLastPage;
export const selectRecipeIsLoading = (state) =>
  selectRecipeState(state).recipesIsLoading;
export const selectRecipeOptions = (state) =>
  selectRecipeState(state).options;
export const selectRecipeOrderBy = (state) =>
  selectRecipeState(state).orderBy;
export const selectRecipesPerPage = (state) =>
  selectRecipeState(state).recipesPerPage;
export const selectRecipeSearchResult = (state) =>
  selectRecipeState(state).searchResult;
export const selectSortedRecipes = (state) =>
  selectRecipeState(state).sortedRecipes;

export const selectHasRecipesPerPage = (state) =>
  selectRecipesPerPage(state).length > 0;
export const selectRecipeOrderValue = (state) =>
  Object.values(selectRecipeOrderBy(state)).join("-");
