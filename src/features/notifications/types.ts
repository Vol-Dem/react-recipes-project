export type NotificationSeverity = "status" | "error" | "success";

export interface NotificationPayload {
  title: string;
  message: string;
  severity?: NotificationSeverity;
}

export interface NotificationState {
  isShown: boolean;
  title: string;
  message: string;
  severity: NotificationSeverity;
}
