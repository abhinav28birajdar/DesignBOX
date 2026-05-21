import { fabric } from "fabric";
import type { ToolContext } from "@/tools/toolCommon";
import { disableDrawing } from "@/tools/toolCommon";

export const activateLassoTool = ({ canvas }: ToolContext): void => {
  disableDrawing(canvas);
  let points: fabric.Point[] = [];
  let line: fabric.Polyline | null = null;

  canvas.off("mouse:down");
  canvas.on("mouse:down", (event) => {
    const pointer = canvas.getPointer(event.e);
    points.push(new fabric.Point(pointer.x, pointer.y));

    if (!line) {
      line = new fabric.Polyline(points, {
        fill: "rgba(99,102,241,0.2)",
        stroke: "#6366f1",
        strokeWidth: 1,
        selectable: false,
        evented: false,
        data: { tempToolObject: true, selectionOverlay: true },
      });
      canvas.add(line);
    } else {
      line.set({ points });
    }

    if (event.e.detail >= 2 && points.length > 2) {
      const polygon = new fabric.Polygon(points as unknown as { x: number; y: number }[]);
      const selected = canvas
        .getObjects()
        .filter((obj) => obj !== line)
        .filter((obj) => polygon.containsPoint(obj.getCenterPoint()));

      if (selected.length === 1) {
        canvas.setActiveObject(selected[0]);
      } else if (selected.length > 1) {
        canvas.setActiveObject(new fabric.ActiveSelection(selected, { canvas }));
      }

      if (line) canvas.remove(line);
      line = null;
      points = [];
    }

    canvas.renderAll();
  });
};
