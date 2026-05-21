import { fabric } from "fabric";
import type { ToolContext } from "@/tools/toolCommon";
import { disableDrawing } from "@/tools/toolCommon";

export const activatePenTool = ({ canvas, foreground, options, onLayerSync }: ToolContext): void => {
  disableDrawing(canvas);
  let points: { x: number; y: number }[] = [];
  let preview: fabric.Polyline | null = null;

  const reset = () => {
    if (preview) canvas.remove(preview);
    preview = null;
    points = [];
  };

  canvas.off("mouse:down");
  canvas.on("mouse:down", (event) => {
    const p = canvas.getPointer(event.e);
    points.push({ x: p.x, y: p.y });

    if (!preview) {
      preview = new fabric.Polyline(points as unknown as fabric.Point[], {
        fill: "transparent",
        stroke: foreground,
        strokeWidth: options.strokeWidth,
        selectable: false,
        evented: false,
        data: { tempToolObject: true },
      });
      canvas.add(preview);
    } else {
      preview.set({ points: points as unknown as fabric.Point[] });
    }

    if (event.e.detail >= 2 && points.length >= 2) {
      if (points.length > 2) {
        const polygon = new fabric.Polygon(points as unknown as fabric.Point[], {
          fill: "transparent",
          stroke: foreground,
          strokeWidth: options.strokeWidth,
        });
        canvas.add(polygon);
      } else {
        const line = new fabric.Line([points[0].x, points[0].y, points[1].x, points[1].y], {
          stroke: foreground,
          strokeWidth: options.strokeWidth,
        });
        canvas.add(line);
      }
      reset();
      onLayerSync();
    }

    canvas.renderAll();
  });
};
