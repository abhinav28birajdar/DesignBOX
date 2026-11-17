import { fabric } from "fabric";
import { BaseTool, disableDrawing, type ToolContext } from "./toolCommon";

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

    const activeObj = canvas.getActiveObject() as fabric.Image;
    if (!activeObj) return;

    const strength = (options.strength || 50) / 100;

    switch (this.mode) {
      case "blur":
        activeObj.filters = [new (fabric.Image.filters as any).Blur({ blur: strength * 0.5 })];
        break;
      case "sharpen":
        activeObj.filters = [new (fabric.Image.filters as any).Convolute({
          matrix: [
            0, -1, 0,
            -1, 5, -1,
            0, -1, 0,
          ],
        })];
        break;
      case "smudge":
        break;
    }

    activeObj.applyFilters();
    canvas.renderAll();
  }

  onMouseUp() {
    this.isDrawing = false;
  }

  resetCursor() {}
}

export const activateBlurSharpenSmudgeTool = ({
  canvas,
  options,
  onLayerSync,
}: ToolContext): void => {
  disableDrawing(canvas);
  canvas.selection = false;
  canvas.defaultCursor = "crosshair";

  let isDrawing = false;

  canvas.off("mouse:down");
  canvas.on("mouse:down", () => {
    isDrawing = true;
    const activeObj = canvas.getActiveObject() as fabric.Image;
    if (activeObj && activeObj.type === "image") {
      const strength = (options.brushOpacity || 50) / 100;
      activeObj.filters = activeObj.filters || [];
      activeObj.filters.push(new (fabric.Image.filters as any).Blur({ blur: strength * 0.4 }));
      activeObj.applyFilters();
      canvas.renderAll();
      onLayerSync();
    }
  });

  canvas.off("mouse:move");
  canvas.on("mouse:move", () => {
    if (!isDrawing) return;
  });

  canvas.off("mouse:up");
  canvas.on("mouse:up", () => {
    isDrawing = false;
  });
};
