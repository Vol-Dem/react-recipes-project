export const sortRecipeCollection = (recipes, { sortBy, sortType }) => {
  const direction = sortType === "asc" ? 1 : -1;

  return [...recipes].sort(
    (firstRecipe, secondRecipe) =>
      (firstRecipe[sortBy] - secondRecipe[sortBy]) * direction,
  );
};
