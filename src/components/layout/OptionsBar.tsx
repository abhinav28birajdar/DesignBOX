import { useToolStore } from "@/store/toolStore";

export default function OptionsBar() {
  const activeTool = useToolStore((state) => state.activeTool);
  const options = useToolStore((state) => state.options);
  const patchOptions = useToolStore((state) => state.patchOptions);

  return (
    <div className="panel flex h-12 items-center gap-4 px-3 text-sm">
      <span className="rounded bg-slate-800 px-2 py-1 capitalize text-slate-200">{activeTool}</span>

      <label className="flex items-center gap-2 text-slate-300">
        Size
        <input
          type="range"
          min={1}
          max={500}
          value={options.brushSize}
          onChange={(e) => patchOptions({ brushSize: Number(e.target.value) })}
        />
        <span>{options.brushSize}</span>
      </label>

      <label className="flex items-center gap-2 text-slate-300">
        Opacity
        <input
          type="range"
          min={1}
          max={100}
          value={options.brushOpacity}
          onChange={(e) => patchOptions({ brushOpacity: Number(e.target.value) })}
        />
        <span>{options.brushOpacity}%</span>
      </label>

      <label className="flex items-center gap-2 text-slate-300">
        Tolerance
        <input
          type="range"
          min={0}
          max={255}
          value={options.tolerance}
          onChange={(e) => patchOptions({ tolerance: Number(e.target.value) })}
        />
        <span>{options.tolerance}</span>
      </label>
    </div>
  );
}
