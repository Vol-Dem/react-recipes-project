import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { NotificationPayload, NotificationState } from "../types";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    isShown: false,
    title: "",
    message: "",
    severity: "status",
  } as NotificationState,
  reducers: {
    showNotification(state, action: PayloadAction<NotificationPayload>) {
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
