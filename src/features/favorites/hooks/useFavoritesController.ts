import { useEffect, useRef } from "react";
import {
  useMutation,
  useMutationState,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useDispatch, useSelector, useStore } from "react-redux";
import {
  selectAuthIsLoggedIn,
  selectAuthUserId,
} from "../../auth/store/authSelectors";
import { notificationActions } from "../../notifications/store/notificationSlice";
import { updateFavorite } from "../api/favoritesApi";
import { favoriteKeys } from "../constants/queryKeys";
import {
  FAVORITES_LOAD_ERROR_NOTIFICATION,
  FAVORITES_UPDATE_ERROR_NOTIFICATION,
} from "../constants/messages";
import { favoriteIdsQueryOptions } from "../queries/favoriteIdsQuery";
import type { AppDispatch, RootState } from "../../../app/store";

interface Session {
  active: boolean;
}
interface FavoriteUpdate {
  userId: string;
  recipeId: number;
  wasFavorite: boolean;
  session: Session;
}

/**
 * Owns account-scoped favorite IDs and optimistic membership mutations.
 * Rolls back only the failed recipe, guards against stale account sessions, and
 * clears old account caches on auth changes. Mount once through FavoritesProvider
 * so consumers share effects, pending updates, and notifications.
 */
export const useFavoritesController = () => {
  const isAuthenticated = useSelector(selectAuthIsLoggedIn);
  const authUserId = useSelector(selectAuthUserId);
  const userId = isAuthenticated ? authUserId : "";
  const store = useStore<RootState>();
  const dispatch = useDispatch<AppDispatch>();
  const client = useQueryClient();
  const session = useRef<Session>({ active: true });
  const query = useQuery(favoriteIdsQueryOptions(userId));

  useEffect(() => {
    const currentSession = { active: true };
    session.current = currentSession;
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      const currentUserId = selectAuthIsLoggedIn(state)
        ? selectAuthUserId(state)
        : "";
      if (currentUserId === userId) return;
      currentSession.active = false;
      if (userId) {
        void client.cancelQueries({ queryKey: favoriteKeys.account(userId) });
        client.removeQueries({ queryKey: favoriteKeys.account(userId) });
      }
    });
    return () => {
      currentSession.active = false;
      unsubscribe();
    };
  }, [client, store, userId]);

  useEffect(() => {
    if (userId && query.isError) {
      dispatch(
        notificationActions.showNotification(FAVORITES_LOAD_ERROR_NOTIFICATION),
      );
    }
  }, [dispatch, userId, query.isError, query.errorUpdatedAt]);

  const isCurrent = (update: FavoriteUpdate) =>
    update.session.active &&
    selectAuthIsLoggedIn(store.getState()) &&
    selectAuthUserId(store.getState()) === update.userId;

  const mutation = useMutation({
    mutationKey: favoriteKeys.update(userId),
    retry: false,
    mutationFn: (update: FavoriteUpdate) => {
      if (!isCurrent(update)) throw new Error("Favorites session ended");
      return updateFavorite(
        update.userId,
        update.recipeId,
        !update.wasFavorite,
      );
    },
    onMutate: async (update: FavoriteUpdate) => {
      const queryKey = favoriteKeys.ids(update.userId);
      await client.cancelQueries({ queryKey, exact: true });
      if (!isCurrent(update)) throw new Error("Favorites session ended");
      client.setQueryData<number[]>(queryKey, (ids = []) =>
        update.wasFavorite
          ? ids.filter((id) => id !== update.recipeId)
          : [...ids, update.recipeId],
      );
    },
    onError: (_error, update) => {
      if (!isCurrent(update)) return;
      // Roll back this recipe only, preserving other concurrent updates.
      client.setQueryData<number[]>(favoriteKeys.ids(update.userId), (ids) => {
        if (!ids) return ids;
        return update.wasFavorite
          ? ids.includes(update.recipeId)
            ? ids
            : [...ids, update.recipeId]
          : ids.filter((id) => id !== update.recipeId);
      });
      dispatch(
        notificationActions.showNotification(
          FAVORITES_UPDATE_ERROR_NOTIFICATION,
        ),
      );
    },
    onSettled: (_data, _error, update) => {
      if (!isCurrent(update)) return;
      // The settling mutation is still counted. Refetch only after the last
      // pending write, so a read cannot overwrite another optimistic update.
      if (
        client.isMutating({
          mutationKey: favoriteKeys.update(update.userId),
          predicate: (mutation) =>
            Boolean(
              (mutation.state.variables as FavoriteUpdate)?.session.active,
            ),
        }) === 1
      ) {
        return client.invalidateQueries({
          queryKey: favoriteKeys.ids(update.userId),
          exact: true,
        });
      }
    },
  });
  const pendingIds = useMutationState({
    filters: {
      mutationKey: favoriteKeys.update(userId),
      status: "pending",
      predicate: (mutation) =>
        Boolean((mutation.state.variables as FavoriteUpdate)?.session.active),
    },
    select: (mutation) => (mutation.state.variables as FavoriteUpdate).recipeId,
  });

  const toggleFavorite = (recipeId: number) => {
    if (!userId || selectAuthUserId(store.getState()) !== userId) return;
    const ids = client.getQueryData<number[]>(favoriteKeys.ids(userId));
    if (!ids) {
      if (query.isError) void query.refetch();
      return;
    }
    // Check the mutation cache synchronously, before React has rerendered.
    if (
      client.isMutating({
        mutationKey: favoriteKeys.update(userId),
        predicate: (mutation) => {
          const update = mutation.state.variables as FavoriteUpdate;
          return update?.session.active && update.recipeId === recipeId;
        },
      })
    )
      return;
    mutation.mutate({
      userId,
      recipeId,
      wasFavorite: ids.includes(recipeId),
      session: session.current,
    });
  };

  return {
    favoriteIds: userId ? (query.data ?? []) : [],
    isLoading: Boolean(userId) && query.isPending,
    errorMessage:
      userId && query.isError ? FAVORITES_LOAD_ERROR_NOTIFICATION.message : "",
    pendingIds,
    toggleFavorite,
  };
};
