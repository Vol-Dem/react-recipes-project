import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import {
  fetchFavoriteRecipePage,
  fetchFavoriteRecipes,
} from "../api/favoriteRecipesApi";
import { FAVORITE_RECIPES_QUERY_OPTIONS } from "../constants/queries";
import type { RecipePageCursor } from "../../recipes/api/recipePagination";
import type { RecipeSort } from "../../recipes/types";

export const favoriteRecipesQueryOptions = (userId: string, ids: number[]) =>
  queryOptions({
    ...FAVORITE_RECIPES_QUERY_OPTIONS,
    queryKey: ["favorites", userId, "recipes", "api", ids],
    queryFn: ({ signal }) => fetchFavoriteRecipes(ids, signal),
  });

export const fallbackFavoriteRecipesQueryOptions = (
  userId: string,
  ids: number[],
  order: RecipeSort,
) =>
  infiniteQueryOptions({
    ...FAVORITE_RECIPES_QUERY_OPTIONS,
    queryKey: ["favorites", userId, "recipes", "firestore", ids, order],
    initialPageParam: undefined as RecipePageCursor,
    queryFn: ({ pageParam }) => fetchFavoriteRecipePage(ids, order, pageParam),
    getNextPageParam: (page) => page.nextCursor,
    // Browser-only Firestore snapshots must not be structurally shared or dehydrated.
    structuralSharing: false,
  });
