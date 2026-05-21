import { create } from "zustand";
import type { ToolId, ToolOptions } from "@/types";

interface ToolState {
  activeTool: ToolId;
  options: ToolOptions;
  setTool: (tool: ToolId) => void;
  patchOptions: (data: Partial<ToolOptions>) => void;
}

const defaultOptions: ToolOptions = {
  feather: 0,
  antiAlias: true,
  brushSize: 16,
  brushOpacity: 100,
  hardness: 100,
  flow: 100,
  smoothing: 50,
  brushType: "round",
  tolerance: 32,
  contiguous: true,
  shapeType: "rect",
  polygonSides: 5,
  strokeWidth: 2,
  cornerRadius: 0,
  fontSize: 36,
  fontFamily: "Inter",
  fontWeight: "normal",
  textAlignment: "left",
  zoom: 100,
};

export const useToolStore = create<ToolState>((set) => ({
  activeTool: "move",
  options: defaultOptions,
  setTool: (tool) => set({ activeTool: tool }),
  patchOptions: (data) => set((state) => ({ options: { ...state.options, ...data } })),
}));
