import { fabric } from "fabric";
import { BaseTool, disableDrawing, type ToolContext } from "./toolCommon";
import { useCanvasStore } from "@/store/canvasStore";

export class ZoomTool extends BaseTool {
  name = "zoom";
  cursor = "zoom-in";

  onMouseDown(e: fabric.IEvent, canvas: fabric.Canvas, _options: any) {
    const currentZoom = canvas.getZoom();
    const pointer = canvas.getPointer(e.e);

    if ((e.e as MouseEvent).altKey) {
      canvas.zoomToPoint(new (fabric.Point as any)(pointer.x, pointer.y), Math.max(0.1, currentZoom * 0.8));
    } else {
      canvas.zoomToPoint(new (fabric.Point as any)(pointer.x, pointer.y), Math.min(32, currentZoom * 1.25));
    }

    useCanvasStore.getState().setZoom(Math.round(canvas.getZoom() * 100));
    canvas.renderAll();
  }

  onMouseUp() {}
  onMouseMove() {}
  resetCursor() {}
}

export const activateZoomTool = ({ canvas }: ToolContext): void => {
  disableDrawing(canvas);
  canvas.selection = false;
  canvas.defaultCursor = "zoom-in";

  canvas.off("mouse:down");
  canvas.on("mouse:down", (e) => {
    const currentZoom = canvas.getZoom();
    const pointer = canvas.getPointer(e.e);
    const isAlt = (e.e as MouseEvent).altKey;

    const nextZoom = isAlt
      ? Math.max(0.1, currentZoom * 0.8)
      : Math.min(32, currentZoom * 1.25);

    canvas.zoomToPoint(new fabric.Point(pointer.x, pointer.y), nextZoom);
    useCanvasStore.getState().setZoom(Math.round(canvas.getZoom() * 100));
    canvas.renderAll();
  });
};
