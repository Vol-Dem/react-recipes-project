export const selectNotificationState = (state) => state.notification;

export const selectNotificationIsShown = (state) =>
  selectNotificationState(state).isShown;
export const selectNotificationMessage = (state) =>
  selectNotificationState(state).message;
export const selectNotificationTitle = (state) =>
  selectNotificationState(state).title;
export const selectNotificationSeverity = (state) =>
  selectNotificationState(state).severity;
