import { create } from "zustand";

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
  setTheme: (theme: "dark" | "light") => void;
  togglePanel: (key: "layers" | "properties" | "adjustments" | "animation") => void;
  setModal: (key: "export" | "font" | "newProject" | "shortcuts" | "preferences" | "findReplace", value: boolean) => void;
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
      return { openNewProjectModal: value };
    }),
}));
