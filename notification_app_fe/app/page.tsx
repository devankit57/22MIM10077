"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";
import { NotificationItem } from "../types/notification";
import InboxHeader from "@/components/InboxHeader";
import FilterTabs from "@/components/FilterTabs";
import NotifCard from "@/components/NotifCard";

const TYPE_CONFIG = {
  placement: {
    label: "Placement",
    dot: "#22c55e",
    badge: "bg-green-500/10 text-green-400 border border-green-500/20",
    glow: "hover:shadow-green-500/5",
  },
  result: {
    label: "Result",
    dot: "#3b82f6",
    badge: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    glow: "hover:shadow-blue-500/5",
  },
  event: {
    label: "Event",
    dot: "#f59e0b",
    badge: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    glow: "hover:shadow-amber-500/5",
  },
} as const;

const FILTERS = ["all", "placement", "result", "event"] as const;

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function HomePage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api
      .get("/notifications")
      .then((res) => setNotifications(res.data.data))
      .catch((err) => console.log("failed to fetch", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "all" ? notifications : notifications.filter((n) => n.type === filter);

  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-3xl mx-auto px-5 py-12">
        <InboxHeader count={filtered.length} unread={unread} filter={filter} />
        <FilterTabs active={filter} onChange={setFilter} />

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-2xl bg-zinc-900/60 border border-zinc-800/40 animate-pulse"
                style={{ animationDelay: `${i * 80}ms` }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center text-zinc-600">
            <div className="text-4xl mb-3">—</div>
            <p className="text-sm">Nothing here yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <NotifCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}