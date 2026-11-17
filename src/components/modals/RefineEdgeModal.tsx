import { useState } from "react";
import { fabric } from "fabric";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Slider from "@/components/ui/Slider";
import { useCanvasStore } from "@/store/canvasStore";
import { useLayersStore } from "@/store/layersStore";
import { useNotificationStore } from "@/store/notificationStore";

interface RefineEdgeModalProps {
  open: boolean;
  onClose: () => void;
}

export default function RefineEdgeModal({ open, onClose }: RefineEdgeModalProps) {
  const canvas = useCanvasStore((state) => state.canvas);
  const syncFromCanvas = useLayersStore((state) => state.syncFromCanvas);
  const addToast = useNotificationStore((state) => state.addToast);

  const [mode, setMode] = useState<"subject" | "colorRange" | "focusArea">("subject");
  const [smooth, setSmooth] = useState(10);
  const [feather, setFeather] = useState(5);
  const [contrast, setContrast] = useState(0);
  const [shiftEdge, setShiftEdge] = useState(0);
  const [viewMode, setViewMode] = useState<"marching" | "overlay" | "black" | "white">("marching");

  if (!open) return null;

  const handleApplySelection = () => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) {
      addToast("Select an image layer first", "warning");
      return;
    }

    // Clip / mask selection refinement simulation
    const rect = new fabric.Rect({
      left: -active.width! / 2,
      top: -active.height! / 2,
      width: active.width,
      height: active.height,
      rx: feather,
      ry: feather,
      originX: "center",
      originY: "center",
    });

    active.set("clipPath", rect);
    canvas.renderAll();
    syncFromCanvas(canvas);
    addToast(`Applied Refine Edge mask (${mode})!`, "success");
    onClose();
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="🎯 Smart Selection & Refine Edge">
      <div className="flex flex-col gap-4 p-4 text-xs text-white max-w-md w-full">
        {/* Selection mode switch */}
        <div className="flex gap-1 border-b border-slate-800 pb-2">
          <button
            onClick={() => setMode("subject")}
            className={`flex-1 py-1 rounded font-semibold text-center transition ${
              mode === "subject" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
            }`}
          >
            👤 Subject
          </button>
          <button
            onClick={() => setMode("colorRange")}
            className={`flex-1 py-1 rounded font-semibold text-center transition ${
              mode === "colorRange" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
            }`}
          >
            🎨 Color Range
          </button>
          <button
            onClick={() => setMode("focusArea")}
            className={`flex-1 py-1 rounded font-semibold text-center transition ${
              mode === "focusArea" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
            }`}
          >
            🎯 Focus Area
          </button>
        </div>

        {/* View Mode */}
        <div>
          <label className="block text-slate-300 font-semibold mb-1">View Overlay Mode</label>
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as any)}
            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
          >
            <option value="marching">Marching Ants</option>
            <option value="overlay">Red Overlay (Quick Mask)</option>
            <option value="black">On Black</option>
            <option value="white">On White</option>
          </select>
        </div>

        {/* Refine Controls */}
        <div className="space-y-3 bg-slate-800 p-3 rounded border border-slate-700">
          <div>
            <label className="block text-slate-400 mb-1">Feather Edges ({feather}px)</label>
            <Slider value={[feather]} onChange={(v) => setFeather(Array.isArray(v) ? v[0] : v)} min={0} max={50} step={1} />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Smooth ({smooth})</label>
            <Slider value={[smooth]} onChange={(v) => setSmooth(Array.isArray(v) ? v[0] : v)} min={0} max={100} step={5} />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Contrast ({contrast}%)</label>
            <Slider value={[contrast]} onChange={(v) => setContrast(Array.isArray(v) ? v[0] : v)} min={0} max={100} step={5} />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Shift Edge ({shiftEdge}%)</label>
            <Slider value={[shiftEdge]} onChange={(v) => setShiftEdge(Array.isArray(v) ? v[0] : v)} min={-100} max={100} step={5} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleApplySelection}>
            Create Mask / Selection
          </Button>
        </div>
      </div>
    </Modal>
  );
}
