import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: { isShown: false, title: "", message: "" },
  reducers: {
    showNotification(state, actions) {
      state.isShown = true;
      state.title = actions.payload.title;
      state.message = actions.payload.message;
    },
    closeNotification(state) {
      state.isShown = false;
    },
  },
});

export const notificationActions = notificationSlice.actions;

export default notificationSlice;
