import { fabric } from "fabric";
import type { ToolContext } from "@/tools/toolCommon";
import { disableDrawing } from "@/tools/toolCommon";

export const activateSelectTool = ({ canvas }: ToolContext): void => {
  disableDrawing(canvas);
  canvas.selection = false;
  let startX = 0;
  let startY = 0;
  let marquee: fabric.Rect | null = null;

  canvas.off("mouse:down");
  canvas.on("mouse:down", (event) => {
    const pointer = canvas.getPointer(event.e);
    startX = pointer.x;
    startY = pointer.y;
    marquee = new fabric.Rect({
      left: startX,
      top: startY,
      width: 1,
      height: 1,
      fill: "rgba(99,102,241,0.15)",
      stroke: "#6366f1",
      strokeDashArray: [4, 4],
      selectable: false,
      evented: false,
      data: { tempToolObject: true, selectionOverlay: true },
    });
    canvas.add(marquee);
  });

  canvas.on("mouse:move", (event) => {
    if (!marquee) return;
    const pointer = canvas.getPointer(event.e);
    marquee.set({
      left: Math.min(startX, pointer.x),
      top: Math.min(startY, pointer.y),
      width: Math.abs(pointer.x - startX),
      height: Math.abs(pointer.y - startY),
    });
    canvas.renderAll();
  });

  canvas.on("mouse:up", (event) => {
    if (!marquee) return;
    const bounds = marquee.getBoundingRect();
    const selected = canvas
      .getObjects()
      .filter((obj) => obj !== marquee)
      .filter((obj) => {
        const rect = obj.getBoundingRect();
        return (
          rect.left >= bounds.left &&
          rect.top >= bounds.top &&
          rect.left + rect.width <= bounds.left + bounds.width &&
          rect.top + rect.height <= bounds.top + bounds.height
        );
      });

    const additive = event.e.shiftKey;
    if (!additive) {
      canvas.discardActiveObject();
    }

    if (selected.length === 1) {
      canvas.setActiveObject(selected[0]);
    } else if (selected.length > 1) {
      canvas.setActiveObject(new fabric.ActiveSelection(selected, { canvas }));
    }

    canvas.remove(marquee);
    marquee = null;
    canvas.renderAll();
  });
};
