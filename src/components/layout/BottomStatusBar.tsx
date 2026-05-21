import { useCanvasStore } from "@/store/canvasStore";

export default function BottomStatusBar() {
  const zoom = useCanvasStore((state) => state.zoom);
  const cursor = useCanvasStore((state) => state.cursor);
  const canvas = useCanvasStore((state) => state.canvas);

  return (
    <div className="panel flex h-8 items-center justify-between px-3 text-xs text-slate-300">
      <span>{zoom}%</span>
      <span>
        {canvas?.getWidth() ?? 0} x {canvas?.getHeight() ?? 0}px
      </span>
      <span>
        X:{cursor.x} Y:{cursor.y}
      </span>
    </div>
  );
}
