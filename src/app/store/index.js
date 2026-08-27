import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../../features/auth/store/authSlice";
import favSlice from "../../features/favorites/store/favoritesSlice";
import notificationSlice from "../../features/notifications/store/notificationSlice";
import recipeSlice from "../../features/recipes/store/recipesSlice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    fav: favSlice.reducer,
    notification: notificationSlice.reducer,
    recipe: recipeSlice.reducer,
  },
});

export default store;
