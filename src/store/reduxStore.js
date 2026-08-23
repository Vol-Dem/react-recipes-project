import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth";
import favSlice from "./fav";
import notificationSlice from "./notification";
import recipeSlice from "./recipe";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    fav: favSlice.reducer,
    notification: notificationSlice.reducer,
    recipe: recipeSlice.reducer,
  },
});

export default store;
