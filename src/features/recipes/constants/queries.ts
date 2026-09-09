export const RECIPE_DETAILS_STALE_TIME_MS = 5 * 60 * 1000;
export const RECIPE_DETAILS_GC_TIME_MS = 30 * 60 * 1000;

export const RECIPE_SEARCH_STALE_TIME_MS = 5 * 60 * 1000;
export const RECIPE_SEARCH_GC_TIME_MS = 30 * 60 * 1000;

export const RECIPE_SEARCH_QUERY_OPTIONS = {
  staleTime: RECIPE_SEARCH_STALE_TIME_MS,
  gcTime: RECIPE_SEARCH_GC_TIME_MS,
  retry: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
};
