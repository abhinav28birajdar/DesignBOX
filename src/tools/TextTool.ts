import { fabric } from "fabric";
import type { ToolContext } from "@/tools/toolCommon";
import { disableDrawing } from "@/tools/toolCommon";

export const activateTextTool = ({ canvas, options, foreground, onLayerSync }: ToolContext): void => {
  disableDrawing(canvas);
  canvas.selection = false;
  canvas.defaultCursor = "text";

  canvas.off("mouse:down");
  canvas.on("mouse:down", (event) => {
    const pointer = canvas.getPointer(event.e);
    const textbox = new fabric.Textbox("Type here", {
      left: pointer.x,
      top: pointer.y,
      fill: foreground,
      fontSize: options.fontSize,
      fontFamily: "Inter",
      editable: true,
      width: 240,
    });
    canvas.add(textbox);
    canvas.setActiveObject(textbox);
    onLayerSync();
    canvas.off("mouse:down");
  });
};
