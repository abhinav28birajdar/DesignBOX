import { useRef } from "react";
import { useCanvasStore } from "@/store/canvasStore";

interface GuideOverlayProps {
  width: number;
  height: number;
  zoom: number;
}

export default function GuideOverlay({ width, height, zoom }: GuideOverlayProps) {
  const guides = useCanvasStore((state) => state.guides);
  const guidesVisible = useCanvasStore((state) => state.guidesVisible);
  const moveGuide = useCanvasStore((state) => state.moveGuide);
  const removeGuide = useCanvasStore((state) => state.removeGuide);

  const dragIdRef = useRef<string | null>(null);

  if (!guidesVisible) return null;

  return (
    <div className="absolute inset-0 z-20">
      {guides.map((guide) => {
        const scaled = guide.position * (zoom / 100);
        if (guide.axis === "v") {
          return (
            <button
              key={guide.id}
              className="absolute top-0 h-full w-1 cursor-col-resize bg-sky-400/70"
              style={{ left: `${scaled}px` }}
              onMouseDown={() => {
                dragIdRef.current = guide.id;
              }}
              onMouseMove={(event) => {
                if (dragIdRef.current !== guide.id) return;
                const rect = (event.currentTarget.parentElement as HTMLDivElement).getBoundingClientRect();
                const x = event.clientX - rect.left;
                const canvasPos = x / (zoom / 100);
                moveGuide(guide.id, canvasPos);
              }}
              onMouseUp={(event) => {
                if (dragIdRef.current !== guide.id) return;
                const rect = (event.currentTarget.parentElement as HTMLDivElement).getBoundingClientRect();
                const x = event.clientX - rect.left;
                if (x < -12 || x > width * (zoom / 100) + 12) {
                  removeGuide(guide.id);
                }
                dragIdRef.current = null;
              }}
              onDoubleClick={() => {
                const value = window.prompt("Guide position (px)", String(Math.round(guide.position)));
                if (!value) return;
                const number = Number(value);
                if (!Number.isNaN(number)) {
                  moveGuide(guide.id, number);
                }
              }}
            />
          );
        }

        return (
          <button
            key={guide.id}
            className="absolute left-0 h-1 w-full cursor-row-resize bg-sky-400/70"
            style={{ top: `${scaled}px` }}
            onMouseDown={() => {
              dragIdRef.current = guide.id;
            }}
            onMouseMove={(event) => {
              if (dragIdRef.current !== guide.id) return;
              const rect = (event.currentTarget.parentElement as HTMLDivElement).getBoundingClientRect();
              const y = event.clientY - rect.top;
              const canvasPos = y / (zoom / 100);
              moveGuide(guide.id, canvasPos);
            }}
            onMouseUp={(event) => {
              if (dragIdRef.current !== guide.id) return;
              const rect = (event.currentTarget.parentElement as HTMLDivElement).getBoundingClientRect();
              const y = event.clientY - rect.top;
              if (y < -12 || y > height * (zoom / 100) + 12) {
                removeGuide(guide.id);
              }
              dragIdRef.current = null;
            }}
            onDoubleClick={() => {
              const value = window.prompt("Guide position (px)", String(Math.round(guide.position)));
              if (!value) return;
              const number = Number(value);
              if (!Number.isNaN(number)) {
                moveGuide(guide.id, number);
              }
            }}
          />
        );
      })}
    </div>
  );
}
