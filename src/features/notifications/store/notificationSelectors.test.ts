import {
  selectNotificationIsShown,
  selectNotificationMessage,
  selectNotificationSeverity,
  selectNotificationState,
  selectNotificationTitle,
} from "./notificationSelectors";
import type { NotificationState } from "../types";

const notificationState: NotificationState = {
  isShown: true,
  message: "Search remains available in test mode.",
  severity: "status",
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
    expect(selectNotificationSeverity(state)).toBe("status");
  });
});
