import {
  selectHasRecipesPerPage,
  selectRecipeCurrentPage,
  selectRecipeDailyLimitIsReached,
  selectRecipeEmptyMessage,
  selectRecipeErrorMessage,
  selectRecipeIsLastPage,
  selectRecipeIsLoading,
  selectRecipeOptions,
  selectRecipeOrderBy,
  selectRecipeOrderValue,
  selectRecipesPerPage,
  selectRecipeSearchResult,
  selectRecipeState,
  selectSortedRecipes,
} from "./recipesSelectors";

const recipeState = {
  currentPage: 2,
  dailyLimitIsReached: true,
  emptyMessage: "No recipes",
  errorMessage: "Request failed",
  isLastPage: true,
  options: ["vegan"],
  orderBy: { sortBy: "calories", sortType: "asc" },
  recipesIsLoading: false,
  recipesPerPage: [{ id: 1 }],
  searchResult: [{ id: 1 }, { id: 2 }],
  sortedRecipes: [{ id: 2 }, { id: 1 }],
};
const state = { recipe: recipeState };

describe("recipe selectors", () => {
  it("selects recipe state fields", () => {
    expect(selectRecipeState(state)).toBe(recipeState);
    expect(selectRecipeCurrentPage(state)).toBe(2);
    expect(selectRecipeDailyLimitIsReached(state)).toBe(true);
    expect(selectRecipeEmptyMessage(state)).toBe("No recipes");
    expect(selectRecipeErrorMessage(state)).toBe("Request failed");
    expect(selectRecipeIsLastPage(state)).toBe(true);
    expect(selectRecipeIsLoading(state)).toBe(false);
    expect(selectRecipeOptions(state)).toEqual(["vegan"]);
    expect(selectRecipeOrderBy(state)).toEqual(recipeState.orderBy);
    expect(selectRecipesPerPage(state)).toEqual([{ id: 1 }]);
    expect(selectRecipeSearchResult(state)).toEqual(recipeState.searchResult);
    expect(selectSortedRecipes(state)).toEqual(recipeState.sortedRecipes);
  });

  it("derives recipe collection and order values", () => {
    expect(selectHasRecipesPerPage(state)).toBe(true);
    expect(selectHasRecipesPerPage({
      recipe: { ...recipeState, recipesPerPage: [] },
    })).toBe(false);
    expect(selectRecipeOrderValue(state)).toBe("calories-asc");
  });
});
