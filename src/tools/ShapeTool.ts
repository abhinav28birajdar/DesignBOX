import { fabric } from "fabric";
import type { ToolContext } from "@/tools/toolCommon";
import { disableDrawing } from "@/tools/toolCommon";

export const activateShapeTool = ({ canvas, options, foreground, onLayerSync }: ToolContext): void => {
  disableDrawing(canvas);
  let startX = 0;
  let startY = 0;
  let current: fabric.Object | null = null;

  canvas.on("mouse:down", (event) => {
    const pointer = canvas.getPointer(event.e);
    startX = pointer.x;
    startY = pointer.y;

    if (options.shapeType === "ellipse") {
      current = new fabric.Ellipse({
        left: startX,
        top: startY,
        rx: 1,
        ry: 1,
        fill: foreground,
        stroke: foreground,
        strokeWidth: options.strokeWidth,
      });
    } else if (options.shapeType === "line") {
      current = new fabric.Line([startX, startY, startX, startY], {
        stroke: foreground,
        strokeWidth: options.strokeWidth,
      });
    } else if (options.shapeType === "polygon") {
      current = new fabric.Polygon([], {
        left: startX,
        top: startY,
        fill: foreground,
        stroke: foreground,
        strokeWidth: options.strokeWidth,
      });
    } else if (options.shapeType === "star") {
      current = new fabric.Polygon([], {
        left: startX,
        top: startY,
        fill: foreground,
        stroke: foreground,
        strokeWidth: options.strokeWidth,
      });
    } else {
      current = new fabric.Rect({
        left: startX,
        top: startY,
        width: 1,
        height: 1,
        fill: foreground,
        stroke: foreground,
        strokeWidth: options.strokeWidth,
      });
    }

    canvas.add(current);
  });

  canvas.on("mouse:move", (event) => {
    if (!current) return;
    const pointer = canvas.getPointer(event.e);
    const width = pointer.x - startX;
    const height = pointer.y - startY;

    if (current.type === "rect") {
      current.set({ width: Math.abs(width), height: Math.abs(height), left: Math.min(pointer.x, startX), top: Math.min(pointer.y, startY) });
    } else if (current.type === "ellipse") {
      const ellipse = current as fabric.Ellipse;
      ellipse.set({ rx: Math.abs(width) / 2, ry: Math.abs(height) / 2, left: Math.min(pointer.x, startX), top: Math.min(pointer.y, startY) });
    } else if (current.type === "line") {
      const line = current as fabric.Line;
      line.set({ x2: pointer.x, y2: pointer.y });
    } else {
      const sides = options.shapeType === "star" ? 10 : Math.max(3, options.polygonSides);
      const radius = Math.max(8, Math.hypot(width, height));
      const points = Array.from({ length: sides }).map((_, i) => {
        const isStarInner = options.shapeType === "star" && i % 2 === 1;
        const pointRadius = isStarInner ? radius * 0.45 : radius;
        const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
        return { x: startX + Math.cos(angle) * pointRadius, y: startY + Math.sin(angle) * pointRadius };
      });
      (current as fabric.Polygon).set({ points: points as unknown as fabric.Point[] });
    }

    current.setCoords();
    canvas.renderAll();
  });

  canvas.on("mouse:up", () => {
    if (current) {
      onLayerSync();
    }
    current = null;
  });
};
