import {
  selectFavoriteIds,
  selectFavoritesState,
  selectIsFavorite,
} from "./favoritesSelectors";

const favoritesState = {
  favList: [10, 20],
  recipes: [],
};
const state = { fav: favoritesState };

describe("favorites selectors", () => {
  it("selects favorites state and recipe IDs", () => {
    expect(selectFavoritesState(state)).toBe(favoritesState);
    expect(selectFavoriteIds(state)).toBe(favoritesState.favList);
  });

  it("checks whether a recipe is a favorite", () => {
    expect(selectIsFavorite(state, 10)).toBe(true);
    expect(selectIsFavorite(state, 30)).toBe(false);
  });
});
