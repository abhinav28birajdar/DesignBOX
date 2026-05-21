import type { ToolContext } from "@/tools/toolCommon";
import { clearTemporaryObjects, disableDrawing } from "@/tools/toolCommon";

export const activateMoveTool = ({ canvas }: ToolContext): void => {
  disableDrawing(canvas);
  clearTemporaryObjects(canvas);
  canvas.selection = true;
  canvas.forEachObject((obj) => {
    obj.selectable = true;
    obj.evented = true;
  });
  canvas.defaultCursor = "default";
};
