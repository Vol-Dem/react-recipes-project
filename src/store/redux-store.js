import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth";
import favSlice from "./fav";

const store = configureStore({
  reducer: { auth: authSlice.reducer, fav: favSlice.reducer },
});

export default store;
