import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Slider from "@/components/ui/Slider";
import Checkbox from "@/components/ui/Checkbox";
import { useCanvasStore } from "@/store/canvasStore";
import { printCanvas, exportCanvasToPDF, getPrintPreview, PrintSettings } from "@/utils/printSystem";
import { useNotificationStore } from "@/store/notificationStore";

interface PrintModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PrintModal({ open, onClose }: PrintModalProps) {
  const canvas = useCanvasStore((state) => state.canvas);
  const addToast = useNotificationStore((state) => state.addToast);

  const [paperSize, setPaperSize] = useState<PrintSettings["paperSize"]>("A4");
  const [orientation, setOrientation] = useState<PrintSettings["orientation"]>("portrait");
  const [margin, setMargin] = useState(10);
  const [scale, setScale] = useState(1);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [centerOnPage, setCenterOnPage] = useState(true);
  const [bleed, setBleed] = useState(0);
  const [cropMarks, setCropMarks] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    if (!open || !canvas) return;
    const settings: PrintSettings = {
      paperSize,
      orientation,
      margin,
      scale,
      includeMetadata,
      centerOnPage,
    };
    try {
      const url = getPrintPreview(canvas, settings);
      setPreviewUrl(url);
    } catch {
      // preview error fallback
    }
  }, [open, canvas, paperSize, orientation, margin, scale, includeMetadata, centerOnPage]);

  if (!open) return null;

  const handlePrint = () => {
    if (!canvas) return;
    const job = {
      title: "DesignBox Document",
      canvas,
      settings: {
        paperSize,
        orientation,
        margin,
        scale,
        includeMetadata,
        centerOnPage,
      },
      timestamp: new Date(),
    };

    printCanvas(job);
    addToast("Opening print dialog...", "info");
    onClose();
  };

  const handleExportPDF = async () => {
    if (!canvas) return;
    const job = {
      title: "DesignBox Document",
      canvas,
      settings: {
        paperSize,
        orientation,
        margin,
        scale,
        includeMetadata,
        centerOnPage,
      },
      timestamp: new Date(),
    };

    await exportCanvasToPDF(job, "designbox_print.pdf");
    addToast("Exported print PDF!", "success");
    onClose();
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="🖨 Print Document">
      <div className="flex flex-col md:flex-row gap-6 p-4 text-xs text-white max-w-4xl w-full">
        {/* Settings Column */}
        <div className="flex-1 space-y-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Paper Size</label>
            <select
              value={paperSize}
              onChange={(e) => setPaperSize(e.target.value as any)}
              className="w-full rounded bg-slate-800 border border-slate-700 p-2 text-white"
            >
              <option value="A4">A4 (210 x 297 mm)</option>
              <option value="Letter">Letter (8.5 x 11 in)</option>
              <option value="A3">A3 (297 x 420 mm)</option>
              <option value="A5">A5 (148 x 210 mm)</option>
              <option value="Legal">Legal (8.5 x 14 in)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Orientation</label>
            <div className="flex gap-2">
              <button
                onClick={() => setOrientation("portrait")}
                className={`flex-1 p-2 rounded border text-xs font-semibold ${
                  orientation === "portrait"
                    ? "bg-indigo-600 border-indigo-500 text-white"
                    : "bg-slate-800 border-slate-700 text-slate-300"
                }`}
              >
                📱 Portrait
              </button>
              <button
                onClick={() => setOrientation("landscape")}
                className={`flex-1 p-2 rounded border text-xs font-semibold ${
                  orientation === "landscape"
                    ? "bg-indigo-600 border-indigo-500 text-white"
                    : "bg-slate-800 border-slate-700 text-slate-300"
                }`}
              >
                🖥 Landscape
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-slate-300 font-semibold">Margin ({margin} mm)</label>
            </div>
            <Slider value={[margin]} onChange={(v) => setMargin(Array.isArray(v) ? v[0] : v)} min={0} max={50} step={1} />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-slate-300 font-semibold">Scale ({Math.round(scale * 100)}%)</label>
            </div>
            <Slider value={[scale * 100]} onChange={(v) => setScale((Array.isArray(v) ? v[0] : v) / 100)} min={50} max={200} step={5} />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-slate-300 font-semibold">Bleed ({bleed} mm)</label>
            </div>
            <Slider value={[bleed]} onChange={(v) => setBleed(Array.isArray(v) ? v[0] : v)} min={0} max={20} step={1} />
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={centerOnPage} onChange={(e) => setCenterOnPage(e.target.checked)} />
              <span>Center on page</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={includeMetadata} onChange={(e) => setIncludeMetadata(e.target.checked)} />
              <span>Include document metadata</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={cropMarks} onChange={(e) => setCropMarks(e.target.checked)} />
              <span>Show crop marks</span>
            </label>
          </div>
        </div>

        {/* Preview Column */}
        <div className="w-full md:w-64 flex flex-col items-center justify-between bg-slate-950 p-4 rounded border border-slate-800">
          <div className="font-semibold text-slate-400 mb-2">Print Preview</div>
          <div className="flex-1 flex items-center justify-center min-h-48 max-h-64 w-full overflow-hidden bg-slate-900 border border-slate-700 rounded p-2">
            {previewUrl ? (
              <img src={previewUrl} alt="Print Preview" className="max-h-56 max-w-full object-contain shadow" />
            ) : (
              <span className="text-slate-500 text-xs">Preview Loading...</span>
            )}
          </div>

          <div className="flex flex-col gap-2 w-full mt-4">
            <Button variant="primary" onClick={handlePrint} className="w-full">
              🖨 Print Now
            </Button>
            <Button variant="secondary" onClick={handleExportPDF} className="w-full">
              📄 Save as PDF
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
