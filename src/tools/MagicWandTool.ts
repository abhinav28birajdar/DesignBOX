import { fabric } from "fabric";
import type { ToolContext } from "@/tools/toolCommon";
import { disableDrawing } from "@/tools/toolCommon";

const colorDistance = (a: [number, number, number], b: [number, number, number]): number => {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
};

export const activateMagicWandTool = ({ canvas, options }: ToolContext): void => {
  disableDrawing(canvas);
  canvas.defaultCursor = "crosshair";

  canvas.off("mouse:down");
  canvas.on("mouse:down", (event) => {
    const target = event.target;
    if (!target) return;

    const fill = target.get("fill");
    if (typeof fill !== "string") {
      canvas.setActiveObject(target);
      return;
    }

    const parse = (value: string): [number, number, number] => {
      const hex = value.replace("#", "");
      const normalized = hex.length === 3 ? hex.split("").map((c) => `${c}${c}`).join("") : hex;
      const r = parseInt(normalized.slice(0, 2), 16) || 0;
      const g = parseInt(normalized.slice(2, 4), 16) || 0;
      const b = parseInt(normalized.slice(4, 6), 16) || 0;
      return [r, g, b];
    };

    const source = parse(fill);
    const selected = canvas.getObjects().filter((obj) => {
      const objFill = obj.get("fill");
      if (typeof objFill !== "string") return false;
      return colorDistance(source, parse(objFill)) <= options.tolerance;
    });

    if (selected.length === 1) {
      canvas.setActiveObject(selected[0]);
    } else if (selected.length > 1) {
      canvas.setActiveObject(new fabric.ActiveSelection(selected, { canvas }));
    }
    canvas.renderAll();
  });
};
