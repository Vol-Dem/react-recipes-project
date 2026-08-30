export const selectFavoritesState = (state) => state.fav;

export const selectFavoriteIds = (state) =>
  selectFavoritesState(state).favList;
export const selectFavoritePendingIds = (state) =>
  selectFavoritesState(state).pendingIds;

export const selectIsFavorite = (state, recipeId) =>
  selectFavoriteIds(state).includes(recipeId);

export const selectIsFavoriteUpdatePending = (state, recipeId) =>
  selectFavoritePendingIds(state).includes(recipeId);
