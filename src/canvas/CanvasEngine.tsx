import { fabric } from "fabric";
import { useEffect, useRef } from "react";
import { useCanvasStore } from "@/store/canvasStore";
import { useToolStore } from "@/store/toolStore";
import { useColorStore } from "@/store/colorStore";
import { useLayersStore } from "@/store/layersStore";
import { useHistory } from "@/hooks/useHistory";
import GridOverlay from "@/canvas/GridOverlay";
import { wireCanvasEvents } from "@/canvas/CanvasEvents";
import { activateMoveTool } from "@/tools/MoveTool";
import { activateSelectTool } from "@/tools/SelectTool";
import { activateLassoTool } from "@/tools/LassoTool";
import { activateMagicWandTool } from "@/tools/MagicWandTool";
import { activateCropTool } from "@/tools/CropTool";
import { activateBrushTool } from "@/tools/BrushTool";
import { activateEraserTool } from "@/tools/EraserTool";
import { activateFillTool } from "@/tools/FillTool";
import { activateEyedropperTool } from "@/tools/EyedropperTool";
import { activateTextTool } from "@/tools/TextTool";
import { activateShapeTool } from "@/tools/ShapeTool";
import { activateCloneTool } from "@/tools/CloneTool";
import { activatePenTool } from "@/tools/PenTool";
import RulerHorizontal from "@/canvas/RulerHorizontal";
import RulerVertical from "@/canvas/RulerVertical";
import GuideOverlay from "@/components/overlays/GuideOverlay";

interface CanvasEngineProps {
  width: number;
  height: number;
}

export default function CanvasEngine({ width, height }: CanvasEngineProps) {
  const hostRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const setCanvas = useCanvasStore((state) => state.setCanvas);
  const setZoom = useCanvasStore((state) => state.setZoom);
  const zoom = useCanvasStore((state) => state.zoom);
  const gridVisible = useCanvasStore((state) => state.gridVisible);
  const gridSize = useCanvasStore((state) => state.gridSize);
  const addGuide = useCanvasStore((state) => state.addGuide);
  const activeTool = useToolStore((state) => state.activeTool);
  const options = useToolStore((state) => state.options);
  const foreground = useColorStore((state) => state.foreground);
  const background = useColorStore((state) => state.background);
  const setForeground = useColorStore((state) => state.setForeground);
  const setBackground = useColorStore((state) => state.setBackground);
  const syncFromCanvas = useLayersStore((state) => state.syncFromCanvas);
  const { snapshot } = useHistory();

  useEffect(() => {
    if (!hostRef.current) return;
    const canvas = new fabric.Canvas(hostRef.current, {
      width,
      height,
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
      stopContextMenu: true,
      selection: true,
    });

    const cleanupEvents = wireCanvasEvents(canvas, () => {
      syncFromCanvas(canvas);
      snapshot("Canvas Change");
    });

    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      const factor = event.deltaY > 0 ? 0.95 : 1.05;
      const point = new fabric.Point(event.offsetX, event.offsetY);
      const next = Math.max(0.1, Math.min(32, canvas.getZoom() * factor));
      canvas.zoomToPoint(point, next);
      setZoom(Math.round(next * 100));
    };

    const el = canvas.getSelectionElement();
    el.addEventListener("wheel", wheel, { passive: false });

    setCanvas(canvas);
    syncFromCanvas(canvas);
    snapshot("Initial");

    return () => {
      el.removeEventListener("wheel", wheel);
      cleanupEvents();
      canvas.dispose();
      setCanvas(null);
    };
  }, [height, setCanvas, setZoom, snapshot, syncFromCanvas, width]);

  const canvas = useCanvasStore((state) => state.canvas);

  useEffect(() => {
    if (!canvas) return;
    const context = { canvas, options, foreground, background, onLayerSync: () => syncFromCanvas(canvas) };

    canvas.off("mouse:down");
    canvas.off("mouse:move");
    canvas.off("mouse:up");
    canvas.off("path:created");

    switch (activeTool) {
      case "move":
        activateMoveTool(context);
        break;
      case "select-rect":
        activateSelectTool(context);
        break;
      case "lasso":
        activateLassoTool(context);
        break;
      case "magic-wand":
        activateMagicWandTool(context);
        break;
      case "crop":
        activateCropTool(context);
        break;
      case "brush":
        activateBrushTool(context);
        break;
      case "eraser":
        activateEraserTool(context);
        break;
      case "fill":
        activateFillTool(context);
        break;
      case "eyedropper":
        activateEyedropperTool(context, (hex, useBg) => {
          if (useBg) setBackground(hex);
          else setForeground(hex);
        });
        break;
      case "text":
        activateTextTool(context);
        break;
      case "shape":
        activateShapeTool(context);
        break;
      case "clone":
        activateCloneTool(context);
        break;
      case "pen":
        activatePenTool(context);
        break;
      default:
        activateMoveTool(context);
    }

    canvas.renderAll();
  }, [activeTool, background, canvas, foreground, options, setBackground, setForeground, syncFromCanvas]);

  useEffect(() => {
    if (!canvas) return;
    canvas.setZoom(zoom / 100);
    canvas.renderAll();
  }, [canvas, zoom]);

  return (
    <div ref={wrapperRef} className="relative flex-1 overflow-hidden bg-[var(--canvas-bg)]">
      <div className="absolute inset-0 overflow-auto">
        <div className="relative mx-auto w-fit pl-6 pt-6">
          <button
            className="absolute left-0 top-0 h-6 w-6 bg-slate-800 text-[10px] text-slate-400 z-10"
            onClick={() => useCanvasStore.getState().clearGuides()}
            title="Clear Guides"
          >
            +
          </button>
          <RulerHorizontal width={width} zoom={zoom} onCreateGuide={(position) => addGuide("v", position)} />
          <RulerVertical height={height} zoom={zoom} onCreateGuide={(position) => addGuide("h", position)} />
          <div className="relative w-fit rounded-md border border-slate-700 bg-slate-900 shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
            <canvas ref={hostRef} width={width} height={height} style={{ display: 'block' }} />
            <GridOverlay visible={gridVisible} gridSize={gridSize} zoom={zoom} />
            <GuideOverlay width={width} height={height} zoom={zoom} />
          </div>
        </div>
      </div>
    </div>
  );
}
