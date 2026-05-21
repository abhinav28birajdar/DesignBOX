import { useCallback } from "react";
import { useHistoryStore } from "@/store/historyStore";
import { useCanvasStore } from "@/store/canvasStore";
import { useLayersStore } from "@/store/layersStore";

export const useHistory = () => {
  const canvas = useCanvasStore((state) => state.canvas);
  const push = useHistoryStore((state) => state.push);
  const past = useHistoryStore((state) => state.past);
  const jumpEntry = useHistoryStore((state) => state.jumpTo);
  const undoEntry = useHistoryStore((state) => state.undo);
  const redoEntry = useHistoryStore((state) => state.redo);
  const syncFromCanvas = useLayersStore((state) => state.syncFromCanvas);

  const snapshot = useCallback(
    (label: string) => {
      if (!canvas) return;
      push(JSON.stringify(canvas.toJSON(["data", "globalCompositeOperation"])), label);
    },
    [canvas, push]
  );

  const undo = useCallback(() => {
    if (!canvas) return;
    const previous = undoEntry();
    if (!previous) return;
    canvas.loadFromJSON(previous.json, () => {
      canvas.renderAll();
      syncFromCanvas(canvas);
    });
  }, [canvas, undoEntry, syncFromCanvas]);

  const redo = useCallback(() => {
    if (!canvas) return;
    const next = redoEntry();
    if (!next) return;
    canvas.loadFromJSON(next.json, () => {
      canvas.renderAll();
      syncFromCanvas(canvas);
    });
  }, [canvas, redoEntry, syncFromCanvas]);

  const jumpTo = useCallback(
    (entryId: string) => {
      if (!canvas) return;
      const target = jumpEntry(entryId);
      if (!target) return;
      canvas.loadFromJSON(target.json, () => {
        canvas.renderAll();
        syncFromCanvas(canvas);
      });
    },
    [canvas, jumpEntry, syncFromCanvas]
  );

  return { snapshot, undo, redo, jumpTo, past };
};
