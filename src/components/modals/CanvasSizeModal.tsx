import { useState } from "react";
import { useCanvasStore } from "@/store/canvasStore";
import { useProjectStore } from "@/store/projectStore";

interface CanvasSizeModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CanvasSizeModal({ open, onClose }: CanvasSizeModalProps) {
  const canvas = useCanvasStore((state) => state.canvas);
  const activeTabId = useProjectStore((state) => state.activeTabId);
  const tabs = useProjectStore((state) => state.tabs);
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  const currentW = activeTab?.width || (canvas ? canvas.getWidth() : 1920);
  const currentH = activeTab?.height || (canvas ? canvas.getHeight() : 1080);

  const [width, setWidth] = useState(currentW);
  const [height, setHeight] = useState(currentH);
  const [lockRatio, setLockRatio] = useState(false);

  if (!open) return null;

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockRatio && currentW > 0) {
      setHeight(Math.round((val / currentW) * currentH));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockRatio && currentH > 0) {
      setWidth(Math.round((val / currentH) * currentW));
    }
  };

  const handleApply = () => {
    if (!canvas || width <= 0 || height <= 0) return;
    canvas.setWidth(width);
    canvas.setHeight(height);
    canvas.renderAll();

    // Update tab
    if (activeTabId) {
      const tab = tabs.find((t) => t.id === activeTabId);
      if (tab) {
        tab.width = width;
        tab.height = height;
        tab.modified = true;
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4">
      <div className="panel w-full max-w-sm rounded-xl p-5 bg-[#111827] border border-[#2D3748] shadow-2xl text-slate-200">
        <h3 className="text-base font-bold text-white mb-4">Canvas Size</h3>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Current Size</label>
            <p className="font-mono text-indigo-300">{currentW} × {currentH} px</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">New Width (px)</label>
              <input
                type="number"
                min={50}
                max={10000}
                value={width}
                onChange={(e) => handleWidthChange(Number(e.target.value))}
                className="w-full rounded bg-slate-900 border border-slate-700 px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">New Height (px)</label>
              <input
                type="number"
                min={50}
                max={10000}
                value={height}
                onChange={(e) => handleHeightChange(Number(e.target.value))}
                className="w-full rounded bg-slate-900 border border-slate-700 px-2.5 py-1.5 text-xs text-white"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={lockRatio}
              onChange={(e) => setLockRatio(e.target.checked)}
              className="rounded accent-indigo-500"
            />
            <span className="text-slate-300">Lock Aspect Ratio</span>
          </label>
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="rounded px-3 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-1.5 text-xs transition shadow-md shadow-indigo-600/30"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
