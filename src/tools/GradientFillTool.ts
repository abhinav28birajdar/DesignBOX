import { fabric } from "fabric";
import { BaseTool } from "./toolCommon";

export interface GradientFillToolOptions {
  gradientType: "linear" | "radial";
  color1: string;
  color2: string;
  angle: number;
}

export class GradientFillTool extends BaseTool {
  name = "gradient-fill";
  cursor = "crosshair";
  isDrawing = false;
  startX = 0;
  startY = 0;

  onMouseDown(e: fabric.IEvent, canvas: fabric.Canvas, _options: GradientFillToolOptions) {
    this.isDrawing = true;
    const pointer = canvas.getPointer(e.e);
    this.startX = pointer.x;
    this.startY = pointer.y;
  }

  onMouseMove(_e: fabric.IEvent, _canvas: fabric.Canvas, _options: GradientFillToolOptions) {
    if (!this.isDrawing) return;
    // Preview could go here
  }

  onMouseUp(e: fabric.IEvent, canvas: fabric.Canvas, options: GradientFillToolOptions) {
    if (!this.isDrawing) return;
    this.isDrawing = false;

    const pointer = canvas.getPointer(e.e);
    const endX = pointer.x;
    const endY = pointer.y;

    const activeObj = canvas.getActiveObject();
    if (!activeObj) return;

    // Create gradient
    const gradientCoords = options.gradientType === "radial"
      ? {
          x1: this.startX,
          y1: this.startY,
          x2: endX,
          y2: endY,
          r1: 0,
          r2: Math.sqrt(
            (endX - this.startX) ** 2 + (endY - this.startY) ** 2
          ),
        }
      : {
          x1: this.startX,
          y1: this.startY,
          x2: endX,
          y2: endY,
        };

    const gradient = new fabric.Gradient({
      type: options.gradientType as 'linear' | 'radial',
      coords: gradientCoords as any,
      colorStops: [
        { offset: 0, color: options.color1 },
        { offset: 1, color: options.color2 },
      ],
    });

    (activeObj as any).fill = gradient;
    canvas.renderAll();
  }

  resetCursor() {
    // Nothing needed
  }
}
