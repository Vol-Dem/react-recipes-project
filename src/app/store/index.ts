import {
  configureStore,
  type Action,
  type ThunkAction,
} from "@reduxjs/toolkit";
import authSlice from "../../features/auth/store/authSlice";
import notificationSlice from "../../features/notifications/store/notificationSlice";
import recipeSlice from "../../features/recipes/store/recipesSlice";

/** Creates provider-owned client state. Fetched collections belong in TanStack Query, not Redux. */
export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authSlice.reducer,
      notification: notificationSlice.reducer,
      recipe: recipeSlice.reducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ReturnValue = void> = ThunkAction<
  ReturnValue,
  RootState,
  unknown,
  Action
>;
