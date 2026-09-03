import { sortRecipeCollection } from "./sortRecipes";

describe("sortRecipeCollection", () => {
  const recipes = [
    { id: 1, calories: 450 },
    { id: 2, calories: 200 },
    { id: 3, calories: 325 },
  ];

  it("sorts recipe values in ascending order", () => {
    expect(
      sortRecipeCollection(recipes, {
        sortBy: "calories",
        sortType: "asc",
      }).map(({ id }) => id),
    ).toEqual([2, 3, 1]);
  });

  it("sorts recipe values in descending order", () => {
    expect(
      sortRecipeCollection(recipes, {
        sortBy: "calories",
        sortType: "desc",
      }).map(({ id }) => id),
    ).toEqual([1, 3, 2]);
  });

  it("does not mutate the original collection", () => {
    const originalRecipes = [...recipes];

    sortRecipeCollection(recipes, {
      sortBy: "calories",
      sortType: "asc",
    });

    expect(recipes).toEqual(originalRecipes);
  });
});
