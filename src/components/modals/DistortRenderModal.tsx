import { useState } from "react";
import { fabric } from "fabric";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Slider from "@/components/ui/Slider";
import { useCanvasStore } from "@/store/canvasStore";
import { useLayersStore } from "@/store/layersStore";
import { useNotificationStore } from "@/store/notificationStore";
import { generateClouds, generatePlasma, liquifyImage, pixelate } from "@/utils/distortFilters";

interface DistortRenderModalProps {
  open: boolean;
  onClose: () => void;
}

export default function DistortRenderModal({ open, onClose }: DistortRenderModalProps) {
  const canvas = useCanvasStore((state) => state.canvas);
  const syncFromCanvas = useLayersStore((state) => state.syncFromCanvas);
  const addToast = useNotificationStore((state) => state.addToast);

  const [activeCategory, setActiveCategory] = useState<"distort" | "render">("distort");
  const [filterType, setFilterType] = useState<string>("twirl");
  const [strength, setStrength] = useState<number>(50);
  const [radius, setRadius] = useState<number>(50);

  if (!open) return null;

  const handleApplyFilter = () => {
    if (!canvas) return;

    if (activeCategory === "render") {
      const w = canvas.width || 1000;
      const h = canvas.height || 1000;
      let renderCanvas: HTMLCanvasElement;

      if (filterType === "clouds") {
        renderCanvas = generateClouds(w, h, strength * 2);
      } else {
        renderCanvas = generatePlasma(w, h, strength / 100);
      }

      const imgInstance = new fabric.Image(renderCanvas, {
        left: 0,
        top: 0,
        selectable: true,
      });

      canvas.add(imgInstance);
      canvas.setActiveObject(imgInstance);
      canvas.renderAll();
      syncFromCanvas(canvas);
      addToast(`Rendered ${filterType} layer`, "success");
      onClose();
      return;
    }

    const active = canvas.getActiveObject();
    if (!active || active.type !== "image") {
      addToast("Select an image layer to apply distort filter", "warning");
      return;
    }

    const imgElement = (active as any).getElement?.() || (active as any)._element;
    if (!imgElement) return;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = imgElement.width || 800;
    tempCanvas.height = imgElement.height || 600;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    tempCtx.drawImage(imgElement, 0, 0);

    if (filterType === "pixelate") {
      pixelate(tempCanvas, Math.max(2, Math.round(strength / 5)));
    } else {
      liquifyImage(
        tempCanvas,
        tempCanvas.width / 2,
        tempCanvas.height / 2,
        radius,
        filterType as any,
        strength / 100
      );
    }

    const newSrc = tempCanvas.toDataURL("image/png");
    (active as any).setSrc(newSrc, () => {
      canvas.renderAll();
      syncFromCanvas(canvas);
      addToast(`Applied ${filterType} filter`, "success");
      onClose();
    });
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="🌊 Distort & Render Filters">
      <div className="flex flex-col gap-4 p-4 text-xs text-white max-w-md w-full">
        {/* Category switcher */}
        <div className="flex gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => {
              setActiveCategory("distort");
              setFilterType("twirl");
            }}
            className={`flex-1 py-1.5 rounded font-semibold text-center transition ${
              activeCategory === "distort" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
            }`}
          >
            🌊 Distort Filters
          </button>
          <button
            onClick={() => {
              setActiveCategory("render");
              setFilterType("clouds");
            }}
            className={`flex-1 py-1.5 rounded font-semibold text-center transition ${
              activeCategory === "render" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
            }`}
          >
            ✨ Render Filters
          </button>
        </div>

        {/* Filter Type Selection */}
        <div>
          <label className="block text-slate-300 font-semibold mb-1">Filter Type</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
          >
            {activeCategory === "distort" ? (
              <>
                <option value="twirl">Twirl</option>
                <option value="pinch">Pinch</option>
                <option value="push">Push / Liquify</option>
                <option value="pixelate">Pixelate / Mosaic</option>
              </>
            ) : (
              <>
                <option value="clouds">Perlin Noise Clouds</option>
                <option value="plasma">Plasma Noise</option>
              </>
            )}
          </select>
        </div>

        {/* Sliders */}
        <div className="space-y-3 bg-slate-800 p-3 rounded border border-slate-700">
          <div>
            <label className="block text-slate-400 mb-1">Filter Strength ({strength}%)</label>
            <Slider value={[strength]} onChange={(v) => setStrength(Array.isArray(v) ? v[0] : v)} min={1} max={100} step={1} />
          </div>

          {activeCategory === "distort" && (
            <div>
              <label className="block text-slate-400 mb-1">Displacement Radius ({radius}px)</label>
              <Slider value={[radius]} onChange={(v) => setRadius(Array.isArray(v) ? v[0] : v)} min={10} max={200} step={5} />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleApplyFilter}>
            Apply Filter
          </Button>
        </div>
      </div>
    </Modal>
  );
}
