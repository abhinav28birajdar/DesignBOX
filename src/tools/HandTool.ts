import { fabric } from "fabric";
import { BaseTool } from "./toolCommon";

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
