import { fabric } from "fabric";
import { BaseTool } from "./toolCommon";

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

    // Remove previous line
    if (this.line) {
      canvas.remove(this.line);
    }

    // Draw measurement line
    this.line = new (fabric.Line as any)(
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

    // Calculate distance
    const dx = pointer.x - this.startX;
    const dy = pointer.y - this.startY;
    const pixelDistance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    console.log(`Distance: ${pixelDistance.toFixed(2)}px, Angle: ${angle.toFixed(2)}°`);
  }

  onMouseUp() {
    this.isDrawing = false;
  }

  resetCursor() {
    // Nothing needed
  }
}
