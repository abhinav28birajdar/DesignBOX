import { useMemo } from "react";
import { useCanvasStore } from "@/store/canvasStore";

export const useCanvas = () => {
  const canvas = useCanvasStore((state) => state.canvas);
  const zoom = useCanvasStore((state) => state.zoom);
  return useMemo(() => ({ canvas, zoom }), [canvas, zoom]);
};
