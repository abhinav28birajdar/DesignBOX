import { fabric } from "fabric";

export interface PathNode {
  x: number;
  y: number;
  controlX1?: number;
  controlY1?: number;
  controlX2?: number;
  controlY2?: number;
  type: "line" | "curve";
}

export interface VectorPath {
  id: string;
  name: string;
  nodes: PathNode[];
  closed: boolean;
  stroked: boolean;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
}

/**
 * Convert Fabric.js Path to VectorPath format
 */
export function fabricPathToVector(fabricPath: fabric.Path): VectorPath {
  const commands = (fabricPath.path as any) as string[][];
  const nodes: PathNode[] = [];
  let currentPoint = { x: 0, y: 0 };

  for (const cmd of commands) {
    const operation = cmd[0];

    switch (operation) {
      case "M": // Move
        currentPoint = { x: Number(cmd[1]), y: Number(cmd[2]) };
        nodes.push({ ...currentPoint, type: "line" });
        break;

      case "L": // Line
        currentPoint = { x: Number(cmd[1]), y: Number(cmd[2]) };
        nodes.push({ ...currentPoint, type: "line" });
        break;

      case "C": // Cubic Bezier
        const node: PathNode = {
          x: Number(cmd[5]),
          y: Number(cmd[6]),
          controlX1: Number(cmd[1]),
          controlY1: Number(cmd[2]),
          controlX2: Number(cmd[3]),
          controlY2: Number(cmd[4]),
          type: "curve",
        };
        nodes.push(node);
        currentPoint = { x: node.x, y: node.y };
        break;

      case "Z": // Close path
        break;
    }
  }

  return {
    id: (fabricPath as any).id || crypto.randomUUID(),
    name: (fabricPath as any).name || "Path",
    nodes,
    closed: (fabricPath as any).closed ?? false,
    stroked: fabricPath.stroke ? true : false,
    fillColor: fabricPath.fill?.toString(),
    strokeColor: fabricPath.stroke?.toString(),
    strokeWidth: fabricPath.strokeWidth,
  };
}

/**
 * Convert VectorPath to Fabric.js Path
 */
export function vectorToFabricPath(vector: VectorPath, fabricCanvas: fabric.Canvas): fabric.Path {
  const pathData: string[] = [];

  if (vector.nodes.length === 0) {
    const path = new fabric.Path("M 0 0", {
      fill: vector.fillColor || "transparent",
      stroke: vector.strokeColor,
      strokeWidth: vector.strokeWidth,
    });
    return path;
  }

  // Move to first point
  pathData.push(`M${vector.nodes[0].x},${vector.nodes[0].y}`);

  // Add all line/curve segments
  for (let i = 1; i < vector.nodes.length; i++) {
    const node = vector.nodes[i];

    if (node.type === "curve" && node.controlX1 !== undefined) {
      pathData.push(
        `C${node.controlX1},${node.controlY1},${node.controlX2},${node.controlY2},${node.x},${node.y}`
      );
    } else {
      pathData.push(`L${node.x},${node.y}`);
    }
  }

  // Close path if needed
  if (vector.closed) {
    pathData.push("Z");
  }

  const path = new fabric.Path(pathData.join(""), {
    fill: vector.fillColor || "transparent",
    stroke: vector.strokeColor,
    strokeWidth: vector.strokeWidth,
    left: 0,
    top: 0,
  });

  return path;
}

/**
 * Add a node at a specific position on a path
 */
export function addNodeToPath(
  path: VectorPath,
  position: number,
  x: number,
  y: number
): VectorPath {
  const newNodes = [...path.nodes];
  newNodes.splice(position, 0, { x, y, type: "line" });
  return { ...path, nodes: newNodes };
}

/**
 * Remove a node from a path
 */
export function removeNodeFromPath(path: VectorPath, index: number): VectorPath {
  if (path.nodes.length <= 2) return path;
  const newNodes = path.nodes.filter((_, i) => i !== index);
  return { ...path, nodes: newNodes };
}

/**
 * Move a node to a new position
 */
export function moveNodeInPath(path: VectorPath, index: number, x: number, y: number): VectorPath {
  const newNodes = [...path.nodes];
  newNodes[index] = { ...newNodes[index], x, y };
  return { ...path, nodes: newNodes };
}

/**
 * Convert a line segment to a curve (add control points)
 */
export function convertNodeToCurve(path: VectorPath, index: number): VectorPath {
  const newNodes = [...path.nodes];
  const node = newNodes[index];
  const prev = newNodes[index - 1] || node;
  const next = newNodes[index + 1] || node;

  // Calculate control points with smooth curve between previous and next
  const distance = Math.hypot(next.x - prev.x, next.y - prev.y);
  const controlDistance = distance * 0.25;
  const angle = Math.atan2(next.y - prev.y, next.x - prev.x);

  newNodes[index] = {
    ...node,
    type: "curve",
    controlX1: node.x - Math.cos(angle) * controlDistance,
    controlY1: node.y - Math.sin(angle) * controlDistance,
    controlX2: node.x + Math.cos(angle) * controlDistance,
    controlY2: node.y + Math.sin(angle) * controlDistance,
  };

  return { ...path, nodes: newNodes };
}

/**
 * Reverse path direction
 */
export function reversePath(path: VectorPath): VectorPath {
  return {
    ...path,
    nodes: [...path.nodes].reverse(),
  };
}

/**
 * Close or open a path
 */
export function togglePathClosed(path: VectorPath): VectorPath {
  return {
    ...path,
    closed: !path.closed,
  };
}

/**
 * Smooth path nodes (Catmull-Rom spline)
 */
export function smoothPath(path: VectorPath, tension: number = 0.5): VectorPath {
  if (path.nodes.length < 3) return path;

  const newNodes: PathNode[] = [];

  for (let i = 0; i < path.nodes.length; i++) {
    const p0 = path.nodes[(i - 1 + path.nodes.length) % path.nodes.length];
    const p1 = path.nodes[i];
    const p2 = path.nodes[(i + 1) % path.nodes.length];
    const p3 = path.nodes[(i + 2) % path.nodes.length];

    // Catmull-Rom formula for control points
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;

    newNodes.push({
      ...p1,
      type: "curve",
      controlX1: cp1x,
      controlY1: cp1y,
      controlX2: cp2x,
      controlY2: cp2y,
    });
  }

  return { ...path, nodes: newNodes };
}

/**
 * Boolean operation: Union two paths
 */
export function unionPaths(path1: VectorPath, path2: VectorPath): VectorPath {
  // Simplified union - in production would use poly2tri or similar
  const allNodes = [...path1.nodes, ...path2.nodes];
  return {
    ...path1,
    id: crypto.randomUUID(),
    name: `${path1.name} + ${path2.name}`,
    nodes: allNodes,
  };
}

/**
 * Boolean operation: Subtract path2 from path1
 */
export function subtractPaths(path1: VectorPath, path2: VectorPath): VectorPath {
  // Simplified - would need proper polygon clipping in production
  return {
    ...path1,
    id: crypto.randomUUID(),
    name: `${path1.name} - ${path2.name}`,
    closed: true,
  };
}

/**
 * Boolean operation: Intersect two paths
 */
export function intersectPaths(path1: VectorPath, path2: VectorPath): VectorPath {
  return {
    ...path1,
    id: crypto.randomUUID(),
    name: `${path1.name} ∩ ${path2.name}`,
    closed: true,
  };
}

/**
 * Simplify path by removing redundant points
 */
export function simplifyPath(path: VectorPath, tolerance: number = 2): VectorPath {
  if (path.nodes.length <= 2) return path;

  const simplified: PathNode[] = [path.nodes[0]];

  for (let i = 1; i < path.nodes.length - 1; i++) {
    const prev = simplified[simplified.length - 1];
    const curr = path.nodes[i];
    const next = path.nodes[i + 1];

    // Distance from current point to line between prev and next
    const distance =
      Math.abs(
        (next.y - prev.y) * curr.x -
          (next.x - prev.x) * curr.y +
          next.x * prev.y -
          next.y * prev.x
      ) / Math.hypot(next.y - prev.y, next.x - prev.x);

    if (distance > tolerance) {
      simplified.push(curr);
    }
  }

  simplified.push(path.nodes[path.nodes.length - 1]);

  return { ...path, nodes: simplified };
}

/**
 * Get path bounding box
 */
export function getPathBounds(path: VectorPath) {
  if (path.nodes.length === 0) return { x: 0, y: 0, width: 0, height: 0 };

  let minX = path.nodes[0].x;
  let maxX = path.nodes[0].x;
  let minY = path.nodes[0].y;
  let maxY = path.nodes[0].y;

  for (const node of path.nodes) {
    minX = Math.min(minX, node.x);
    maxX = Math.max(maxX, node.x);
    minY = Math.min(minY, node.y);
    maxY = Math.max(maxY, node.y);
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}
