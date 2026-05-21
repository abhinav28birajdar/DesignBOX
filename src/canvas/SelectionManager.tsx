import { useEffect } from "react";
import { useCanvasStore } from "@/store/canvasStore";
import { useLayersStore } from "@/store/layersStore";

export default function SelectionManager() {
  const canvas = useCanvasStore((state) => state.canvas);
  const selectLayer = useLayersStore((state) => state.selectLayer);

  useEffect(() => {
    if (!canvas) return;

    const update = () => {
      const active = canvas.getActiveObject();
      const id = (active?.data?.layerId as string | undefined) ?? null;
      selectLayer(id);
    };

    canvas.on("selection:created", update);
    canvas.on("selection:updated", update);
    canvas.on("selection:cleared", () => selectLayer(null));

    return () => {
      canvas.off("selection:created", update);
      canvas.off("selection:updated", update);
      canvas.off("selection:cleared");
    };
  }, [canvas, selectLayer]);

  return null;
}
