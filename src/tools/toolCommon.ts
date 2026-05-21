import type { fabric } from "fabric";
import type { ToolOptions } from "@/types";

export interface ToolContext {
  canvas: fabric.Canvas;
  options: ToolOptions;
  foreground: string;
  background: string;
  onLayerSync: () => void;
}

export abstract class BaseTool {
  abstract name: string;
  canvas?: fabric.Canvas;

  registerEvents() {
    // Override in subclasses
  }

  unregisterEvents() {
    // Override in subclasses
  }

  resetCursor() {
    if (this.canvas) {
      this.canvas.defaultCursor = 'default';
    }
  }
}

export const disableDrawing = (canvas: fabric.Canvas): void => {
  canvas.isDrawingMode = false;
  canvas.selection = true;
};

export const clearTemporaryObjects = (canvas: fabric.Canvas): void => {
  const toRemove = canvas
    .getObjects()
    .filter((obj) => Boolean(obj.data && (obj.data.tempToolObject || obj.data.selectionOverlay)));
  toRemove.forEach((obj) => canvas.remove(obj));
};
