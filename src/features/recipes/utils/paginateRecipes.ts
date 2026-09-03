import { RECIPES_PER_PAGE } from "../../../shared/constants";

export const paginateRecipes = <Recipe>(
  recipes: Recipe[],
  currentPage: number,
  pageSize = RECIPES_PER_PAGE,
) => {
  const start = (currentPage - 1) * pageSize;
  const end = currentPage * pageSize;
  const amountOfPages = Math.ceil(recipes.length / pageSize);

  return {
    recipes: recipes.slice(start, end),
    isLastPage: currentPage === amountOfPages,
  };
};
