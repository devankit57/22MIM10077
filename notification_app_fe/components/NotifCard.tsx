import { NotificationItem } from "../../types/notification";

const TYPE_CONFIG = {
  placement: {
    dot: "#22c55e",
    badge: "bg-green-500/10 text-green-400 border border-green-500/20",
  },
  result: {
    dot: "#3b82f6",
    badge: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  },
  event: {
    dot: "#f59e0b",
    badge: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  },
} as const;

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotifCard({ item }: { item: NotificationItem }) {
  const cfg = TYPE_CONFIG[item.type as keyof typeof TYPE_CONFIG];

  return (
    <div
      className={`
        group relative bg-zinc-900/50 border rounded-2xl p-5
        hover:bg-zinc-900 hover:shadow-xl hover:-translate-y-0.5
        transition-all duration-200 cursor-pointer
        ${item.isRead ? "border-zinc-800/50" : "border-zinc-700/70"}
      `}
    >
      {!item.isRead && (
        <span
          className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full"
          style={{ background: cfg?.dot ?? "#fff" }}
        />
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2.5 flex-wrap">
            <span
              className={`
                inline-flex items-center gap-1.5 px-2.5 py-0.5
                rounded-full text-[11px] font-semibold capitalize
                ${cfg?.badge ?? "bg-zinc-700 text-zinc-300"}
              `}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: cfg?.dot ?? "#fff" }}
              />
              {item.type}
            </span>

            {!item.isRead && (
              <span className="text-[11px] text-zinc-500 font-medium">New</span>
            )}
          </div>

          <h2 className="text-base font-semibold text-zinc-100 leading-snug truncate">
            {item.title}
          </h2>

          <p className="text-sm text-zinc-500 mt-1.5 leading-relaxed line-clamp-2">
            {item.message}
          </p>
        </div>

        <span className="text-[11px] text-zinc-600 whitespace-nowrap mt-0.5 shrink-0">
          {timeAgo(item.createdAt)}
        </span>
      </div>
    </div>
  );
}
