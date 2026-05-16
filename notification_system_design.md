# Notification System Design

A campus notification system built to deliver placement updates, event alerts, and results to students. This doc covers how it's designed end to end  from API to frontend.

---

## Stage 1 — API Design

Pretty standard REST setup. Four endpoints cover everything needed for the inbox.

```
GET /notifications
```
Fetch all notifications for the logged-in student.

```
GET /notifications?type=placement
```
Filter by type — `placement`, `result`, or `event`.

```
PATCH /notifications/:id/read
```
Mark a single notification as read.

```
POST /notifications
```
Create a new notification (admin/system use).

### Real-Time Strategy

For now, polling via REST keeps things simple. In production, you'd swap this out for WebSockets so students get updates instantly without refreshing.

---

## Stage 2 — Database Design

PostgreSQL made the most sense here. Notifications need filtering by type, sorting by date, and fast reads by student — all things Postgres handles well.

### Schema

```sql
CREATE TABLE notifications (
  id         SERIAL PRIMARY KEY,
  student_id INT,
  type       VARCHAR(20),
  title      TEXT,
  message    TEXT,
  is_read    BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Why not MongoDB?

Notifications are structured, relational data. There's no need for flexible schema here — every row looks the same. Postgres indexing also gives much better performance on filtered queries at scale.

---

## Stage 3 — Query Optimization

Without indexes, fetching unread notifications for a student means a full table scan + sort. That gets bad fast once you're in the millions of rows.

### Composite Index

```sql
CREATE INDEX idx_notifications_student
ON notifications(student_id, is_read, created_at DESC);
```

This covers the three most common query patterns in one shot — filter by student, filter by read status, sort by newest.

### Example — Placement Notifications (Last 7 Days)

```sql
SELECT DISTINCT student_id
FROM notifications
WHERE type = 'placement'
  AND created_at >= NOW() - INTERVAL '7 days';
```

Useful for analytics — e.g. checking which students haven't opened a placement alert recently.

---

## Stage 4 — Performance

A few things that'll matter once traffic picks up:

- **Pagination** — don't load everything at once, use `page` + `limit`
- **Redis caching** — cache the last N notifications per student, invalidate on write
- **Lazy loading** — load older notifications only when the user scrolls
- **WebSockets** — push updates instead of polling

```
GET /notifications?page=1&limit=10
```

Redis TTL of ~60s on notification lists is usually a good starting point. Invalidate the cache whenever a new notification is written or one is marked read.

---

## Stage 5 — Large Scale Delivery

Sending notifications one by one in a loop doesn't work at 10k+ students. You need a queue.

### Stack

- **BullMQ** — job queue built on Redis
- **Redis** — backs the queue
- **Worker processes** — consume jobs in parallel

Each notification is pushed as a job. Workers pick them up, send them, and retry on failure. This also gives you visibility into failed deliveries, which is useful for debugging.

Rough flow:

```
event triggered → job pushed to queue → workers process in parallel → notifications written to DB
```

---

## Stage 6 — Priority Inbox Logic

Not all notifications are equal. A placement drive tomorrow matters more than an event from 3 days ago.

### Priority Order

1. Placement
2. Result
3. Event

### Scoring

Each notification gets a score at query time:

- Unread → higher score
- Newer → higher score
- Type weight → placement > result > event

The inbox sorts descending by score, so the most actionable notifications always surface first.

---

## Stage 7 — Frontend

Built with Next.js, TypeScript, and Tailwind. Nothing fancy dependency-wise.

### Features

- Priority inbox with sorted notifications
- Filter tabs — All / Placement / Result / Event
- Unread indicator bar per card
- Type badges with color coding
- Skeleton loading state
- `timeAgo` formatting — "2h ago" instead of a full timestamp
- Fully responsive

### Component Structure

```
page.tsx               ← state, fetch, layout
components/
  InboxHeader.tsx      ← title + unread count
  FilterTabs.tsx       ← filter buttons
  NotifCard.tsx        ← individual notification card
```

The UI is intentionally minimal — students should be able to scan unread notifications in a few seconds without any friction.
