import { fabric } from "fabric";
import { BaseTool } from "./toolCommon";

export interface BlurToolOptions {
  mode: "blur" | "sharpen" | "smudge";
  strength: number;
  size: number;
}

export class BlurSharpenSmudgeTool extends BaseTool {
  name = "blur-sharpen-smudge";
  cursor = "crosshair";
  isDrawing = false;
  mode: "blur" | "sharpen" | "smudge" = "blur";

  onMouseDown(_e: fabric.IEvent, canvas: fabric.Canvas, options: BlurToolOptions) {
    const activeObj = canvas.getActiveObject();
    if (!activeObj || activeObj.type !== "image") return;

    this.isDrawing = true;
    this.mode = options.mode || "blur";
  }

  onMouseMove(_e: fabric.IEvent, canvas: fabric.Canvas, options: BlurToolOptions) {
    if (!this.isDrawing) return;

    // This would require pixel-level manipulation
    // For now, apply effect via canvas filters
    const activeObj = canvas.getActiveObject() as fabric.Image;
    if (!activeObj) return;

    const strength = (options.strength || 50) / 100;

    switch (this.mode) {
      case "blur":
        activeObj.filters = [new (fabric.Image.filters as any).Blur({ blur: strength * 0.5 })];
        break;
      case "sharpen":
        activeObj.applyFilters();
        canvas.renderAll();
        break;
      case "smudge":
        // Smudge would require complex pixel manipulation
        break;
    }

    activeObj.applyFilters();
    canvas.renderAll();
  }

  onMouseUp() {
    this.isDrawing = false;
  }

  resetCursor() {
    // Nothing needed
  }
}
