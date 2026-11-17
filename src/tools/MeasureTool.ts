import { fabric } from "fabric";
import { BaseTool, disableDrawing, type ToolContext } from "./toolCommon";

export interface MeasureToolOptions {
  unit: "px" | "cm" | "mm" | "in";
  dpi: number;
}

export class MeasureTool extends BaseTool {
  name = "measure";
  cursor = "crosshair";
  isDrawing = false;
  startX = 0;
  startY = 0;
  line: fabric.Line | null = null;

  onMouseDown(e: fabric.IEvent, canvas: fabric.Canvas, _options: MeasureToolOptions) {
    this.isDrawing = true;
    const pointer = canvas.getPointer(e.e);
    this.startX = pointer.x;
    this.startY = pointer.y;
  }

  onMouseMove(e: fabric.IEvent, canvas: fabric.Canvas, _options: MeasureToolOptions) {
    if (!this.isDrawing) return;

    const pointer = canvas.getPointer(e.e);

    if (this.line) {
      canvas.remove(this.line);
    }

    this.line = new fabric.Line(
      [this.startX, this.startY, pointer.x, pointer.y],
      {
        stroke: "#6366F1",
        strokeWidth: 2,
        selectable: false,
      }
    );

    if (this.line) {
      canvas.add(this.line);
      canvas.renderAll();
    }
  }

  onMouseUp() {
    this.isDrawing = false;
  }

  resetCursor() {}
}

export const activateMeasureTool = ({ canvas }: ToolContext): void => {
  disableDrawing(canvas);
  canvas.selection = false;
  canvas.defaultCursor = "crosshair";

  let startX = 0;
  let startY = 0;
  let isMeasuring = false;
  let measureLine: fabric.Line | null = null;

  canvas.off("mouse:down");
  canvas.on("mouse:down", (e) => {
    isMeasuring = true;
    const pointer = canvas.getPointer(e.e);
    startX = pointer.x;
    startY = pointer.y;

    if (measureLine) {
      canvas.remove(measureLine);
      measureLine = null;
    }

    measureLine = new fabric.Line([startX, startY, startX, startY], {
      stroke: "#6366F1",
      strokeWidth: 2,
      strokeDashArray: [4, 4],
      selectable: false,
      evented: false,
      data: { tempToolObject: true },
    });
    canvas.add(measureLine);
  });

  canvas.off("mouse:move");
  canvas.on("mouse:move", (e) => {
    if (!isMeasuring || !measureLine) return;
    const pointer = canvas.getPointer(e.e);
    measureLine.set({ x2: pointer.x, y2: pointer.y });
    canvas.renderAll();
  });

  canvas.off("mouse:up");
  canvas.on("mouse:up", () => {
    isMeasuring = false;
    if (measureLine) {
      setTimeout(() => {
        if (measureLine) {
          canvas.remove(measureLine);
          measureLine = null;
          canvas.renderAll();
        }
      }, 3000);
    }
  });
};
