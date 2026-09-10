import { RECIPES_PER_PAGE } from "../../../shared/constants";

/**
 * Slices an in-memory collection using one-based page numbers without mutating it.
 * Callers must supply positive integer page/page-size values and handle empty lists;
 * this helper does not clamp out-of-range pages.
 */
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
