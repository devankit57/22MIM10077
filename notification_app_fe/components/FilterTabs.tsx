const FILTERS = ["all", "placement", "result", "event"] as const;

type Props = {
  active: string;
  onChange: (f: string) => void;
};

export default function FilterTabs({ active, onChange }: Props) {
  return (
    <div className="flex gap-1.5 mb-8 p-1 bg-zinc-900/60 rounded-xl border border-zinc-800/60 w-fit">
      {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`
            px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all duration-200
            ${active === f ? "bg-white text-black shadow-md" : "text-zinc-400 hover:text-zinc-200"}
          `}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
