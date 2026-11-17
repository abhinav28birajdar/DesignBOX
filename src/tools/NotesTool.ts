import { fabric } from "fabric";
import { BaseTool, disableDrawing, type ToolContext } from "./toolCommon";
import { useNotesStore } from "@/store/notesStore";

export class NotesTool extends BaseTool {
  name = "notes";
  cursor = "copy";

  onMouseDown(e: fabric.IEvent, canvas: fabric.Canvas) {
    const pointer = canvas.getPointer(e.e);
    useNotesStore.getState().addNote({
      x: Math.round(pointer.x),
      y: Math.round(pointer.y),
      author: "Designer",
      text: "Sticky Note",
      color: "yellow",
    });

    const pin = new fabric.Group(
      [
        new fabric.Rect({
          width: 32,
          height: 32,
          fill: "#f59e0b",
          rx: 6,
          ry: 6,
          stroke: "#ffffff",
          strokeWidth: 2,
        }),
        new fabric.Text("📌", {
          fontSize: 18,
          left: 6,
          top: 4,
        }),
      ],
      {
        left: pointer.x - 16,
        top: pointer.y - 16,
        selectable: true,
        data: { isNoteMarker: true },
      }
    );

    canvas.add(pin);
    canvas.renderAll();
  }
}

export const activateNotesTool = ({ canvas }: ToolContext): void => {
  disableDrawing(canvas);
  canvas.selection = false;
  canvas.defaultCursor = "copy";

  canvas.off("mouse:down");
  canvas.on("mouse:down", (e) => {
    const pointer = canvas.getPointer(e.e);
    useNotesStore.getState().addNote({
      x: Math.round(pointer.x),
      y: Math.round(pointer.y),
      author: "Designer",
      text: "New note",
      color: "yellow",
    });

    const pin = new fabric.Group(
      [
        new fabric.Rect({
          width: 32,
          height: 32,
          fill: "#f59e0b",
          rx: 6,
          ry: 6,
          stroke: "#ffffff",
          strokeWidth: 2,
        }),
        new fabric.Text("📌", {
          fontSize: 18,
          left: 6,
          top: 4,
        }),
      ],
      {
        left: pointer.x - 16,
        top: pointer.y - 16,
        selectable: true,
        data: { isNoteMarker: true },
      }
    );

    canvas.add(pin);
    canvas.renderAll();
  });
};
