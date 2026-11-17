import { create } from "zustand";

export type ModalKey =
  | "export"
  | "font"
  | "newProject"
  | "shortcuts"
  | "preferences"
  | "findReplace"
  | "print"
  | "breakpoints"
  | "distort"
  | "refineEdge"
  | "about"
  | "canvasSize"
  | "layerStyle";

interface UiState {
  theme: "dark" | "light";
  showLayers: boolean;
  showProperties: boolean;
  showAdjustments: boolean;
  showAnimationTimeline: boolean;
  openExportModal: boolean;
  openFontModal: boolean;
  openNewProjectModal: boolean;
  openShortcutsModal: boolean;
  openPreferencesModal: boolean;
  openFindReplaceModal: boolean;
  openPrintModal: boolean;
  openBreakpointsModal: boolean;
  openDistortModal: boolean;
  openRefineEdgeModal: boolean;
  openAboutModal: boolean;
  openCanvasSizeModal: boolean;
  openLayerStylesModal: boolean;

  setTheme: (theme: "dark" | "light") => void;
  togglePanel: (key: "layers" | "properties" | "adjustments" | "animation") => void;
  setModal: (key: ModalKey, value: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  theme: (localStorage.getItem("designbox_theme") as "dark" | "light") || "dark",
  showLayers: true,
  showProperties: true,
  showAdjustments: true,
  showAnimationTimeline: false,

  openExportModal: false,
  openFontModal: false,
  openNewProjectModal: false,
  openShortcutsModal: false,
  openPreferencesModal: false,
  openFindReplaceModal: false,
  openPrintModal: false,
  openBreakpointsModal: false,
  openDistortModal: false,
  openRefineEdgeModal: false,
  openAboutModal: false,
  openCanvasSizeModal: false,
  openLayerStylesModal: false,

  setTheme: (theme) => {
    localStorage.setItem("designbox_theme", theme);
    set({ theme });
  },

  togglePanel: (key) =>
    set((state) => {
      if (key === "layers") return { showLayers: !state.showLayers };
      if (key === "properties") return { showProperties: !state.showProperties };
      if (key === "animation") return { showAnimationTimeline: !state.showAnimationTimeline };
      return { showAdjustments: !state.showAdjustments };
    }),

  setModal: (key, value) =>
    set(() => {
      if (key === "export") return { openExportModal: value };
      if (key === "font") return { openFontModal: value };
      if (key === "shortcuts") return { openShortcutsModal: value };
      if (key === "preferences") return { openPreferencesModal: value };
      if (key === "findReplace") return { openFindReplaceModal: value };
      if (key === "print") return { openPrintModal: value };
      if (key === "breakpoints") return { openBreakpointsModal: value };
      if (key === "distort") return { openDistortModal: value };
      if (key === "refineEdge") return { openRefineEdgeModal: value };
      if (key === "about") return { openAboutModal: value };
      if (key === "canvasSize") return { openCanvasSizeModal: value };
      if (key === "layerStyle") return { openLayerStylesModal: value };
      return { openNewProjectModal: value };
    }),
}));
