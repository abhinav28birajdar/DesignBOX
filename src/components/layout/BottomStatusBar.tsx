import { useCanvasStore } from "@/store/canvasStore";
import { useToolStore } from "@/store/toolStore";
import { useLayersStore } from "@/store/layersStore";
import Slider from "@/components/ui/Slider";

export default function BottomStatusBar() {
  const zoom = useCanvasStore((state) => state.zoom);
  const setZoom = useCanvasStore((state) => state.setZoom);
  const cursor = useCanvasStore((state) => state.cursor);
  const canvas = useCanvasStore((state) => state.canvas);
  const activeTool = useToolStore((state) => state.activeTool);
  const layers = useLayersStore((state) => state.layers);

  const activeObj = canvas?.getActiveObject();
  const objW = activeObj ? Math.round((activeObj.width || 0) * (activeObj.scaleX || 1)) : canvas?.getWidth() || 0;
  const objH = activeObj ? Math.round((activeObj.height || 0) * (activeObj.scaleY || 1)) : canvas?.getHeight() || 0;

  return (
    <div className="panel flex h-8 items-center justify-between px-3 text-xs text-slate-300 border-t border-slate-700 bg-slate-900 select-none">
      {/* Tool & Coords */}
      <div className="flex items-center gap-4">
        <span className="font-semibold text-indigo-300 capitalize">🛠 {activeTool} Tool</span>
        <span>
          X: <strong className="text-white">{cursor.x}</strong> Y: <strong className="text-white">{cursor.y}</strong>
        </span>
        <span>
          W: <strong className="text-white">{objW}</strong> H: <strong className="text-white">{objH}</strong>
        </span>
      </div>

      {/* Layers & Status */}
      <div className="flex items-center gap-4">
        <span>📑 Layers: <strong className="text-white">{layers.length}</strong></span>
        <span>💾 Auto-saved</span>
        <span>⚡ RAM: ~48MB</span>
      </div>

      {/* Zoom Control */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setZoom(100)}
          className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800"
          title="Reset to 100%"
        >
          100%
        </button>
        <span className="w-12 text-right font-mono font-semibold text-indigo-300">{zoom}%</span>
        <div className="w-28">
          <Slider
            value={[zoom]}
            onChange={(val) => setZoom(Array.isArray(val) ? val[0] : val)}
            min={10}
            max={3200}
            step={5}
          />
        </div>
      </div>
    </div>
  );
}
