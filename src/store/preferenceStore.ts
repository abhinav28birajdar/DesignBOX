import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RulerUnit } from "@/types";

interface PreferenceState {
  // General
  language: string;
  theme: "light" | "dark";
  defaultDocumentWidth: number;
  defaultDocumentHeight: number;
  autoSaveInterval: number;  // seconds
  historyLimit: number;      // 50-500

  // Interface
  panelAnimations: boolean;
  tooltipDelay: number;      // ms
  brushCursorSize: number;   // 1-10
  colorPickerType: "wheel" | "sliders" | "picker";
  hiDPI: boolean;

  // Performance
  gpuRendering: boolean;
  threadPoolSize: number;    // 4-8
  cacheLimitMB: number;

  // Guides & Grid
  gridSize: number;
  gridColor: string;
  guideColor: string;
  snapTolerance: number;     // 1-10px
  guideLineStyle: "solid" | "dashed" | "dotted";

  // Units & Rulers
  defaultUnit: RulerUnit;
  rulerOriginX: number;
  rulerOriginY: number;
  showRulers: boolean;

  // File Handling
  defaultSaveFormat: "psd" | "json" | "pdf";
  autoRecovery: boolean;
  recentFilesCount: number;

  // Actions
  updatePreference: <K extends keyof PreferenceState>(key: K, value: PreferenceState[K]) => void;
  resetPreferences: () => void;
}

const DEFAULT_PREFERENCES: Omit<PreferenceState, "updatePreference" | "resetPreferences"> = {
  // General
  language: "en",
  theme: "dark",
  defaultDocumentWidth: 1920,
  defaultDocumentHeight: 1080,
  autoSaveInterval: 60,
  historyLimit: 100,

  // Interface
  panelAnimations: true,
  tooltipDelay: 800,
  brushCursorSize: 3,
  colorPickerType: "wheel",
  hiDPI: true,

  // Performance
  gpuRendering: true,
  threadPoolSize: 4,
  cacheLimitMB: 512,

  // Guides & Grid
  gridSize: 16,
  gridColor: "#cccccc",
  guideColor: "#0099ff",
  snapTolerance: 5,
  guideLineStyle: "solid",

  // Units & Rulers
  defaultUnit: "px",
  rulerOriginX: 0,
  rulerOriginY: 0,
  showRulers: true,

  // File Handling
  defaultSaveFormat: "psd",
  autoRecovery: true,
  recentFilesCount: 20,
};

export const usePreferenceStore = create<PreferenceState>()(
  persist(
    (set) => ({
      ...DEFAULT_PREFERENCES,

      updatePreference: (key, value) =>
        set((state) => ({
          ...state,
          [key]: value,
        })),

      resetPreferences: () => set(DEFAULT_PREFERENCES),
    }),
    {
      name: "designbox-preferences",
      version: 1,
    }
  )
);
