import { create } from "zustand";

export type ShortcutAction =
  | "undo"
  | "redo"
  | "save"
  | "export"
  | "fit"
  | "zoomIn"
  | "zoomOut"
  | "actual"
  | "toggleGrid"
  | "toggleGuides"
  | "togglePanels"
  | "newProject"
  | "openPreferences"
  | "openShortcutEditor"
  | "toolMove"
  | "toolSelect"
  | "toolLasso"
  | "toolMagicWand"
  | "toolCrop"
  | "toolBrush"
  | "toolEraser"
  | "toolFill"
  | "toolEyedropper"
  | "toolText"
  | "toolShape"
  | "toolClone"
  | "toolPen";

export type ShortcutsMap = Record<ShortcutAction, string>;

const defaultShortcuts: ShortcutsMap = {
  undo: "ctrl+z,meta+z",
  redo: "ctrl+shift+z,meta+shift+z,ctrl+y,meta+y",
  save: "ctrl+s,meta+s",
  export: "ctrl+shift+e,meta+shift+e",
  fit: "ctrl+0,meta+0",
  zoomIn: "ctrl+plus,ctrl+=,meta+plus,meta+=",
  zoomOut: "ctrl+-,meta+-",
  actual: "ctrl+1,meta+1",
  toggleGrid: "ctrl+',meta+'",
  toggleGuides: "ctrl+;,meta+;",
  togglePanels: "tab",
  newProject: "ctrl+n,meta+n",
  openPreferences: "ctrl+k,meta+k",
  openShortcutEditor: "f1",
  toolMove: "v",
  toolSelect: "m",
  toolLasso: "l",
  toolMagicWand: "w",
  toolCrop: "c",
  toolBrush: "b",
  toolEraser: "e",
  toolFill: "g",
  toolEyedropper: "i",
  toolText: "t",
  toolShape: "u",
  toolClone: "s",
  toolPen: "p",
};

interface ShortcutsState {
  shortcuts: ShortcutsMap;
  setShortcut: (action: ShortcutAction, value: string) => void;
  resetShortcuts: () => void;
}

export const useShortcutsStore = create<ShortcutsState>((set) => ({
  shortcuts: (() => {
    const raw = localStorage.getItem("designbox_shortcuts");
    if (!raw) return defaultShortcuts;
    try {
      const parsed = JSON.parse(raw) as Partial<ShortcutsMap>;
      return { ...defaultShortcuts, ...parsed };
    } catch {
      return defaultShortcuts;
    }
  })(),
  setShortcut: (action, value) =>
    set((state) => {
      const next = { ...state.shortcuts, [action]: value };
      localStorage.setItem("designbox_shortcuts", JSON.stringify(next));
      return { shortcuts: next };
    }),
  resetShortcuts: () => {
    localStorage.setItem("designbox_shortcuts", JSON.stringify(defaultShortcuts));
    set({ shortcuts: defaultShortcuts });
  },
}));
