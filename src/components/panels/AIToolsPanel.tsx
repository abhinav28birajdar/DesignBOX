import { useState } from "react";
import { useCanvasStore } from "@/store/canvasStore";
import { useLayersStore } from "@/store/layersStore";
import {
  removeBackground,
  autoColorCorrect,
  autoContrast,
  denoise,
  sharpen,
} from "@/utils/aiTools";

export default function AIToolsPanel() {
  const canvas = useCanvasStore((state) => state.canvas);
  const layers = useLayersStore((state) => state.layers);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingText, setProcessingText] = useState("");

  const processImage = async (
    processor: (canvas: HTMLCanvasElement) => HTMLCanvasElement | Promise<HTMLCanvasElement>,
    label: string
  ) => {
    if (!canvas) return;

    const active = canvas.getActiveObject();
    if (!active || active.type !== "image") {
      alert("Select an image layer first");
      return;
    }

    setIsProcessing(true);
    setProcessingText(label);

    try {
      // Get the image element
      const imgElement = (active as any).getElement?.() || (active as any)._element;
      if (!imgElement) {
        alert("Could not access image data");
        return;
      }

      // Create temporary canvas for processing
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = imgElement.width;
      tempCanvas.height = imgElement.height;
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) return;

      tempCtx.drawImage(imgElement, 0, 0);

      // Apply processing
      const processed = await processor(tempCanvas);

      // Update the object with new image
      const newImage = processed.toDataURL("image/png");
      const img = new window.Image();
      img.src = newImage;
      img.onload = () => {
        (active as any).set({ src: newImage });
        canvas.renderAll();
        setIsProcessing(false);
      };
    } catch (error) {
      console.error("Processing error:", error);
      alert("Error processing image");
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-3 text-xs">
      <div>
        <div className="font-semibold text-slate-200 mb-2">🤖 AI Tools</div>
        <p className="text-slate-400 text-[11px]">All processing runs locally in your browser</p>
      </div>

      {/* Image Processing */}
      <div className="space-y-2">
        <div className="font-semibold text-slate-300">Background Removal</div>
        <button
          onClick={() => processImage(removeBackground, "Removing background...")}
          disabled={isProcessing}
          className="w-full rounded bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {isProcessing && processingText === "Removing background..." ? "⏳ Processing..." : "Remove Background"}
        </button>
      </div>

      {/* Color Correction */}
      <div className="space-y-2">
        <div className="font-semibold text-slate-300">Color Correction</div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => processImage(autoColorCorrect, "Correcting colors...")}
            disabled={isProcessing}
            className="rounded bg-slate-700 px-2 py-2 text-white hover:bg-slate-600 disabled:opacity-50 text-[11px]"
          >
            {isProcessing && processingText === "Correcting colors..." ? "..." : "Auto Color"}
          </button>
          <button
            onClick={() => processImage((c) => autoContrast(c, 1.3), "Enhancing contrast...")}
            disabled={isProcessing}
            className="rounded bg-slate-700 px-2 py-2 text-white hover:bg-slate-600 disabled:opacity-50 text-[11px]"
          >
            {isProcessing && processingText === "Enhancing contrast..." ? "..." : "Contrast"}
          </button>
        </div>
      </div>

      {/* Enhancement */}
      <div className="space-y-2">
        <div className="font-semibold text-slate-300">Enhancement</div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => processImage((c) => denoise(c, 3, 10, 0.1), "Denoising...")}
            disabled={isProcessing}
            className="rounded bg-slate-700 px-2 py-2 text-white hover:bg-slate-600 disabled:opacity-50 text-[11px]"
          >
            {isProcessing && processingText === "Denoising..." ? "..." : "Denoise"}
          </button>
          <button
            onClick={() => processImage((c) => sharpen(c, 1.2), "Sharpening...")}
            disabled={isProcessing}
            className="rounded bg-slate-700 px-2 py-2 text-white hover:bg-slate-600 disabled:opacity-50 text-[11px]"
          >
            {isProcessing && processingText === "Sharpening..." ? "..." : "Sharpen"}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-2 rounded bg-slate-900 text-slate-400 text-[11px]">
        <p>• Select an image layer to use AI tools</p>
        <p>• Processing happens locally in your browser</p>
        <p>• No data sent to external servers</p>
      </div>
    </div>
  );
}
