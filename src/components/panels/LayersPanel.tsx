import { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useCanvasStore } from "@/store/canvasStore";
import { useLayersStore } from "@/store/layersStore";
import type { BlendMode } from "@/types";
import type { fabric } from "fabric";

const blendModes: BlendMode[] = [
  "normal",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "hard-light",
  "soft-light",
  "difference",
  "exclusion",
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
  const [{ isDragging }, dragRef] = useDrag<DragItem, void, { isDragging: boolean }>(() => ({
    type: "LAYER",
    item: { type: "LAYER", index, id: layer.id },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }), [index, layer.id]);

  const [, dropRef] = useDrop<DragItem>(() => ({
    accept: "LAYER",
    hover: (item) => {
      if (item.index !== index) {
        onReorder(item.index, index);
        item.index = index;
      }
    },
  }), [index, onReorder]);

  return (
    <div
      ref={(node) => {
        dragRef(dropRef(node));
      }}
      className={`surface rounded p-2 ${selectedId === layer.id ? "ring-1 ring-indigo-400" : ""} ${isDragging ? "opacity-50" : "opacity-100"}`}
      onClick={() => {
        onSelect(layer.id);
        canvas?.setActiveObject(layer.object);
        canvas?.renderAll();
      }}
    >
      <div className="mb-1 flex items-center gap-2">
        <button onClick={(e) => { e.stopPropagation(); onToggleVisibility(layer.id, !layer.visible); }}>
          {layer.visible ? "👁" : "🚫"}
        </button>
        <button onClick={(e) => { e.stopPropagation(); onToggleLock(layer.id, !layer.locked); }}>
          {layer.locked ? "🔒" : "🔓"}
        </button>
        {editingId === layer.id ? (
          <input
            autoFocus
            defaultValue={layer.name}
            className="w-full rounded bg-slate-800 px-1 text-xs"
            onBlur={(e) => {
              onRename(layer.id, e.target.value);
              setEditingId(null);
            }}
          />
        ) : (
          <button className="truncate text-left text-xs" onDoubleClick={() => setEditingId(layer.id)}>
            {layer.name}
          </button>
        )}
      </div>
      <div className="mb-1 flex items-center gap-2 text-xs">
        <span>Opacity</span>
        <input type="range" min={0} max={100} value={layer.opacity} onChange={(e) => onOpacity(layer.id, Number(e.target.value))} />
      </div>
      <select
        className="w-full rounded bg-slate-800 px-1 py-1 text-xs"
        value={layer.blendMode}
        onChange={(e) => onBlendMode(layer.id, e.target.value as BlendMode)}
      >
        {blendModes.map((mode) => (
          <option key={mode} value={mode}>{mode}</option>
        ))}
      </select>
      <div className="mt-1 flex items-center gap-2 text-xs">
        <button className="rounded bg-slate-700 px-2 py-1" onClick={(e) => { e.stopPropagation(); onDuplicate(layer.id); }}>Duplicate</button>
        <button className="rounded bg-red-700 px-2 py-1" onClick={(e) => { e.stopPropagation(); onRemove(layer.id); }}>Delete</button>
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
      cloned.set({ left: (layer.object.left || 0) + 12, top: (layer.object.top || 0) + 12 });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
      syncFromCanvas(canvas);
    });
  };

  return (
    <div className="panel flex h-[42%] flex-col rounded-md p-2">
      <h3 className="mb-2 text-sm font-semibold">Layers</h3>
      <div className="flex-1 space-y-2 overflow-auto pr-1">
        {layers.map((layer, index) => (
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
        ))}
      </div>
    </div>
  );
}
