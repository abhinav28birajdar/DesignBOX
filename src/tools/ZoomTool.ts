import { fabric } from "fabric";
import { BaseTool } from "./toolCommon";

export class ZoomTool extends BaseTool {
  name = "zoom";
  cursor = "zoom-in";

  onMouseDown(e: fabric.IEvent, canvas: fabric.Canvas, _options: any) {
    const currentZoom = canvas.getZoom();
    const pointer = canvas.getPointer(e.e);

    if ((e.e as MouseEvent).altKey) {
      // Zoom out
      canvas.zoomToPoint(new (fabric.Point as any)(pointer.x, pointer.y), currentZoom * 0.8);
    } else {
      // Zoom in
      canvas.zoomToPoint(new (fabric.Point as any)(pointer.x, pointer.y), currentZoom * 1.2);
    }

    canvas.renderAll();
  }

  onMouseUp() {
    // Nothing needed
  }

  onMouseMove() {
    // Nothing needed
  }

  resetCursor() {
    // Nothing needed
  }
}
