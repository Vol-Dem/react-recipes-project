import {
  selectNotificationIsShown,
  selectNotificationMessage,
  selectNotificationState,
  selectNotificationTitle,
} from "./notificationSelectors";

const notificationState = {
  isShown: true,
  message: "Search remains available in test mode.",
  title: "Daily API limit reached",
};
const state = { notification: notificationState };

describe("notification selectors", () => {
  it("selects notification state fields", () => {
    expect(selectNotificationState(state)).toBe(notificationState);
    expect(selectNotificationIsShown(state)).toBe(true);
    expect(selectNotificationMessage(state)).toBe(
      "Search remains available in test mode.",
    );
    expect(selectNotificationTitle(state)).toBe("Daily API limit reached");
  });
});
