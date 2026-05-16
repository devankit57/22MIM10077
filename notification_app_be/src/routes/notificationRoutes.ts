import { Router } from "express";

import sortNotifications, {
  NotificationItem
} from "../utils/prioritySort";

const router = Router();

const notifications: NotificationItem[] = [
  {
    id: 1,
    type: "placement",
    title: "Google Hiring Drive",
    message: "Google opened applications",
    isRead: false,
    createdAt: "2026-05-16T10:00:00Z"
  },
  {
    id: 2,
    type: "event",
    title: "Hackathon",
    message: "24 hour hackathon starts tomorrow",
    isRead: true,
    createdAt: "2026-05-15T09:00:00Z"
  },
  {
    id: 3,
    type: "result",
    title: "Mid Sem Result",
    message: "Results published",
    isRead: false,
    createdAt: "2026-05-16T12:00:00Z"
  },
  {
    id: 4,
    type: "placement",
    title: "Amazon Hiring",
    message: "Amazon opened SDE applications",
    isRead: false,
    createdAt: "2026-05-16T14:00:00Z"
  },
  {
    id: 5,
    type: "event",
    title: "Tech Fest",
    message: "Annual tech fest registrations started",
    isRead: false,
    createdAt: "2026-05-14T08:00:00Z"
  }
];

router.get("/", async (_, res) => {

  const sortedData =
    sortNotifications(notifications);

  res.json({
    success: true,
    count: sortedData.length,
    data: sortedData
  });

});

export default router;