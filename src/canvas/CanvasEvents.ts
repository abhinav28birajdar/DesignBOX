import type { fabric } from "fabric";
import { useCanvasStore } from "@/store/canvasStore";

export const wireCanvasEvents = (canvas: fabric.Canvas, onChange: () => void): (() => void) => {
  const setCursor = useCanvasStore.getState().setCursor;

  const updateCursor = (event: fabric.IEvent<Event>) => {
    if (!event.e) return;
    const pointer = canvas.getPointer(event.e);
    setCursor(Math.round(pointer.x), Math.round(pointer.y));
  };

  const onMutation = () => {
    onChange();
  };

  const onObjectMoving = (event: fabric.IEvent<Event>) => {
    const moving = event.target;
    if (!moving) return;

    const state = useCanvasStore.getState();

    if (state.snapToGrid) {
      const size = Math.max(1, state.gridSize);
      const left = moving.left ?? 0;
      const top = moving.top ?? 0;
      moving.set({
        left: Math.round(left / size) * size,
        top: Math.round(top / size) * size,
      });
    }

    if (state.snapToGuides && state.guides.length > 0) {
      const threshold = Math.max(1, state.guideSnapThreshold);
      const left = moving.left ?? 0;
      const top = moving.top ?? 0;

      let snappedLeft = left;
      let snappedTop = top;

      state.guides.forEach((guide) => {
        if (guide.axis === "v" && Math.abs(left - guide.position) <= threshold) {
          snappedLeft = guide.position;
        }
        if (guide.axis === "h" && Math.abs(top - guide.position) <= threshold) {
          snappedTop = guide.position;
        }
      });

      moving.set({ left: snappedLeft, top: snappedTop });
    }

    moving.setCoords();
    canvas.renderAll();
  };

  canvas.on("mouse:move", updateCursor);
  canvas.on("object:added", onMutation);
  canvas.on("object:removed", onMutation);
  canvas.on("object:modified", onMutation);
  canvas.on("object:moving", onObjectMoving);

  return () => {
    canvas.off("mouse:move", updateCursor);
    canvas.off("object:added", onMutation);
    canvas.off("object:removed", onMutation);
    canvas.off("object:modified", onMutation);
    canvas.off("object:moving", onObjectMoving);
  };
};
