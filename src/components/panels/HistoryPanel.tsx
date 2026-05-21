import { useHistory } from "@/hooks/useHistory";

export default function HistoryPanel() {
  const { past, jumpTo } = useHistory();

  return (
    <div className="panel mt-3 flex h-[28%] flex-col rounded-md p-2">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold">History</h3>
        <span className="mono text-[10px] text-slate-400">{past.length} states</span>
      </div>
      <div className="flex-1 space-y-1 overflow-auto pr-1">
        {past.length === 0 ? (
          <div className="text-xs text-slate-400">No history yet.</div>
        ) : (
          [...past].reverse().map((entry, index) => (
            <button
              key={entry.id}
              className={`w-full rounded px-2 py-1 text-left text-xs ${index === 0 ? "bg-indigo-600/40" : "bg-slate-800 hover:bg-slate-700"}`}
              onClick={() => jumpTo(entry.id)}
            >
              <div className="truncate">{entry.label}</div>
              <div className="mono text-[10px] text-slate-400">{new Date(entry.createdAt).toLocaleTimeString()}</div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
