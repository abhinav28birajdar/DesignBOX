import type { ToolContext } from "@/tools/toolCommon";
import { disableDrawing } from "@/tools/toolCommon";

export const activateFillTool = ({ canvas, foreground, onLayerSync }: ToolContext): void => {
  disableDrawing(canvas);
  canvas.defaultCursor = "cell";

  canvas.off("mouse:down");
  canvas.on("mouse:down", (event) => {
    const target = event.target;
    if (target) {
      target.set("fill", foreground);
      canvas.renderAll();
      onLayerSync();
      return;
    }

    canvas.setBackgroundColor(foreground, () => {
      canvas.renderAll();
      onLayerSync();
    });
  });
};
