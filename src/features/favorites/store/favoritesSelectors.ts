import type { RootState } from "../../../app/store";

type FavoritesRootState = Pick<RootState, "fav">;

export const selectFavoritesState = (state: FavoritesRootState) => state.fav;

export const selectFavoriteIds = (state: FavoritesRootState) =>
  selectFavoritesState(state).favList;
export const selectFavoritePendingIds = (state: FavoritesRootState) =>
  selectFavoritesState(state).pendingIds;

export const selectIsFavorite = (state: FavoritesRootState, recipeId: number) =>
  selectFavoriteIds(state).includes(recipeId);

export const selectIsFavoriteUpdatePending = (
  state: FavoritesRootState,
  recipeId: number,
) => selectFavoritePendingIds(state).includes(recipeId);
