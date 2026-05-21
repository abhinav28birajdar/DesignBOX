import type { ToolContext } from "@/tools/toolCommon";
import { disableDrawing } from "@/tools/toolCommon";

export const activateEyedropperTool = (
  { canvas }: ToolContext,
  onPick: (hex: string, useBackground: boolean) => void
): void => {
  disableDrawing(canvas);
  canvas.defaultCursor = "crosshair";

  canvas.off("mouse:down");
  canvas.on("mouse:down", (event) => {
    const pointer = canvas.getPointer(event.e);
    const ctx = canvas.getElement().getContext("2d");
    if (!ctx) return;
    const pixel = ctx.getImageData(Math.round(pointer.x), Math.round(pointer.y), 1, 1).data;
    const hex = `#${[pixel[0], pixel[1], pixel[2]].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
    onPick(hex, event.e.altKey);
  });
};
