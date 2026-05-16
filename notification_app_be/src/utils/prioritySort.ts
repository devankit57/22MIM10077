export type NotificationType =
  | "placement"
  | "result"
  | "event";

export interface NotificationItem {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const typeWeight = {
  placement: 30,
  result: 20,
  event: 10
};

const getPriorityScore = (
  notification: NotificationItem
) => {

  let score = 0;

  score += typeWeight[notification.type];

  if (!notification.isRead) {
    score += 40;
  }

  const createdTime = new Date(
    notification.createdAt
  ).getTime();

  const now = Date.now();

  const diffHours =
    (now - createdTime) / (1000 * 60 * 60);

  score += Math.max(0, 24 - diffHours);

  return score;
};

const sortNotifications = (
  notifications: NotificationItem[]
) => {

  return notifications
    .map((item) => ({
      ...item,
      priorityScore: getPriorityScore(item)
    }))
    .sort(
      (a, b) =>
        b.priorityScore - a.priorityScore
    )
    .slice(0, 10);
};

export default sortNotifications;