import { fabric } from "fabric";
import { getStroke } from "perfect-freehand";
import type { ToolContext } from "@/tools/toolCommon";

const getSvgPathFromStroke = (points: number[][]): string => {
  if (!points.length) return "";

  const [first, ...rest] = points;
  const path = rest.reduce(
    (acc, point, index) => {
      const next = rest[index + 1] || point;
      acc.push([point[0], point[1], (point[0] + next[0]) / 2, (point[1] + next[1]) / 2]);
      return acc;
    },
    [[first[0], first[1], first[0], first[1]]] as number[][]
  );

  return `M${first[0].toFixed(2)} ${first[1].toFixed(2)} Q${path
    .map(([x1, y1, x2, y2]) => `${x1.toFixed(2)} ${y1.toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)}`)
    .join(" ")} Z`;
};

const extractPathPoints = (path: fabric.Path): [number, number][] => {
  const commands = (path.get("path") || []) as unknown as Array<Array<string | number>>;
  return commands
    .map((cmd) => {
      const x = cmd[1];
      const y = cmd[2];
      return typeof x === "number" && typeof y === "number" ? ([x, y] as [number, number]) : null;
    })
    .filter((point): point is [number, number] => point !== null);
};

export const activateBrushTool = ({ canvas, options, foreground, onLayerSync }: ToolContext): void => {
  canvas.discardActiveObject();
  canvas.renderAll();
  canvas.isDrawingMode = true;
  const brush = new fabric.PencilBrush(canvas);
  brush.color = foreground;
  brush.width = options.brushSize;
  canvas.freeDrawingBrush = brush;
  canvas.selection = false;

  canvas.off("path:created");
  canvas.on("path:created", (event: fabric.IEvent<MouseEvent>) => {
    const path = (event as unknown as { path?: fabric.Path }).path;
    if (!path) return;

    const sourcePoints = extractPathPoints(path);
    if (sourcePoints.length > 2) {
      const stroke = getStroke(
        sourcePoints.map(([x, y]) => ({
          x,
          y,
          pressure: options.brushOpacity / 100,
        })),
        {
          size: options.brushSize,
          thinning: 0.65,
          smoothing: Math.max(0.2, 1 - options.hardness / 100),
          streamline: 0.35,
          simulatePressure: true,
        }
      );

      const svgPath = getSvgPathFromStroke(stroke);
      if (svgPath) {
        const smoothStroke = new fabric.Path(svgPath, {
          fill: foreground,
          stroke: undefined,
          opacity: options.brushOpacity / 100,
          data: { ...(path.data || {}), pathKind: "draw" },
        });
        canvas.remove(path);
        canvas.add(smoothStroke);
      }
    } else {
      path.set({
        opacity: options.brushOpacity / 100,
        data: { ...(path.data || {}), pathKind: "draw" },
      });
    }

    canvas.renderAll();
    onLayerSync();
  });
};
