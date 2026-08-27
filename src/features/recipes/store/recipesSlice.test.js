import recipeSlice, { recipeActions } from "./recipesSlice";

describe("recipesSlice", () => {
  const reducer = recipeSlice.reducer;

  it("provides the initial recipe state", () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual({
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
    });
  });

  it("updates recipe request state", () => {
    let state = reducer(undefined, recipeActions.setRecipesIsLoading(true));
    state = reducer(state, recipeActions.setCurrentPage(3));
    state = reducer(state, recipeActions.setIsLastPage(true));

    expect(state).toMatchObject({
      recipesIsLoading: true,
      currentPage: 3,
      isLastPage: true,
    });
  });

  it("clears only the currently displayed recipes", () => {
    const state = reducer(
      {
        ...reducer(undefined, { type: "unknown" }),
        searchResult: [{ id: 1 }],
        recipesPerPage: [{ id: 1 }],
      },
      recipeActions.resetRecipes(),
    );

    expect(state.searchResult).toEqual([{ id: 1 }]);
    expect(state.recipesPerPage).toEqual([]);
  });
});
