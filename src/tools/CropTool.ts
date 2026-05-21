import { fabric } from "fabric";
import type { ToolContext } from "@/tools/toolCommon";
import { disableDrawing } from "@/tools/toolCommon";

export const activateCropTool = ({ canvas, onLayerSync }: ToolContext): void => {
  disableDrawing(canvas);
  let startX = 0;
  let startY = 0;
  let rect: fabric.Rect | null = null;

  canvas.off("mouse:down");
  canvas.on("mouse:down", (event) => {
    const p = canvas.getPointer(event.e);
    startX = p.x;
    startY = p.y;
    rect = new fabric.Rect({
      left: startX,
      top: startY,
      width: 1,
      height: 1,
      fill: "rgba(99,102,241,0.15)",
      stroke: "#6366f1",
      strokeDashArray: [6, 4],
      selectable: false,
      evented: false,
      data: { tempToolObject: true, cropOverlay: true },
    });
    canvas.add(rect);
  });

  canvas.on("mouse:move", (event) => {
    if (!rect) return;
    const p = canvas.getPointer(event.e);
    rect.set({ left: Math.min(startX, p.x), top: Math.min(startY, p.y), width: Math.abs(p.x - startX), height: Math.abs(p.y - startY) });
    canvas.renderAll();
  });

  canvas.on("mouse:up", () => {
    if (!rect) return;

    const cropRect = rect;
    const handler = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key === "Escape") {
        canvas.remove(cropRect);
        rect = null;
        canvas.renderAll();
        window.removeEventListener("keydown", handler);
      }
      if (keyEvent.key === "Enter") {
        const left = cropRect.left ?? 0;
        const top = cropRect.top ?? 0;
        const width = Math.max(1, cropRect.width ?? 1);
        const height = Math.max(1, cropRect.height ?? 1);
        const objects = canvas.getObjects().filter((obj) => obj !== cropRect);
        objects.forEach((obj) => {
          obj.set({ left: (obj.left ?? 0) - left, top: (obj.top ?? 0) - top });
        });
        canvas.setWidth(width);
        canvas.setHeight(height);
        canvas.remove(cropRect);
        canvas.renderAll();
        rect = null;
        onLayerSync();
        window.removeEventListener("keydown", handler);
      }
    };

    window.addEventListener("keydown", handler);
  });
};
