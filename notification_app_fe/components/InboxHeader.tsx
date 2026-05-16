type Props = {
  count: number;
  unread: number;
  filter: string;
};

export default function InboxHeader({ count, unread, filter }: Props) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-1">
        <span className="text-[11px] uppercase tracking-widest text-zinc-500 font-medium">
          VIT Campus
        </span>
        {unread > 0 && (
          <span className="flex items-center gap-1.5 text-[11px] text-red-400">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse inline-block" />
            {unread} unread
          </span>
        )}
      </div>

      <h1 className="text-[2.6rem] font-bold tracking-tight leading-none">
        Priority Inbox
      </h1>

      <p className="text-zinc-500 mt-2 text-sm">
        {count} notification{count !== 1 ? "s" : ""}
        {filter !== "all" && ` in ${filter}`}
      </p>
    </div>
  );
}
