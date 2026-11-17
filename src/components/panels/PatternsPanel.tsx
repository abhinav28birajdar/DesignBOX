import { useState } from "react";
import { fabric } from "fabric";
import { useCanvasStore } from "@/store/canvasStore";
import { useLayersStore } from "@/store/layersStore";
import { PATTERNS, createPattern, Pattern } from "@/utils/patternsLibrary";
import Button from "@/components/ui/Button";
import Slider from "@/components/ui/Slider";

export default function PatternsPanel() {
  const canvas = useCanvasStore((state) => state.canvas);
  const syncFromCanvas = useLayersStore((state) => state.syncFromCanvas);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [scale, setScale] = useState<number>(100);
  const [opacity, setOpacity] = useState<number>(100);

  const filteredPatterns =
    selectedCategory === "all"
      ? PATTERNS
      : PATTERNS.filter((p) => p.category === selectedCategory);

  const handleApplyPattern = (pattern: Pattern) => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) {
      alert("Select an object on canvas to apply pattern");
      return;
    }

    const pat = createPattern(pattern.id, "#1e293b");
    if (pat) {
      active.set("fill", pat as any);
      active.set("opacity", opacity / 100);
      canvas.renderAll();
      syncFromCanvas(canvas);
    }
  };

  return (
    <div className="flex h-full flex-col bg-slate-900 text-white text-xs">
      <div className="border-b border-slate-700 px-4 py-3 font-semibold">
        🎨 Built-in Patterns System ({PATTERNS.length})
      </div>

      {/* Category Selector */}
      <div className="flex gap-1 overflow-x-auto p-2 border-b border-slate-800 bg-slate-950">
        {["all", "geometric", "organic", "fabric"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2 py-1 rounded text-[11px] capitalize ${
              selectedCategory === cat ? "bg-indigo-600 font-bold" : "bg-slate-800 text-slate-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Pattern Grid */}
        <div className="grid grid-cols-3 gap-2">
          {filteredPatterns.map((pat) => (
            <div
              key={pat.id}
              onClick={() => handleApplyPattern(pat)}
              className="group aspect-square rounded border border-slate-700 bg-slate-800 p-2 flex flex-col items-center justify-between cursor-pointer hover:border-indigo-500 hover:bg-slate-750 transition"
              title={pat.name}
            >
              <div className="flex-1 flex items-center justify-center text-lg font-bold text-slate-400">
                🎨
              </div>
              <span className="text-[10px] text-slate-300 truncate w-full text-center">{pat.name}</span>
            </div>
          ))}
        </div>

        {/* Pattern Controls */}
        <div className="bg-slate-800 p-3 rounded border border-slate-700 space-y-3">
          <div>
            <label className="block text-slate-400 mb-1">Pattern Scale ({scale}%)</label>
            <Slider value={[scale]} onChange={(v) => setScale(Array.isArray(v) ? v[0] : v)} min={10} max={300} step={5} />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Fill Opacity ({opacity}%)</label>
            <Slider value={[opacity]} onChange={(v) => setOpacity(Array.isArray(v) ? v[0] : v)} min={10} max={100} step={5} />
          </div>
        </div>
      </div>
    </div>
  );
}
