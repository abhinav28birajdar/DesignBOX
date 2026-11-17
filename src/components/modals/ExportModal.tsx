import { useState } from "react";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import { useCanvasStore } from "@/store/canvasStore";

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
}

type ExportFormat = "png" | "jpg" | "webp" | "pdf" | "svg";

export default function ExportModal({ open, onClose }: ExportModalProps) {
  const canvas = useCanvasStore((state) => state.canvas);
  const [format, setFormat] = useState<ExportFormat>("png");
  const [quality, setQuality] = useState(92);
  const [multiplier, setMultiplier] = useState(1);
  const [transparent, setTransparent] = useState(true);
  const [filename, setFilename] = useState("designbox-export");

  const handleExport = async () => {
    if (!canvas) return;

    try {
      if (format === "svg") {
        const svgString = canvas.toSVG();
        const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        saveAs(blob, `${filename}.svg`);
        onClose();
        return;
      }

      if (format === "pdf") {
        const dataURL = canvas.toDataURL({
          format: "png",
          multiplier,
          enableRetinaScaling: false,
        });
        const w = canvas.getWidth() * multiplier;
        const h = canvas.getHeight() * multiplier;
        const orientation = w > h ? "landscape" : "portrait";
        const pdf = new jsPDF({
          orientation,
          unit: "px",
          format: [w, h],
        });
        pdf.addImage(dataURL, "PNG", 0, 0, w, h);
        pdf.save(`${filename}.pdf`);
        onClose();
        return;
      }

      const dataURL = canvas.toDataURL({
        format: format === "jpg" ? "jpeg" : format,
        quality: quality / 100,
        multiplier,
        enableRetinaScaling: false,
      });

      saveAs(dataURL, `${filename}.${format}`);
      onClose();
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed: " + String(error));
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
      <div className="panel w-full max-w-lg rounded-lg p-6 shadow-2xl">
        <h2 className="mb-4 text-xl font-bold">Export</h2>

        <div className="space-y-4 text-sm">
          {/* Format Tabs */}
          <div>
            <label className="mb-2 block text-xs font-semibold">Format</label>
            <div className="grid grid-cols-5 gap-2">
              {(["png", "jpg", "webp", "pdf", "svg"] as ExportFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setFormat(fmt)}
                  className={`rounded px-2 py-1 text-xs font-medium transition ${
                    format === fmt
                      ? "bg-indigo-600 text-white"
                      : "surface"
                  }`}
                >
                  {fmt.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Format-specific options */}
          {format === "jpg" && (
            <div>
              <label className="flex items-center justify-between">
                <span className="text-xs font-semibold">Quality</span>
                <span className="text-xs">{quality}%</span>
              </label>
              <input
                type="range"
                min={1}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full"
              />
            </div>
          )}

          {format === "webp" && (
            <div>
              <label className="flex items-center justify-between">
                <span className="text-xs font-semibold">Quality</span>
                <span className="text-xs">{quality}%</span>
              </label>
              <input
                type="range"
                min={1}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full"
              />
            </div>
          )}

          {format === "png" && (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={transparent}
                onChange={(e) => setTransparent(e.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-xs">Transparent background</span>
            </label>
          )}

          {/* Scale */}
          <div>
            <label className="mb-2 block text-xs font-semibold">Scale</label>
            <select
              value={multiplier}
              onChange={(e) => setMultiplier(Number(e.target.value))}
              className="surface w-full rounded px-2 py-1"
            >
              <option value={0.25}>0.25x</option>
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={3}>3x</option>
              <option value={4}>4x</option>
            </select>
          </div>

          {/* Filename */}
          <div>
            <label className="mb-1 block text-xs font-semibold">Filename</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="export name"
                className="surface flex-1 rounded px-2 py-1 text-xs"
              />
              <span className="surface flex items-center rounded px-2 py-1 text-xs">
                .{format}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded px-4 py-2 text-sm font-medium surface hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="rounded px-4 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
