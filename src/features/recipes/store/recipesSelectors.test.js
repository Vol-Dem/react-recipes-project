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

const searchResult = Array.from({ length: 10 }, (_, index) => ({
  calories: 10 - index,
  id: index + 1,
}));
const recipeState = {
  currentPage: 2,
  dailyLimitIsReached: false,
  emptyMessage: "No recipes",
  errorMessage: "Request failed",
  isLastPage: false,
  options: ["vegan"],
  orderBy: { sortBy: "calories", sortType: "asc" },
  recipesIsLoading: false,
  searchResult,
};
const state = { recipe: recipeState };

describe("recipe selectors", () => {
  it("selects recipe state fields", () => {
    expect(selectRecipeState(state)).toBe(recipeState);
    expect(selectRecipeCurrentPage(state)).toBe(2);
    expect(selectRecipeDailyLimitIsReached(state)).toBe(false);
    expect(selectRecipeEmptyMessage(state)).toBe("No recipes");
    expect(selectRecipeErrorMessage(state)).toBe("Request failed");
    expect(selectRecipeIsLoading(state)).toBe(false);
    expect(selectRecipeOptions(state)).toEqual(["vegan"]);
    expect(selectRecipeOrderBy(state)).toEqual(recipeState.orderBy);
    expect(selectRecipeSearchResult(state)).toEqual(recipeState.searchResult);
  });

  it("derives sorted and paginated API recipes", () => {
    expect(selectSortedRecipes(state).map(({ id }) => id)).toEqual([
      10, 9, 8, 7, 6, 5, 4, 3, 2, 1,
    ]);
    expect(selectRecipesPerPage(state).map(({ id }) => id)).toEqual([
      2, 1,
    ]);
    expect(selectRecipeIsLastPage(state)).toBe(true);
    expect(selectHasRecipesPerPage(state)).toBe(true);
    expect(selectRecipeOrderValue(state)).toBe("calories-asc");
  });

  it("uses the fetched page and stored last-page flag in fallback mode", () => {
    const remoteRecipes = [{ id: 1 }, { id: 2 }];
    const remoteState = {
      recipe: {
        ...recipeState,
        dailyLimitIsReached: true,
        isLastPage: true,
        searchResult: remoteRecipes,
      },
    };

    expect(selectSortedRecipes(remoteState)).toBe(remoteRecipes);
    expect(selectRecipesPerPage(remoteState)).toBe(remoteRecipes);
    expect(selectRecipeIsLastPage(remoteState)).toBe(true);
  });

  it("derives an empty collection state", () => {
    const emptyState = {
      recipe: {
        ...recipeState,
        currentPage: 1,
        orderBy: {},
        searchResult: [],
      },
    };

    expect(selectHasRecipesPerPage(emptyState)).toBe(false);
    expect(selectRecipeIsLastPage(emptyState)).toBe(false);
  });
});
