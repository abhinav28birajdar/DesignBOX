import { useState, useEffect } from "react";
import { useCanvasStore } from "@/store/canvasStore";
import { useLayersStore } from "@/store/layersStore";
import {
  addNodeToPath,
  removeNodeFromPath,
  convertNodeToCurve,
  reversePath,
  togglePathClosed,
  smoothPath,
  simplifyPath,
  fabricPathToVector,
  vectorToFabricPath,
} from "@/utils/pathEditor";
import type { VectorPath } from "@/utils/pathEditor";

export default function VectorEditorPanel() {
  const canvas = useCanvasStore((state) => state.canvas);
  const [selectedPath, setSelectedPath] = useState<VectorPath | null>(null);
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!canvas) return;

    const updatePath = () => {
      const active = canvas.getActiveObject();
      if (active && active.type === "path") {
        const fabricPath = active as any;
        setSelectedPath(fabricPathToVector(fabricPath));
      }
    };

    canvas.on("selection:created", updatePath);
    canvas.on("selection:updated", updatePath);
    canvas.on("object:modified", updatePath);

    return () => {
      canvas.off("selection:created", updatePath);
      canvas.off("selection:updated", updatePath);
      canvas.off("object:modified", updatePath);
    };
  }, [canvas]);

  const handleAddNode = (position: number) => {
    if (!selectedPath) return;
    const updated = addNodeToPath(selectedPath, position, 0, 0);
    setSelectedPath(updated);
  };

  const handleRemoveNode = (index: number) => {
    if (!selectedPath) return;
    const updated = removeNodeFromPath(selectedPath, index);
    setSelectedPath(updated);
    setSelectedNodeIndex(null);
  };

  const handleMoveNode = (index: number, x: number, y: number) => {
    if (!selectedPath) return;
    const updated = { ...selectedPath };
    updated.nodes[index] = { ...updated.nodes[index], x, y };
    setSelectedPath(updated);
  };

  const handleConvertToCurve = (index: number) => {
    if (!selectedPath) return;
    const updated = convertNodeToCurve(selectedPath, index);
    setSelectedPath(updated);
  };

  const handleReversePath = () => {
    if (!selectedPath) return;
    const updated = reversePath(selectedPath);
    setSelectedPath(updated);
  };

  const handleToggleClosed = () => {
    if (!selectedPath) return;
    const updated = togglePathClosed(selectedPath);
    setSelectedPath(updated);
  };

  const handleSmooth = () => {
    if (!selectedPath) return;
    const updated = smoothPath(selectedPath, 0.5);
    setSelectedPath(updated);
  };

  const handleSimplify = () => {
    if (!selectedPath) return;
    const updated = simplifyPath(selectedPath, 2);
    setSelectedPath(updated);
  };

  const syncFromCanvas = useLayersStore((state) => state.syncFromCanvas);

  const handleApplyChanges = () => {
    if (!selectedPath || !canvas) return;
    const active = canvas.getActiveObject();
    if (active && active.type === "path") {
      const newPath = vectorToFabricPath(selectedPath, canvas);
      newPath.set({
        left: active.left,
        top: active.top,
        scaleX: active.scaleX,
        scaleY: active.scaleY,
        angle: active.angle,
        data: active.data,
      });
      canvas.remove(active);
      canvas.add(newPath);
      canvas.setActiveObject(newPath);
      canvas.renderAll();
      syncFromCanvas(canvas);
    }
  };

  if (!selectedPath) {
    return (
      <div className="flex items-center justify-center p-4 text-slate-500">
        <p>Select a path to edit</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-3 text-xs">
      {/* Path Info */}
      <div className="bg-slate-800 rounded p-2">
        <div className="font-semibold text-slate-200 mb-1">{selectedPath.name}</div>
        <div className="text-slate-400 space-y-1">
          <p>Nodes: {selectedPath.nodes.length}</p>
          <p>Status: {selectedPath.closed ? "Closed" : "Open"}</p>
        </div>
      </div>

      {/* Path Operations */}
      <div className="space-y-2">
        <div className="font-semibold text-slate-300">Path Operations</div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleReversePath}
            className="rounded bg-slate-700 px-2 py-1 hover:bg-slate-600"
            title="Reverse path direction"
          >
            ↻ Reverse
          </button>
          <button
            onClick={handleToggleClosed}
            className="rounded bg-slate-700 px-2 py-1 hover:bg-slate-600"
            title="Toggle open/closed"
          >
            {selectedPath.closed ? "◯ Open" : "● Close"}
          </button>
          <button
            onClick={handleSmooth}
            className="rounded bg-slate-700 px-2 py-1 hover:bg-slate-600"
            title="Smooth path with spline"
          >
            ✧ Smooth
          </button>
          <button
            onClick={handleSimplify}
            className="rounded bg-slate-700 px-2 py-1 hover:bg-slate-600"
            title="Remove redundant nodes"
          >
            ⊘ Simplify
          </button>
        </div>
      </div>

      {/* Node Editing */}
      <div className="space-y-2">
        <div className="font-semibold text-slate-300">Nodes</div>
        <div className="max-h-32 overflow-y-auto space-y-1 bg-slate-900 rounded p-2">
          {selectedPath.nodes.map((node, i) => (
            <div
              key={i}
              onClick={() => setSelectedNodeIndex(i)}
              className={`flex items-center justify-between p-1 rounded cursor-pointer ${
                selectedNodeIndex === i ? "bg-indigo-600" : "bg-slate-800 hover:bg-slate-700"
              }`}
            >
              <span className="text-slate-300">
                Node {i}: ({Math.round(node.x)}, {Math.round(node.y)})
              </span>
              <div className="flex gap-1">
                {node.type === "line" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConvertToCurve(i);
                    }}
                    className="text-[10px] px-1 rounded bg-indigo-600 hover:bg-indigo-700"
                  >
                    Curve
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveNode(i);
                  }}
                  className="text-[10px] px-1 rounded bg-red-700 hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Node Position Editor */}
      {selectedNodeIndex !== null && (
        <div className="bg-slate-800 rounded p-2 space-y-2">
          <div className="font-semibold text-slate-300">Edit Node {selectedNodeIndex}</div>
          <div className="space-y-1">
            <label className="flex items-center gap-2">
              <span className="w-4">X:</span>
              <input
                type="number"
                value={Math.round(selectedPath.nodes[selectedNodeIndex].x)}
                onChange={(e) =>
                  handleMoveNode(selectedNodeIndex, parseFloat(e.target.value), selectedPath.nodes[selectedNodeIndex].y)
                }
                className="flex-1 rounded bg-slate-700 px-2 py-1 text-white"
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="w-4">Y:</span>
              <input
                type="number"
                value={Math.round(selectedPath.nodes[selectedNodeIndex].y)}
                onChange={(e) =>
                  handleMoveNode(selectedNodeIndex, selectedPath.nodes[selectedNodeIndex].x, parseFloat(e.target.value))
                }
                className="flex-1 rounded bg-slate-700 px-2 py-1 text-white"
              />
            </label>
          </div>
        </div>
      )}

      {/* Apply Changes */}
      <button
        onClick={handleApplyChanges}
        className="rounded bg-indigo-600 px-3 py-2 text-white font-semibold hover:bg-indigo-700"
      >
        ✓ Apply Changes
      </button>
    </div>
  );
}
