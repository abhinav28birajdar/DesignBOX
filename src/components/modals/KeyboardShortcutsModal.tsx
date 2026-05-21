import { useMemo } from "react";
import { useShortcutsStore, type ShortcutAction } from "@/store/shortcutsStore";

interface KeyboardShortcutsModalProps {
  open: boolean;
  onClose: () => void;
}

const labels: Record<ShortcutAction, string> = {
  undo: "Undo",
  redo: "Redo",
  save: "Save",
  export: "Export",
  fit: "Fit To Screen",
  zoomIn: "Zoom In",
  zoomOut: "Zoom Out",
  actual: "100% Zoom",
  toggleGrid: "Toggle Grid",
  toggleGuides: "Toggle Guides",
  togglePanels: "Toggle Panels",
  newProject: "New Project",
  openPreferences: "Open Preferences",
  openShortcutEditor: "Open Shortcut Editor",
  toolMove: "Move Tool",
  toolSelect: "Select Tool",
  toolLasso: "Lasso Tool",
  toolMagicWand: "Magic Wand Tool",
  toolCrop: "Crop Tool",
  toolBrush: "Brush Tool",
  toolEraser: "Eraser Tool",
  toolFill: "Fill Tool",
  toolEyedropper: "Eyedropper Tool",
  toolText: "Text Tool",
  toolShape: "Shape Tool",
  toolClone: "Clone Tool",
  toolPen: "Pen Tool",
};

export default function KeyboardShortcutsModal({ open, onClose }: KeyboardShortcutsModalProps) {
  const shortcuts = useShortcutsStore((state) => state.shortcuts);
  const setShortcut = useShortcutsStore((state) => state.setShortcut);
  const resetShortcuts = useShortcutsStore((state) => state.resetShortcuts);

  const actions = useMemo(() => Object.keys(shortcuts) as ShortcutAction[], [shortcuts]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
      <div className="panel w-[720px] max-w-[95vw] rounded-md p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
          <button className="rounded bg-slate-700 px-3 py-1 text-sm" onClick={onClose}>Close</button>
        </div>

        <div className="grid max-h-[60vh] grid-cols-1 gap-2 overflow-auto pr-1 text-sm md:grid-cols-2">
          {actions.map((action) => (
            <label key={action} className="surface flex items-center justify-between rounded px-2 py-2">
              <span className="text-slate-300">{labels[action]}</span>
              <input
                value={shortcuts[action]}
                onChange={(event) => setShortcut(action, event.target.value)}
                className="w-52 rounded bg-slate-900 px-2 py-1 text-xs text-slate-100"
              />
            </label>
          ))}
        </div>

        <div className="mt-3 flex justify-end gap-2">
          <button className="rounded bg-slate-700 px-3 py-1 text-sm" onClick={resetShortcuts}>Reset Defaults</button>
          <button className="rounded bg-indigo-600 px-3 py-1 text-sm" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}
