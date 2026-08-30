import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: { isShown: false, title: "", message: "", severity: "status" },
  reducers: {
    showNotification(state, action) {
      state.isShown = true;
      state.title = action.payload.title;
      state.message = action.payload.message;
      state.severity = action.payload.severity || "status";
    },
    closeNotification(state) {
      state.isShown = false;
    },
  },
});

export const notificationActions = notificationSlice.actions;

export default notificationSlice;
