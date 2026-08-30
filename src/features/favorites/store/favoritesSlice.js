import { createSlice } from "@reduxjs/toolkit";

const favoritesSlice = createSlice({
  name: "fav",
  initialState: { favList: [], pendingIds: [] },
  reducers: {
    toggleFavorite(state, action) {
      if (!state.favList.includes(action.payload)) {
        state.favList.push(action.payload);
      } else {
        state.favList = state.favList.filter((id) => id !== action.payload);
      }
    },
    setFavoriteIds(state, action) {
      state.favList = action.payload;
    },
    startFavoriteUpdate(state, action) {
      state.pendingIds.push(action.payload);
    },
    finishFavoriteUpdate(state, action) {
      state.pendingIds = state.pendingIds.filter(
        (recipeId) => recipeId !== action.payload,
      );
    },
    clearFavorites(state) {
      state.favList = [];
      state.pendingIds = [];
    },
  },
});

export const favoritesActions = favoritesSlice.actions;

export default favoritesSlice;
