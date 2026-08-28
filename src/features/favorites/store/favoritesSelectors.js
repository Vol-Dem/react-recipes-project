export const selectFavoritesState = (state) => state.fav;

export const selectFavoriteIds = (state) =>
  selectFavoritesState(state).favList;

export const selectIsFavorite = (state, recipeId) =>
  selectFavoriteIds(state).includes(recipeId);
