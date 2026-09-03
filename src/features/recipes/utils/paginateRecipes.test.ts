import { paginateRecipes } from "./paginateRecipes";

describe("paginateRecipes", () => {
  const recipes = Array.from({ length: 10 }, (_, id) => ({ id }));

  it("returns one page without mutating the collection", () => {
    const originalRecipes = [...recipes];

    expect(paginateRecipes(recipes, 1, 8)).toEqual({
      recipes: recipes.slice(0, 8),
      isLastPage: false,
    });
    expect(recipes).toEqual(originalRecipes);
  });

  it("identifies the final page", () => {
    expect(paginateRecipes(recipes, 2, 8)).toEqual({
      recipes: recipes.slice(8),
      isLastPage: true,
    });
  });

  it("returns an empty non-final page for an empty collection", () => {
    expect(paginateRecipes([], 1, 8)).toEqual({
      recipes: [],
      isLastPage: false,
    });
  });
});
