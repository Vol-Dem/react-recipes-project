import { where } from "firebase/firestore";
import { fetchRecipesFromApi } from "../../recipes/api/recipeApi";
import { buildFavoriteRecipesUrl } from "../../recipes/api/recipeUrls";
import {
  fetchRecipePage,
  type RecipePageCursor,
} from "../../recipes/api/recipePagination";
import { mapRecipe } from "../../recipes/utils/mapRecipe";
import type { RecipeSort } from "../../recipes/types";

export const fetchFavoriteRecipes = async (
  ids: number[],
  signal?: AbortSignal,
) => {
  if (!ids.length) return [];
  const response = await fetchRecipesFromApi(
    buildFavoriteRecipesUrl(ids),
    signal,
  );
  return (Array.isArray(response) ? response : response.results).map(mapRecipe);
};

export const fetchFavoriteRecipePage = (
  ids: number[],
  order: RecipeSort,
  after?: RecipePageCursor,
) => {
  if (!ids.length) {
    return Promise.resolve({
      recipes: [],
      isLastPage: true,
      nextCursor: undefined,
    });
  }
  return fetchRecipePage(order, after, where("id", "in", ids));
};
