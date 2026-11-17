import { fabric } from "fabric";
import { BaseTool, disableDrawing, type ToolContext } from "./toolCommon";

export interface HealingBrushOptions {
  size: number;
  strength: number;
  spotMode: boolean;
}

export class HealingBrushTool extends BaseTool {
  name = "healing-brush";
  cursor = "cell";
  isDrawing = false;
  sourceX: number | null = null;
  sourceY: number | null = null;

  onMouseDown(e: fabric.IEvent, canvas: fabric.Canvas, options: HealingBrushOptions) {
    const activeObj = canvas.getActiveObject();
    if (!activeObj || activeObj.type !== "image") return;

    if ((e.e as MouseEvent).altKey) {
      const sourcePointer = canvas.getPointer(e.e);
      this.sourceX = sourcePointer.x;
      this.sourceY = sourcePointer.y;
      return;
    }

    if (!options.spotMode) {
      this.isDrawing = true;
    }
  }

  onMouseMove(_e: fabric.IEvent, canvas: fabric.Canvas, _options: HealingBrushOptions) {
    if (!this.isDrawing) return;
    canvas.renderAll();
  }

  onMouseUp() {
    this.isDrawing = false;
  }

  resetCursor() {}
}

export const activateHealingBrushTool = ({
  canvas,
  options,
  onLayerSync,
}: ToolContext): void => {
  disableDrawing(canvas);
  canvas.selection = false;
  canvas.defaultCursor = "cell";

  let sourceX: number | null = null;
  let sourceY: number | null = null;
  let isHealing = false;

  canvas.off("mouse:down");
  canvas.on("mouse:down", (e) => {
    const pointer = canvas.getPointer(e.e);
    if ((e.e as MouseEvent).altKey) {
      sourceX = pointer.x;
      sourceY = pointer.y;
      return;
    }

    isHealing = true;
    const active = canvas.getActiveObject() as fabric.Image;
    if (active && active.type === "image" && sourceX !== null && sourceY !== null) {
      // Gentle healing blend filter simulation
      active.filters = active.filters || [];
      active.filters.push(new (fabric.Image.filters as any).Convolute({
        matrix: [
          1 / 9, 1 / 9, 1 / 9,
          1 / 9, 1 / 9, 1 / 9,
          1 / 9, 1 / 9, 1 / 9,
        ],
      }));
      active.applyFilters();
      canvas.renderAll();
      onLayerSync();
    }
  });

  canvas.off("mouse:up");
  canvas.on("mouse:up", () => {
    isHealing = false;
  });
};
