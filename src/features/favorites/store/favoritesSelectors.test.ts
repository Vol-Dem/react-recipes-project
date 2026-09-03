import {
  selectFavoriteIds,
  selectFavoritePendingIds,
  selectFavoritesState,
  selectIsFavorite,
  selectIsFavoriteUpdatePending,
} from "./favoritesSelectors";

const favoritesState = {
  favList: [10, 20],
  pendingIds: [20],
};
const state = { fav: favoritesState };

describe("favorites selectors", () => {
  it("selects favorites state and recipe IDs", () => {
    expect(selectFavoritesState(state)).toBe(favoritesState);
    expect(selectFavoriteIds(state)).toBe(favoritesState.favList);
    expect(selectFavoritePendingIds(state)).toBe(favoritesState.pendingIds);
  });

  it("checks whether a recipe is a favorite", () => {
    expect(selectIsFavorite(state, 10)).toBe(true);
    expect(selectIsFavorite(state, 30)).toBe(false);
    expect(selectIsFavoriteUpdatePending(state, 20)).toBe(true);
    expect(selectIsFavoriteUpdatePending(state, 10)).toBe(false);
  });
});
