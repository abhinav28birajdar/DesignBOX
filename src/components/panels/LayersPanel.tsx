import { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { fabric } from "fabric";
import { useCanvasStore } from "@/store/canvasStore";
import { useLayersStore } from "@/store/layersStore";
import type { BlendMode } from "@/types";

const blendModes: BlendMode[] = [
  "normal",
  "dissolve",
  "darken",
  "multiply",
  "color-burn",
  "linear-burn",
  "lighten",
  "screen",
  "color-dodge",
  "linear-dodge",
  "overlay",
  "soft-light",
  "hard-light",
  "difference",
  "exclusion",
  "hue",
  "saturation",
  "color",
  "luminosity",
];

type DragItem = { type: "LAYER"; index: number; id: string };

interface LayerRowProps {
  layer: ReturnType<typeof useLayersStore.getState>["layers"][number];
  index: number;
  selectedId: string | null;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  canvas: fabric.Canvas | null;
  onSelect: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onToggleVisibility: (id: string, visible: boolean) => void;
  onToggleLock: (id: string, locked: boolean) => void;
  onOpacity: (id: string, opacity: number) => void;
  onBlendMode: (id: string, blendMode: BlendMode) => void;
  onDuplicate: (id: string) => void;
  onRemove: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

function getLayerIcon(type: string): string {
  switch (type) {
    case "image":
      return "🖼";
    case "textbox":
    case "text":
    case "i-text":
      return "🔤";
    case "rect":
      return "▭";
    case "circle":
    case "ellipse":
      return "○";
    case "group":
      return "📁";
    case "path":
      return "✒️";
    case "line":
      return "╱";
    default:
      return "▱";
  }
}

function DraggableLayerRow({
  layer,
  index,
  selectedId,
  editingId,
  setEditingId,
  canvas,
  onSelect,
  onRename,
  onToggleVisibility,
  onToggleLock,
  onOpacity,
  onBlendMode,
  onDuplicate,
  onRemove,
  onReorder,
}: LayerRowProps) {
  const [{ isDragging }, dragRef] = useDrag<DragItem, void, { isDragging: boolean }>(
    () => ({
      type: "LAYER",
      item: { type: "LAYER", index, id: layer.id },
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }),
    [index, layer.id]
  );

  const [, dropRef] = useDrop<DragItem>(
    () => ({
      accept: "LAYER",
      hover: (item) => {
        if (item.index !== index) {
          onReorder(item.index, index);
          item.index = index;
        }
      },
    }),
    [index, onReorder]
  );

  const layerType = (layer.object as any)?.type || "object";

  return (
    <div
      ref={(node) => {
        dragRef(dropRef(node));
      }}
      className={`rounded-lg p-2.5 transition border ${
        selectedId === layer.id
          ? "bg-indigo-950/50 border-indigo-500 shadow-sm"
          : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
      } ${isDragging ? "opacity-40" : "opacity-100"}`}
      onClick={() => {
        onSelect(layer.id);
        canvas?.setActiveObject(layer.object);
        canvas?.renderAll();
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        {/* Visibility Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility(layer.id, !layer.visible);
          }}
          className="text-xs hover:opacity-80 p-0.5"
          title={layer.visible ? "Hide Layer" : "Show Layer"}
        >
          {layer.visible ? "👁" : "🚫"}
        </button>

        {/* Lock Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLock(layer.id, !layer.locked);
          }}
          className="text-xs hover:opacity-80 p-0.5"
          title={layer.locked ? "Unlock Layer" : "Lock Layer"}
        >
          {layer.locked ? "🔒" : "🔓"}
        </button>

        {/* Live / Type Thumbnail */}
        <div className="w-6 h-6 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-xs shrink-0 select-none">
          {getLayerIcon(layerType)}
        </div>

        {/* Layer Name (Double click to rename) */}
        <div className="flex-1 min-w-0">
          {editingId === layer.id ? (
            <input
              autoFocus
              defaultValue={layer.name}
              className="w-full rounded bg-slate-950 border border-indigo-500 px-1.5 py-0.5 text-xs text-white focus:outline-none"
              onBlur={(e) => {
                onRename(layer.id, e.target.value.trim() || layer.name);
                setEditingId(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onRename(layer.id, (e.target as HTMLInputElement).value.trim() || layer.name);
                  setEditingId(null);
                }
              }}
            />
          ) : (
            <span
              className="truncate block text-xs font-medium text-slate-200 cursor-pointer select-none"
              onDoubleClick={() => setEditingId(layer.id)}
              title="Double-click to rename"
            >
              {layer.name}
            </span>
          )}
        </div>

        {/* Quick Duplicate / Delete */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate(layer.id);
          }}
          title="Duplicate"
          className="text-[11px] text-slate-400 hover:text-white p-0.5"
        >
          ⧉
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(layer.id);
          }}
          title="Delete"
          className="text-[11px] text-red-400 hover:text-red-300 p-0.5"
        >
          ✕
        </button>
      </div>

      {/* Opacity & Blend Mode Row */}
      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-800/80">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Op:</span>
          <input
            type="range"
            min={0}
            max={100}
            value={layer.opacity}
            onChange={(e) => onOpacity(layer.id, Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
          <span className="w-6 text-right font-mono text-slate-300">{layer.opacity}%</span>
        </div>

        <select
          className="rounded bg-slate-800 border border-slate-700 px-1 py-0.5 text-[11px] text-slate-200"
          value={layer.blendMode}
          onChange={(e) => onBlendMode(layer.id, e.target.value as BlendMode)}
        >
          {blendModes.map((mode) => (
            <option key={mode} value={mode}>
              {mode}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function LayersPanel() {
  const canvas = useCanvasStore((state) => state.canvas);
  const layers = useLayersStore((state) => state.layers);
  const selectedId = useLayersStore((state) => state.selectedId);
  const selectLayer = useLayersStore((state) => state.selectLayer);
  const renameLayer = useLayersStore((state) => state.renameLayer);
  const setVisibility = useLayersStore((state) => state.setVisibility);
  const setLocked = useLayersStore((state) => state.setLocked);
  const setOpacity = useLayersStore((state) => state.setOpacity);
  const setBlendMode = useLayersStore((state) => state.setBlendMode);
  const reorderLayers = useLayersStore((state) => state.reorderLayers);
  const syncFromCanvas = useLayersStore((state) => state.syncFromCanvas);

  const [editingId, setEditingId] = useState<string | null>(null);

  const removeLayer = (id: string) => {
    if (!canvas) return;
    const layer = layers.find((item) => item.id === id);
    if (!layer) return;
    canvas.remove(layer.object);
    canvas.discardActiveObject();
    canvas.renderAll();
    syncFromCanvas(canvas);
  };

  const duplicateLayer = (id: string) => {
    if (!canvas) return;
    const layer = layers.find((item) => item.id === id);
    if (!layer) return;
    layer.object.clone((cloned: fabric.Object) => {
      cloned.set({ left: (layer.object.left || 0) + 16, top: (layer.object.top || 0) + 16 });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
      syncFromCanvas(canvas);
    });
  };

  const addBlankLayer = () => {
    if (!canvas) return;
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 200,
      height: 200,
      fill: "#6366f1",
      opacity: 0.9,
      rx: 4,
      ry: 4,
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    syncFromCanvas(canvas);
  };

  const groupSelected = () => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;
    if (active.type === "activeSelection") {
      (active as fabric.ActiveSelection).toGroup();
      canvas.renderAll();
      syncFromCanvas(canvas);
    }
  };

  const mergeDown = () => {
    if (!canvas || layers.length < 2) return;
    const dataURL = canvas.toDataURL({ format: "png", multiplier: 1 });
    fabric.Image.fromURL(dataURL, (img) => {
      canvas.clear();
      canvas.add(img);
      canvas.renderAll();
      syncFromCanvas(canvas);
    });
  };

  return (
    <div className="panel flex h-full flex-col p-3 bg-[#111827] text-slate-200">
      {/* Header and Quick Action Buttons */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#2D3748]">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Layers ({layers.length})
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={addBlankLayer}
            title="New Layer"
            className="px-2 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-indigo-400 font-bold"
          >
            +
          </button>
          <button
            onClick={groupSelected}
            title="Group Selected (Ctrl+G)"
            className="px-2 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            📁
          </button>
          <button
            onClick={mergeDown}
            title="Merge Visible / Flatten"
            className="px-2 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            ⬇
          </button>
          <button
            onClick={() => {
              if (selectedId) removeLayer(selectedId);
            }}
            title="Delete Selected Layer"
            className="px-2 py-1 text-xs rounded bg-slate-800 hover:bg-red-900/40 text-red-400"
          >
            🗑
          </button>
        </div>
      </div>

      {/* Layers List */}
      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {layers.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No layers on canvas. Add a shape, text, or open an image!
          </div>
        ) : (
          layers.map((layer, index) => (
            <DraggableLayerRow
              key={layer.id}
              layer={layer}
              index={index}
              selectedId={selectedId}
              editingId={editingId}
              setEditingId={setEditingId}
              canvas={canvas}
              onSelect={selectLayer}
              onRename={renameLayer}
              onToggleVisibility={setVisibility}
              onToggleLock={setLocked}
              onOpacity={setOpacity}
              onBlendMode={setBlendMode}
              onDuplicate={duplicateLayer}
              onRemove={removeLayer}
              onReorder={(from, to) => reorderLayers(from, to, canvas)}
            />
          ))
        )}
      </div>
    </div>
  );
}
