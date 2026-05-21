import { useCanvasStore } from "@/store/canvasStore";
import { AlignmentDistributionPanel } from "./AlignmentDistributionPanel";

export default function PropertiesPanel() {
  const canvas = useCanvasStore((state) => state.canvas);
  const active = canvas?.getActiveObject() || null;
  const activeObjects = canvas?.getActiveObjects() || [];

  const apply = (payload: Record<string, number | string>) => {
    if (!active || !canvas) return;
    active.set(payload);
    active.setCoords();
    canvas.renderAll();
  };

  return (
    <div className="panel mt-3 rounded-md p-3 space-y-4">
      {/* Single Object Properties */}
      {activeObjects.length === 1 && active && (
        <div>
          <h3 className="mb-2 text-sm font-semibold">Properties</h3>
          <div className="space-y-2 text-xs">
            <label className="flex items-center justify-between">
              X
              <input className="w-24 rounded bg-slate-800 px-1" type="number" value={Math.round(active.left || 0)} onChange={(e) => apply({ left: Number(e.target.value) })} />
            </label>
            <label className="flex items-center justify-between">
              Y
              <input className="w-24 rounded bg-slate-800 px-1" type="number" value={Math.round(active.top || 0)} onChange={(e) => apply({ top: Number(e.target.value) })} />
            </label>
            <label className="flex items-center justify-between">
              Width
              <input className="w-24 rounded bg-slate-800 px-1" type="number" value={Math.round(active.getScaledWidth())} onChange={(e) => apply({ width: Number(e.target.value) })} />
            </label>
            <label className="flex items-center justify-between">
              Height
              <input className="w-24 rounded bg-slate-800 px-1" type="number" value={Math.round(active.getScaledHeight())} onChange={(e) => apply({ height: Number(e.target.value) })} />
            </label>
            <label className="flex items-center justify-between">
              Rotation
              <input className="w-24 rounded bg-slate-800 px-1" type="number" value={Math.round(active.angle || 0)} onChange={(e) => apply({ angle: Number(e.target.value) })} />
            </label>
          </div>
        </div>
      )}

      {/* Multiple Objects - Show Alignment */}
      {activeObjects.length > 1 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold">Arrange {activeObjects.length} Objects</h3>
          <AlignmentDistributionPanel />
        </div>
      )}

      {/* No Selection */}
      {activeObjects.length === 0 && (
        <p className="text-xs text-slate-400">Select an object to edit properties.</p>
      )}
    </div>
  );
}
