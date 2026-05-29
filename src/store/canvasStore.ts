import { create } from "zustand";
import type { fabric } from "fabric";
import type { RulerUnit, SnapSettings } from "@/types";

interface CanvasState {
  canvas: fabric.Canvas | null;
  zoom: number;
  pan: { x: number; y: number };
  gridVisible: boolean;
  gridSize: number;
  snapToGrid: boolean;
  snapToGuides: boolean;
  guideSnapThreshold: number;
  guidesVisible: boolean;
  guides: Array<{ id: string; axis: "h" | "v"; position: number }>;
  cursor: { x: number; y: number };

  // Phase 1 Extensions
  viewRotation: number;           // 0-360°, non-destructive
  overscrollEnabled: boolean;     // Allow pan beyond edges
  rulerUnits: RulerUnit;          // px, cm, inches, etc.
  showPixelGrid: boolean;         // Show at zoom ≥800%
  snapSettings: SnapSettings;

  // Actions
  setCanvas: (canvas: fabric.Canvas | null) => void;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  toggleGrid: () => void;
  setGridSize: (value: number) => void;
  toggleSnapToGrid: () => void;
  toggleSnapToGuides: () => void;
  setGuideSnapThreshold: (value: number) => void;
  toggleGuidesVisible: () => void;
  addGuide: (axis: "h" | "v", position: number) => void;
  moveGuide: (id: string, position: number) => void;
  removeGuide: (id: string) => void;
  clearGuides: () => void;
  setCursor: (x: number, y: number) => void;

  // Phase 1 Actions
  setViewRotation: (angle: number) => void;
  resetViewRotation: () => void;
  setRulerUnits: (unit: RulerUnit) => void;
  togglePixelGrid: () => void;
  setSnapSettings: (settings: Partial<SnapSettings>) => void;
  setOverscroll: (enabled: boolean) => void;
}

const DEFAULT_SNAP_SETTINGS: SnapSettings = {
  snapToGrid: false,
  snapToGuides: true,
  snapToEdges: false,
  snapToCenter: false,
  snapToDistribution: false,
  snapTolerance: 5,
};

export const useCanvasStore = create<CanvasState>((set) => ({
  canvas: null,
  zoom: 100,
  pan: { x: 0, y: 0 },
  gridVisible: false,
  gridSize: 10,
  snapToGrid: false,
  snapToGuides: true,
  guideSnapThreshold: 5,
  guidesVisible: true,
  guides: [],
  cursor: { x: 0, y: 0 },

  // Phase 1 Initial State
  viewRotation: 0,
  overscrollEnabled: true,
  rulerUnits: "px",
  showPixelGrid: false,
  snapSettings: DEFAULT_SNAP_SETTINGS,

  // Original actions
  setCanvas: (canvas) => set({ canvas }),
  setZoom: (zoom) => set({ zoom: Math.max(10, Math.min(25600, zoom)) }),
  setPan: (x, y) => set({ pan: { x, y } }),
  toggleGrid: () => set((state) => ({ gridVisible: !state.gridVisible })),
  setGridSize: (value) => set({ gridSize: Math.max(2, value) }),
  toggleSnapToGrid: () => set((state) => ({ snapToGrid: !state.snapToGrid })),
  toggleSnapToGuides: () => set((state) => ({ snapToGuides: !state.snapToGuides })),
  setGuideSnapThreshold: (value) => set({ guideSnapThreshold: Math.max(1, Math.min(25, value)) }),
  toggleGuidesVisible: () => set((state) => ({ guidesVisible: !state.guidesVisible })),
  addGuide: (axis, position) =>
    set((state) => ({
      guides: [...state.guides, { id: crypto.randomUUID(), axis, position: Math.max(0, position) }],
    })),
  moveGuide: (id, position) =>
    set((state) => ({ guides: state.guides.map((guide) => (guide.id === id ? { ...guide, position: Math.max(0, position) } : guide)) })),
  removeGuide: (id) => set((state) => ({ guides: state.guides.filter((guide) => guide.id !== id) })),
  clearGuides: () => set({ guides: [] }),
  setCursor: (x, y) => set({ cursor: { x, y } }),

  // Phase 1 Actions
  setViewRotation: (angle) => set({ viewRotation: ((angle % 360) + 360) % 360 }),
  resetViewRotation: () => set({ viewRotation: 0 }),
  setRulerUnits: (unit) => set({ rulerUnits: unit }),
  togglePixelGrid: () => set((state) => ({ showPixelGrid: !state.showPixelGrid })),
  setSnapSettings: (settings) =>
    set((state) => ({
      snapSettings: { ...state.snapSettings, ...settings },
    })),
  setOverscroll: (enabled) => set({ overscrollEnabled: enabled }),
}));
