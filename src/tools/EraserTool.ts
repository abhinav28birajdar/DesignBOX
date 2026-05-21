import { fabric } from "fabric";
import type { ToolContext } from "@/tools/toolCommon";

export const activateEraserTool = ({ canvas, options, onLayerSync }: ToolContext): void => {
  canvas.discardActiveObject();
  canvas.renderAll();
  canvas.isDrawingMode = true;
  const brush = new fabric.PencilBrush(canvas);
  brush.width = options.brushSize;
  brush.color = "rgba(0,0,0,1)";
  canvas.freeDrawingBrush = brush;
  canvas.selection = false;

  canvas.off("path:created");
  canvas.on("path:created", (event: fabric.IEvent<MouseEvent>) => {
    const path = (event as unknown as { path?: fabric.Path }).path;
    if (!path) return;
    path.set({
      globalCompositeOperation: "destination-out",
      strokeLineCap: "round",
      strokeLineJoin: "round",
      opacity: options.brushOpacity / 100,
      data: { ...(path.data || {}), pathKind: "eraser" },
    });
    canvas.renderAll();
    onLayerSync();
  });
};
