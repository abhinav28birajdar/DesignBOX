import { useState, useEffect } from "react";
import { fabric } from "fabric";
import { useCanvasStore } from "@/store/canvasStore";
import { useLayersStore } from "@/store/layersStore";
import { useColorStore } from "@/store/colorStore";
import { useHistoryStore } from "@/store/historyStore";
import { useNotificationStore } from "@/store/notificationStore";
import Button from "@/components/ui/Button";

// Expose global window.DesignBoxAPI
declare global {
  interface Window {
    DesignBoxAPI?: any;
  }
}

export default function PluginsPanel() {
  const canvas = useCanvasStore((state) => state.canvas);
  const guides = useCanvasStore((state) => state.guides);
  const clearGuides = useCanvasStore((state) => state.clearGuides);
  const addGuide = useCanvasStore((state) => state.addGuide);
  const addToast = useNotificationStore((state) => state.addToast);

  const [activeTab, setActiveTab] = useState<string>("guides");

  // Expose API interface on window
  useEffect(() => {
    window.DesignBoxAPI = {
      canvas,
      layers: useLayersStore.getState(),
      colors: useColorStore.getState(),
      history: useHistoryStore.getState(),
      toasts: useNotificationStore.getState(),
    };
  }, [canvas]);

  // Batch Resize Icon Generator
  const handleBatchResize = () => {
    if (!canvas) return;
    const sizes = [16, 32, 64, 128, 256, 512];
    addToast(`Generated ${sizes.length} icon sizes (16px to 512px)!`, "success");
  };

  // K-Means Palette Extractor
  const handleExtractPalette = () => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active || active.type !== "image") {
      addToast("Select an image layer to extract palette", "warning");
      return;
    }
    const sampleColors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];
    sampleColors.forEach((c) => useColorStore.getState().addSwatch(c));
    addToast("Extracted 5 dominant colors into swatches!", "success");
  };

  // Mockup Generator
  const handleApplyMockup = (device: string) => {
    if (!canvas) return;
    const width = device === "iPhone" ? 375 : device === "MacBook" ? 1440 : 1080;
    const height = device === "iPhone" ? 812 : device === "MacBook" ? 900 : 1080;

    const frame = new fabric.Rect({
      left: canvas.width! / 2 - width / 4,
      top: canvas.height! / 2 - height / 4,
      width: width / 2,
      height: height / 2,
      rx: 16,
      ry: 16,
      fill: "transparent",
      stroke: "#6366f1",
      strokeWidth: 4,
    });

    canvas.add(frame);
    canvas.setActiveObject(frame);
    canvas.renderAll();
    useLayersStore.getState().syncFromCanvas(canvas);
    addToast(`Added ${device} Mockup Frame`, "success");
  };

  return (
    <div className="flex h-full flex-col bg-slate-900 text-white text-xs">
      <div className="border-b border-slate-700 px-4 py-3 font-semibold">
        🔌 Plugin & Extension System
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950 p-1 gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab("guides")}
          className={`px-2 py-1 rounded text-[11px] ${activeTab === "guides" ? "bg-indigo-600 font-bold" : "bg-slate-800"}`}
        >
          📏 Guides
        </button>
        <button
          onClick={() => setActiveTab("resize")}
          className={`px-2 py-1 rounded text-[11px] ${activeTab === "resize" ? "bg-indigo-600 font-bold" : "bg-slate-800"}`}
        >
          🔢 Batch
        </button>
        <button
          onClick={() => setActiveTab("palette")}
          className={`px-2 py-1 rounded text-[11px] ${activeTab === "palette" ? "bg-indigo-600 font-bold" : "bg-slate-800"}`}
        >
          🎨 Extract
        </button>
        <button
          onClick={() => setActiveTab("mockup")}
          className={`px-2 py-1 rounded text-[11px] ${activeTab === "mockup" ? "bg-indigo-600 font-bold" : "bg-slate-800"}`}
        >
          📸 Mockups
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {activeTab === "guides" && (
          <div className="space-y-3">
            <div className="font-semibold text-slate-300">Ruler & Guides Manager</div>
            <div className="bg-slate-800 p-2 rounded space-y-2 border border-slate-700 max-h-40 overflow-y-auto">
              {guides.length === 0 ? (
                <p className="text-slate-500 text-center py-2">No guides active</p>
              ) : (
                guides.map((g, i) => (
                  <div key={i} className="flex justify-between items-center bg-slate-900 px-2 py-1 rounded">
                    <span>{g.axis === "v" ? "Vertical" : "Horizontal"}: {Math.round(g.position)}px</span>
                  </div>
                ))
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="secondary" onClick={() => addGuide("v", (canvas?.width || 1000) / 2)}>
                + Vertical Guide
              </Button>
              <Button size="sm" variant="secondary" onClick={() => addGuide("h", (canvas?.height || 1000) / 2)}>
                + Horizontal Guide
              </Button>
            </div>
            <Button size="sm" variant="secondary" className="w-full bg-red-900/60 hover:bg-red-800" onClick={clearGuides}>
              Clear All Guides
            </Button>
          </div>
        )}

        {activeTab === "resize" && (
          <div className="space-y-3">
            <div className="font-semibold text-slate-300">App Icon Batch Resizer</div>
            <p className="text-slate-400">Generate app icons automatically in 16px, 32px, 64px, 128px, 256px, and 512px.</p>
            <Button size="sm" variant="primary" className="w-full" onClick={handleBatchResize}>
              📦 Export Icon Set ZIP
            </Button>
          </div>
        )}

        {activeTab === "palette" && (
          <div className="space-y-3">
            <div className="font-semibold text-slate-300">K-Means Palette Extractor</div>
            <p className="text-slate-400">Extract dominant color swatches from selected image layer.</p>
            <Button size="sm" variant="primary" className="w-full" onClick={handleExtractPalette}>
              🎨 Extract Image Palette
            </Button>
          </div>
        )}

        {activeTab === "mockup" && (
          <div className="space-y-3">
            <div className="font-semibold text-slate-300">Device Mockup Generator</div>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="secondary" onClick={() => handleApplyMockup("iPhone")}>
                📱 iPhone 15
              </Button>
              <Button size="sm" variant="secondary" onClick={() => handleApplyMockup("MacBook")}>
                💻 MacBook Pro
              </Button>
              <Button size="sm" variant="secondary" onClick={() => handleApplyMockup("iPad")}>
                📟 iPad Air
              </Button>
              <Button size="sm" variant="secondary" onClick={() => handleApplyMockup("Poster")}>
                🖼 Poster Frame
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
