import { createSlice } from "@reduxjs/toolkit";
import type { RecipeState } from "../types";

const recipeInitialState: RecipeState = { dailyLimitIsReached: false };

const recipeSlice = createSlice({
  name: "recipe",
  initialState: recipeInitialState,
  reducers: {
    setDailyLimitIsReached(state) {
      state.dailyLimitIsReached = true;
    },
  },
});

export const recipeActions = recipeSlice.actions;
export default recipeSlice;
