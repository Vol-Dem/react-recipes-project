import recipeSlice, { recipeActions } from "./recipesSlice";

describe("recipesSlice", () => {
  it("stores only the shared API quota flag", () => {
    expect(recipeSlice.reducer(undefined, { type: "unknown" })).toEqual({
      dailyLimitIsReached: false,
    });
  });

  it("activates fallback mode", () => {
    expect(
      recipeSlice.reducer(undefined, recipeActions.setDailyLimitIsReached()),
    ).toEqual({
      dailyLimitIsReached: true,
    });
  });
});
