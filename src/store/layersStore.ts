import { create } from "zustand";
import type { fabric } from "fabric";
import type { BlendMode, LayerItem, LayerType } from "@/types";

const mapType = (obj: fabric.Object): LayerType => {
  if (obj.type === "textbox" || obj.type === "text") return "text";
  if (obj.type === "image") return "image";
  if (obj.type === "group") return "group";
  return "shape";
};

const mapBlend = (mode?: string): BlendMode => {
  const candidates: BlendMode[] = [
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

  return candidates.includes((mode || "normal") as BlendMode)
    ? (mode as BlendMode)
    : "normal";
};

interface LayersState {
  layers: LayerItem[];
  selectedId: string | null;
  syncFromCanvas: (canvas: fabric.Canvas) => void;
  reorderLayers: (fromIndex: number, toIndex: number, canvas: fabric.Canvas | null) => void;
  selectLayer: (id: string | null) => void;
  renameLayer: (id: string, name: string) => void;
  setVisibility: (id: string, visible: boolean) => void;
  setLocked: (id: string, locked: boolean) => void;
  setOpacity: (id: string, opacity: number) => void;
  setBlendMode: (id: string, blendMode: BlendMode) => void;
}

export const useLayersStore = create<LayersState>((set, get) => ({
  layers: [],
  selectedId: null,
  syncFromCanvas: (canvas) => {
    const objects = canvas.getObjects();
    const layers = objects
      .map((obj, index) => {
        const existing = get().layers.find((layer) => layer.id === (obj.data?.layerId as string));
        const id = existing?.id || crypto.randomUUID();
        obj.set("data", { ...(obj.data || {}), layerId: id });
        return {
          id,
          name: existing?.name || `${obj.type || "layer"} ${index + 1}`,
          type: mapType(obj),
          visible: obj.visible ?? true,
          locked: obj.selectable === false,
          opacity: Math.round((obj.opacity ?? 1) * 100),
          blendMode: mapBlend(obj.globalCompositeOperation),
          object: obj,
        } satisfies LayerItem;
      })
      .reverse();

    set({ layers });
  },
  reorderLayers: (fromIndex, toIndex, canvas) =>
    set((state) => {
      if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= state.layers.length || toIndex >= state.layers.length) {
        return state;
      }
      const next = [...state.layers];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);

      if (canvas) {
        const bottomToTop = [...next].reverse();
        bottomToTop.forEach((layer, index) => {
          canvas.moveTo(layer.object, index);
        });
        canvas.renderAll();
      }

      return { layers: next };
    }),
  selectLayer: (id) => set({ selectedId: id }),
  renameLayer: (id, name) =>
    set((state) => ({ layers: state.layers.map((layer) => (layer.id === id ? { ...layer, name } : layer)) })),
  setVisibility: (id, visible) =>
    set((state) => ({
      layers: state.layers.map((layer) => {
        if (layer.id !== id) return layer;
        layer.object.set("visible", visible);
        return { ...layer, visible };
      }),
    })),
  setLocked: (id, locked) =>
    set((state) => ({
      layers: state.layers.map((layer) => {
        if (layer.id !== id) return layer;
        layer.object.set("selectable", !locked);
        layer.object.set("evented", !locked);
        return { ...layer, locked };
      }),
    })),
  setOpacity: (id, opacity) =>
    set((state) => ({
      layers: state.layers.map((layer) => {
        if (layer.id !== id) return layer;
        layer.object.set("opacity", opacity / 100);
        return { ...layer, opacity };
      }),
    })),
  setBlendMode: (id, blendMode) =>
    set((state) => ({
      layers: state.layers.map((layer) => {
        if (layer.id !== id) return layer;
        layer.object.set("globalCompositeOperation", blendMode === "normal" ? "source-over" : blendMode);
        return { ...layer, blendMode };
      }),
    })),
}));
