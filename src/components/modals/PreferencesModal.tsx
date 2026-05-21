import { useCanvasStore } from "@/store/canvasStore";

interface PreferencesModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PreferencesModal({ open, onClose }: PreferencesModalProps) {
  const gridSize = useCanvasStore((state) => state.gridSize);
  const setGridSize = useCanvasStore((state) => state.setGridSize);
  const snapToGrid = useCanvasStore((state) => state.snapToGrid);
  const snapToGuides = useCanvasStore((state) => state.snapToGuides);
  const toggleSnapToGrid = useCanvasStore((state) => state.toggleSnapToGrid);
  const toggleSnapToGuides = useCanvasStore((state) => state.toggleSnapToGuides);
  const guideSnapThreshold = useCanvasStore((state) => state.guideSnapThreshold);
  const setGuideSnapThreshold = useCanvasStore((state) => state.setGuideSnapThreshold);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
      <div className="panel w-[460px] max-w-[92vw] rounded-md p-4">
        <h2 className="mb-3 text-lg font-semibold">Preferences</h2>
        <div className="space-y-3 text-sm">
          <label className="surface flex items-center justify-between rounded px-3 py-2">
            <span>Grid Size</span>
            <input
              className="w-24 rounded bg-slate-900 px-2 py-1 text-xs"
              type="number"
              min={2}
              max={100}
              value={gridSize}
              onChange={(event) => setGridSize(Number(event.target.value))}
            />
          </label>
          <label className="surface flex items-center justify-between rounded px-3 py-2">
            <span>Snap To Grid</span>
            <input type="checkbox" checked={snapToGrid} onChange={toggleSnapToGrid} />
          </label>
          <label className="surface flex items-center justify-between rounded px-3 py-2">
            <span>Snap To Guides</span>
            <input type="checkbox" checked={snapToGuides} onChange={toggleSnapToGuides} />
          </label>
          <label className="surface flex items-center justify-between rounded px-3 py-2">
            <span>Guide Snap Threshold</span>
            <input
              className="w-24 rounded bg-slate-900 px-2 py-1 text-xs"
              type="number"
              min={1}
              max={25}
              value={guideSnapThreshold}
              onChange={(event) => setGuideSnapThreshold(Number(event.target.value))}
            />
          </label>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button className="rounded bg-slate-700 px-3 py-1" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
