import type { RootState } from "../../../app/store";

type NotificationRootState = Pick<RootState, "notification">;

export const selectNotificationState = (state: NotificationRootState) =>
  state.notification;

export const selectNotificationIsShown = (state: NotificationRootState) =>
  selectNotificationState(state).isShown;
export const selectNotificationMessage = (state: NotificationRootState) =>
  selectNotificationState(state).message;
export const selectNotificationTitle = (state: NotificationRootState) =>
  selectNotificationState(state).title;
export const selectNotificationSeverity = (state: NotificationRootState) =>
  selectNotificationState(state).severity;
