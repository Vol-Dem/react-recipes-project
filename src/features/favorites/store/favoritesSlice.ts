import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface FavoritesState {
  favList: number[];
  pendingIds: number[];
}

const favoritesSlice = createSlice({
  name: "fav",
  initialState: { favList: [], pendingIds: [] } as FavoritesState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<number>) {
      if (!state.favList.includes(action.payload)) {
        state.favList.push(action.payload);
      } else {
        state.favList = state.favList.filter((id) => id !== action.payload);
      }
    },
    setFavoriteIds(state, action: PayloadAction<number[]>) {
      state.favList = action.payload;
    },
    startFavoriteUpdate(state, action: PayloadAction<number>) {
      state.pendingIds.push(action.payload);
    },
    finishFavoriteUpdate(state, action: PayloadAction<number>) {
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
