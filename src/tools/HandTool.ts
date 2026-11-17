import { fabric } from "fabric";
import { BaseTool, disableDrawing, type ToolContext } from "./toolCommon";

export class HandTool extends BaseTool {
  name = "hand";
  cursor = "grab";
  isDrawing = false;
  lastX = 0;
  lastY = 0;

  onMouseDown(e: fabric.IEvent, _canvas: fabric.Canvas, _options: any) {
    this.isDrawing = true;
    const event = e.e as MouseEvent;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
  }

  onMouseMove(e: fabric.IEvent, canvas: fabric.Canvas, _options: any) {
    if (!this.isDrawing) return;
    
    const event = e.e as MouseEvent;
    const deltaX = event.clientX - this.lastX;
    const deltaY = event.clientY - this.lastY;

    const vpt = canvas.viewportTransform;
    if (!vpt) return;

    vpt[4] += deltaX;
    vpt[5] += deltaY;

    canvas.renderAll();

    this.lastX = event.clientX;
    this.lastY = event.clientY;
  }

  onMouseUp() {
    this.isDrawing = false;
  }
}

export const activateHandTool = ({ canvas }: ToolContext): void => {
  disableDrawing(canvas);
  canvas.selection = false;
  canvas.defaultCursor = "grab";
  canvas.discardActiveObject();
  canvas.renderAll();

  let isPanning = false;
  let lastX = 0;
  let lastY = 0;

  canvas.off("mouse:down");
  canvas.on("mouse:down", (e) => {
    isPanning = true;
    canvas.defaultCursor = "grabbing";
    const event = e.e as MouseEvent;
    lastX = event.clientX;
    lastY = event.clientY;
  });

  canvas.off("mouse:move");
  canvas.on("mouse:move", (e) => {
    if (!isPanning) return;
    const event = e.e as MouseEvent;
    const deltaX = event.clientX - lastX;
    const deltaY = event.clientY - lastY;

    const vpt = canvas.viewportTransform;
    if (vpt) {
      vpt[4] += deltaX;
      vpt[5] += deltaY;
      canvas.renderAll();
    }

    lastX = event.clientX;
    lastY = event.clientY;
  });

  canvas.off("mouse:up");
  canvas.on("mouse:up", () => {
    isPanning = false;
    canvas.defaultCursor = "grab";
  });
};
