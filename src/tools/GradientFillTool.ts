import { fabric } from "fabric";
import { BaseTool, disableDrawing, type ToolContext } from "./toolCommon";

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

  onMouseMove() {}

  onMouseUp(e: fabric.IEvent, canvas: fabric.Canvas, options: GradientFillToolOptions) {
    if (!this.isDrawing) return;
    this.isDrawing = false;

    const pointer = canvas.getPointer(e.e);
    const endX = pointer.x;
    const endY = pointer.y;

    const gradientCoords =
      options.gradientType === "radial"
        ? {
            x1: this.startX,
            y1: this.startY,
            x2: endX,
            y2: endY,
            r1: 0,
            r2: Math.max(10, Math.sqrt((endX - this.startX) ** 2 + (endY - this.startY) ** 2)),
          }
        : {
            x1: this.startX,
            y1: this.startY,
            x2: endX,
            y2: endY,
          };

    const gradient = new fabric.Gradient({
      type: options.gradientType || "linear",
      coords: gradientCoords as any,
      colorStops: [
        { offset: 0, color: options.color1 || "#6366f1" },
        { offset: 1, color: options.color2 || "#22c55e" },
      ],
    });

    const activeObj = canvas.getActiveObject();
    if (activeObj) {
      (activeObj as any).set("fill", gradient);
    } else {
      (canvas as any).backgroundColor = gradient;
    }
    canvas.renderAll();
  }

  resetCursor() {}
}

export const activateGradientFillTool = ({
  canvas,
  foreground,
  background,
  onLayerSync,
}: ToolContext): void => {
  disableDrawing(canvas);
  canvas.selection = false;
  canvas.defaultCursor = "crosshair";

  let startX = 0;
  let startY = 0;
  let isDragging = false;

  canvas.off("mouse:down");
  canvas.on("mouse:down", (e) => {
    isDragging = true;
    const pointer = canvas.getPointer(e.e);
    startX = pointer.x;
    startY = pointer.y;
  });

  canvas.off("mouse:up");
  canvas.on("mouse:up", (e) => {
    if (!isDragging) return;
    isDragging = false;
    const pointer = canvas.getPointer(e.e);
    const endX = pointer.x;
    const endY = pointer.y;

    const isAlt = (e.e as MouseEvent).altKey;
    const gradientType = isAlt ? "radial" : "linear";

    const coords =
      gradientType === "radial"
        ? {
            x1: startX,
            y1: startY,
            x2: endX,
            y2: endY,
            r1: 0,
            r2: Math.max(10, Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2)),
          }
        : {
            x1: startX,
            y1: startY,
            x2: endX,
            y2: endY,
          };

    const gradient = new fabric.Gradient({
      type: gradientType,
      coords: coords as any,
      colorStops: [
        { offset: 0, color: foreground || "#6366f1" },
        { offset: 1, color: background || "#22c55e" },
      ],
    });

    const activeObj = canvas.getActiveObject();
    if (activeObj) {
      (activeObj as any).set("fill", gradient);
    } else {
      (canvas as any).backgroundColor = gradient;
    }

    canvas.renderAll();
    onLayerSync();
  });
};
