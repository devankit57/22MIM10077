export interface NotificationItem {
  id: number;
  type: "placement" | "result" | "event";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  priorityScore?: number;
}