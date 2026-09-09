import { queryOptions } from "@tanstack/react-query";
import { fetchFavoriteIds } from "../api/favoritesApi";
import { FAVORITE_RECIPES_QUERY_OPTIONS } from "../constants/queries";
import { favoriteKeys } from "../constants/queryKeys";

export const favoriteIdsQueryOptions = (userId: string) =>
  queryOptions({
    ...FAVORITE_RECIPES_QUERY_OPTIONS,
    queryKey: favoriteKeys.ids(userId),
    queryFn: async ({ signal }) => {
      const ids = await fetchFavoriteIds(userId);
      // Firestore cannot abort getDoc; discard results after cancellation.
      signal.throwIfAborted();
      return ids;
    },
    enabled: Boolean(userId),
  });
