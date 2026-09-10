import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { fetchRecipesFromApi } from "../api/recipeApi";
import {
  fetchRecipePage,
  type RecipePageCursor,
} from "../api/recipePagination";
import { RECIPE_SEARCH_QUERY_OPTIONS } from "../constants/queries";
import { mapRecipe } from "../utils/mapRecipe";
import type { RecipeSort } from "../types";

/** Caches mapped API search results by request URL; sorting and pagination happen in the client. */
export const recipeSearchQueryOptions = (requestUrl: string) =>
  queryOptions({
    ...RECIPE_SEARCH_QUERY_OPTIONS,
    queryKey: ["recipes", "search", "api", requestUrl],
    queryFn: async ({ signal }) => {
      const response = await fetchRecipesFromApi(requestUrl, signal);
      return (Array.isArray(response) ? response : response.results).map(
        mapRecipe,
      );
    },
  });

/**
 * Creates a browser-only cursor query over the saved recipe collection.
 * The request URL separates cache entries but its search filters are not applied
 * to Firestore. Opaque SDK snapshots must not be server-dehydrated.
 */
export const fallbackRecipeSearchQueryOptions = (
  requestUrl: string,
  order: RecipeSort,
) =>
  infiniteQueryOptions({
    ...RECIPE_SEARCH_QUERY_OPTIONS,
    queryKey: ["recipes", "search", "firestore", requestUrl, order],
    initialPageParam: undefined as RecipePageCursor,
    queryFn: ({ pageParam }) => fetchRecipePage(order, pageParam),
    getNextPageParam: (page) => page.nextCursor,
    // Firestore snapshots are opaque SDK objects. This browser-only query is
    // not suitable for dehydration; preserve snapshots without structural sharing.
    structuralSharing: false,
  });
