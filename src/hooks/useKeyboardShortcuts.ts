import { useHotkeys } from "react-hotkeys-hook";
import { useToolStore } from "@/store/toolStore";
import { useShortcutsStore } from "@/store/shortcutsStore";

export const useKeyboardShortcuts = (
  actions: {
    undo: () => void;
    redo: () => void;
    save: () => void;
    exportOpen: () => void;
    deleteSelected: () => void;
    fit: () => void;
    zoomIn: () => void;
    zoomOut: () => void;
    actual: () => void;
    toggleGrid: () => void;
    toggleGuides: () => void;
    togglePanels: () => void;
    newProject: () => void;
    openPreferences: () => void;
    openShortcutEditor: () => void;
  }
): void => {
  const setTool = useToolStore((state) => state.setTool);
  const shortcuts = useShortcutsStore((state) => state.shortcuts);

  const opts = { enableOnFormTags: false, preventDefault: true } as const;

  useHotkeys(shortcuts.undo, actions.undo, opts, [actions.undo, shortcuts.undo]);
  useHotkeys(shortcuts.redo, actions.redo, opts, [actions.redo, shortcuts.redo]);
  useHotkeys(shortcuts.save, actions.save, opts, [actions.save, shortcuts.save]);
  useHotkeys(shortcuts.export, actions.exportOpen, opts, [actions.exportOpen, shortcuts.export]);
  useHotkeys(shortcuts.fit, actions.fit, opts, [actions.fit, shortcuts.fit]);
  useHotkeys(shortcuts.zoomIn, actions.zoomIn, opts, [actions.zoomIn, shortcuts.zoomIn]);
  useHotkeys(shortcuts.zoomOut, actions.zoomOut, opts, [actions.zoomOut, shortcuts.zoomOut]);
  useHotkeys(shortcuts.toggleGrid, actions.toggleGrid, opts, [actions.toggleGrid, shortcuts.toggleGrid]);
  useHotkeys(shortcuts.toggleGuides, actions.toggleGuides, opts, [actions.toggleGuides, shortcuts.toggleGuides]);
  useHotkeys(shortcuts.togglePanels, actions.togglePanels, opts, [actions.togglePanels, shortcuts.togglePanels]);
  useHotkeys(shortcuts.newProject, actions.newProject, opts, [actions.newProject, shortcuts.newProject]);
  useHotkeys(shortcuts.openPreferences, actions.openPreferences, opts, [actions.openPreferences, shortcuts.openPreferences]);
  useHotkeys(shortcuts.openShortcutEditor, actions.openShortcutEditor, opts, [actions.openShortcutEditor, shortcuts.openShortcutEditor]);
  useHotkeys("delete,backspace", actions.deleteSelected, { enableOnFormTags: false }, [actions.deleteSelected]);

  useHotkeys(shortcuts.toolMove, () => setTool("move"), { enableOnFormTags: false }, [setTool, shortcuts.toolMove]);
  useHotkeys(shortcuts.toolSelect, () => setTool("select-rect"), { enableOnFormTags: false }, [setTool, shortcuts.toolSelect]);
  useHotkeys(shortcuts.toolLasso, () => setTool("lasso"), { enableOnFormTags: false }, [setTool, shortcuts.toolLasso]);
  useHotkeys(shortcuts.toolMagicWand, () => setTool("magic-wand"), { enableOnFormTags: false }, [setTool, shortcuts.toolMagicWand]);
  useHotkeys(shortcuts.toolCrop, () => setTool("crop"), { enableOnFormTags: false }, [setTool, shortcuts.toolCrop]);
  useHotkeys(shortcuts.toolBrush, () => setTool("brush"), { enableOnFormTags: false }, [setTool, shortcuts.toolBrush]);
  useHotkeys(shortcuts.toolEraser, () => setTool("eraser"), { enableOnFormTags: false }, [setTool, shortcuts.toolEraser]);
  useHotkeys(shortcuts.toolFill, () => setTool("fill"), { enableOnFormTags: false }, [setTool, shortcuts.toolFill]);
  useHotkeys(shortcuts.toolEyedropper, () => setTool("eyedropper"), { enableOnFormTags: false }, [setTool, shortcuts.toolEyedropper]);
  useHotkeys(shortcuts.toolText, () => setTool("text"), { enableOnFormTags: false }, [setTool, shortcuts.toolText]);
  useHotkeys(shortcuts.toolShape, () => setTool("shape"), { enableOnFormTags: false }, [setTool, shortcuts.toolShape]);
  useHotkeys(shortcuts.toolClone, () => setTool("clone"), { enableOnFormTags: false }, [setTool, shortcuts.toolClone]);
  useHotkeys(shortcuts.toolPen, () => setTool("pen"), { enableOnFormTags: false }, [setTool, shortcuts.toolPen]);

  useHotkeys(shortcuts.actual, actions.actual, opts, [actions.actual, shortcuts.actual]);
};
