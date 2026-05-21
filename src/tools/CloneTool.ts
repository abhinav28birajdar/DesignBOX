import { fabric } from "fabric";
import type { ToolContext } from "@/tools/toolCommon";
import { disableDrawing } from "@/tools/toolCommon";

export const activateCloneTool = ({ canvas, options, onLayerSync }: ToolContext): void => {
  disableDrawing(canvas);
  let source: { x: number; y: number } | null = null;

  canvas.off("mouse:down");
  canvas.on("mouse:down", (event) => {
    const pointer = canvas.getPointer(event.e);
    if (event.e.altKey) {
      source = { x: pointer.x, y: pointer.y };
      return;
    }
    if (!source) return;

    const data = canvas.toDataURL({
      left: source.x - options.brushSize / 2,
      top: source.y - options.brushSize / 2,
      width: options.brushSize,
      height: options.brushSize,
      multiplier: 1,
    });

    fabric.Image.fromURL(data, (image) => {
      image.set({ left: pointer.x, top: pointer.y, selectable: true });
      canvas.add(image);
      canvas.renderAll();
      onLayerSync();
    });
  });
};
