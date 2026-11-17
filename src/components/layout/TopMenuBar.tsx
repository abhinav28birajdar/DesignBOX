import { useRef, useState, useEffect } from "react";
import { fabric } from "fabric";
import { useUiStore } from "@/store/uiStore";
import { useCanvasStore } from "@/store/canvasStore";
import { useLayersStore } from "@/store/layersStore";
import { useProjectStore } from "@/store/projectStore";

interface TopMenuBarProps {
  onNew: () => void;
  onOpen: (file: File) => void;
  onSave: () => void;
  onSaveAs: () => void;
  onExport: () => void;
  onToggleTheme: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onGrid: () => void;
  onGuides: () => void;
  onClearGuides: () => void;
  onOpenShortcuts: () => void;
  onOpenPreferences: () => void;
}

export default function TopMenuBar({
  onNew,
  onOpen,
  onSave,
  onSaveAs,
  onExport,
  onToggleTheme,
  onUndo,
  onRedo,
  onGrid,
  onGuides,
  onClearGuides,
  onOpenShortcuts,
  onOpenPreferences,
}: TopMenuBarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const menuBarRef = useRef<HTMLDivElement | null>(null);

  const setModal = useUiStore((state) => state.setModal);
  const togglePanel = useUiStore((state) => state.togglePanel);
  const canvas = useCanvasStore((state) => state.canvas);
  const setZoom = useCanvasStore((state) => state.setZoom);
  const syncFromCanvas = useLayersStore((state) => state.syncFromCanvas);
  const closeTab = useProjectStore((state) => state.closeTab);
  const activeTabId = useProjectStore((state) => state.activeTabId);

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    window.addEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const close = (fn: () => void) => {
    setOpenMenu(null);
    fn();
  };

  const getActive = () => canvas?.getActiveObject();

  // Canvas / Image actions
  const rotateCanvas = (deg: number) => {
    if (!canvas) return;
    const active = getActive();
    if (active) {
      active.rotate(((active.angle || 0) + deg) % 360);
      active.setCoords();
    } else {
      canvas.forEachObject((obj) => {
        obj.rotate(((obj.angle || 0) + deg) % 360);
        obj.setCoords();
      });
    }
    canvas.renderAll();
    syncFromCanvas(canvas);
  };

  const flipH = () => {
    if (!canvas) return;
    const active = getActive();
    if (active) {
      active.set("flipX", !active.flipX);
      canvas.renderAll();
      syncFromCanvas(canvas);
    }
  };

  const flipV = () => {
    if (!canvas) return;
    const active = getActive();
    if (active) {
      active.set("flipY", !active.flipY);
      canvas.renderAll();
      syncFromCanvas(canvas);
    }
  };

  const flattenImage = () => {
    if (!canvas || canvas.getObjects().length === 0) return;
    const dataURL = canvas.toDataURL({ format: "png", multiplier: 1 });
    fabric.Image.fromURL(dataURL, (img) => {
      canvas.clear();
      canvas.add(img);
      canvas.renderAll();
      syncFromCanvas(canvas);
    });
  };

  const addBlankLayer = () => {
    if (!canvas) return;
    const rect = new fabric.Rect({
      left: canvas.getWidth() / 4,
      top: canvas.getHeight() / 4,
      width: canvas.getWidth() / 2,
      height: canvas.getHeight() / 2,
      fill: "#6366f1",
      opacity: 0.8,
      rx: 4,
      ry: 4,
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    syncFromCanvas(canvas);
  };

  const duplicateSelected = () => {
    if (!canvas) return;
    const active = getActive();
    if (!active) return;
    active.clone((cloned: fabric.Object) => {
      cloned.set({ left: (active.left || 0) + 20, top: (active.top || 0) + 20 });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
      syncFromCanvas(canvas);
    });
  };

  const deleteSelected = () => {
    if (!canvas) return;
    const active = getActive();
    if (!active) return;
    canvas.remove(active);
    canvas.discardActiveObject();
    canvas.renderAll();
    syncFromCanvas(canvas);
  };

  const groupSelected = () => {
    if (!canvas) return;
    const active = getActive();
    if (!active) return;
    if (active.type === "activeSelection") {
      (active as fabric.ActiveSelection).toGroup();
      canvas.renderAll();
      syncFromCanvas(canvas);
    }
  };

  const ungroupSelected = () => {
    if (!canvas) return;
    const active = getActive();
    if (!active) return;
    if (active.type === "group") {
      (active as fabric.Group).toActiveSelection();
      canvas.renderAll();
      syncFromCanvas(canvas);
    }
  };

  const bringToFront = () => {
    const active = getActive();
    if (active && canvas) {
      active.bringToFront();
      canvas.renderAll();
      syncFromCanvas(canvas);
    }
  };

  const sendToBack = () => {
    const active = getActive();
    if (active && canvas) {
      active.sendToBack();
      canvas.renderAll();
      syncFromCanvas(canvas);
    }
  };

  const bringForward = () => {
    const active = getActive();
    if (active && canvas) {
      active.bringForward();
      canvas.renderAll();
      syncFromCanvas(canvas);
    }
  };

  const sendBackward = () => {
    const active = getActive();
    if (active && canvas) {
      active.sendBackwards();
      canvas.renderAll();
      syncFromCanvas(canvas);
    }
  };

  const selectAll = () => {
    if (!canvas) return;
    canvas.discardActiveObject();
    const sel = new fabric.ActiveSelection(canvas.getObjects(), { canvas });
    canvas.setActiveObject(sel);
    canvas.renderAll();
  };

  const deselectAll = () => {
    if (!canvas) return;
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  const menuItemClass =
    "flex items-center justify-between w-full px-3 py-1.5 text-xs text-slate-200 hover:bg-indigo-600 hover:text-white rounded transition text-left";
  const shortcutClass = "text-[10px] text-slate-400 font-mono ml-4";
  const topBtnClass =
    "px-2.5 py-1 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded transition font-medium";

  return (
    <header
      ref={menuBarRef}
      className="panel flex h-10 items-center justify-between px-3 bg-[#0A0F1E] border-b border-[#2D3748] relative z-40 select-none"
    >
      <div className="flex items-center gap-1.5">
        {/* Brand Monogram & Name */}
        <div className="flex items-center gap-2 pr-3 border-r border-slate-800 mr-1">
          <div className="w-6 h-6 rounded bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white text-[10px] font-black shadow-sm shadow-indigo-500/30">
            DB
          </div>
          <div className="leading-tight hidden sm:block">
            <span className="text-xs font-bold text-white tracking-wide">DesignBox</span>
          </div>
        </div>

        {/* File Menu */}
        <div className="relative">
          <button
            className={`${topBtnClass} ${openMenu === "file" ? "bg-slate-800 text-white" : ""}`}
            onClick={() => setOpenMenu((v) => (v === "file" ? null : "file"))}
          >
            File
          </button>
          {openMenu === "file" && (
            <div className="absolute left-0 top-8 z-50 w-56 rounded-lg p-1.5 bg-[#111827] border border-[#2D3748] shadow-2xl">
              <button className={menuItemClass} onClick={() => close(onNew)}>
                <span>New Project...</span>
                <span className={shortcutClass}>Ctrl+N</span>
              </button>
              <button className={menuItemClass} onClick={() => close(() => inputRef.current?.click())}>
                <span>Open File...</span>
                <span className={shortcutClass}>Ctrl+O</span>
              </button>
              <div className="h-px bg-slate-800 my-1" />
              <button className={menuItemClass} onClick={() => close(onSave)}>
                <span>Save (.designbox)</span>
                <span className={shortcutClass}>Ctrl+S</span>
              </button>
              <button className={menuItemClass} onClick={() => close(onSaveAs)}>
                <span>Save As...</span>
                <span className={shortcutClass}>Ctrl+Shift+S</span>
              </button>
              <div className="h-px bg-slate-800 my-1" />
              <button className={menuItemClass} onClick={() => close(onExport)}>
                <span>Export As...</span>
                <span className={shortcutClass}>Ctrl+Shift+E</span>
              </button>
              <button className={menuItemClass} onClick={() => close(() => setModal("print", true))}>
                <span>Print Document...</span>
                <span className={shortcutClass}>Ctrl+P</span>
              </button>
              <div className="h-px bg-slate-800 my-1" />
              <button
                className={menuItemClass}
                onClick={() => {
                  if (activeTabId) closeTab(activeTabId);
                  setOpenMenu(null);
                }}
              >
                <span>Close Tab</span>
                <span className={shortcutClass}>Ctrl+W</span>
              </button>
            </div>
          )}
        </div>

        {/* Edit Menu */}
        <div className="relative">
          <button
            className={`${topBtnClass} ${openMenu === "edit" ? "bg-slate-800 text-white" : ""}`}
            onClick={() => setOpenMenu((v) => (v === "edit" ? null : "edit"))}
          >
            Edit
          </button>
          {openMenu === "edit" && (
            <div className="absolute left-0 top-8 z-50 w-56 rounded-lg p-1.5 bg-[#111827] border border-[#2D3748] shadow-2xl">
              <button className={menuItemClass} onClick={() => close(onUndo)}>
                <span>Undo</span>
                <span className={shortcutClass}>Ctrl+Z</span>
              </button>
              <button className={menuItemClass} onClick={() => close(onRedo)}>
                <span>Redo</span>
                <span className={shortcutClass}>Ctrl+Shift+Z</span>
              </button>
              <div className="h-px bg-slate-800 my-1" />
              <button className={menuItemClass} onClick={() => close(duplicateSelected)}>
                <span>Duplicate</span>
                <span className={shortcutClass}>Ctrl+J</span>
              </button>
              <button className={menuItemClass} onClick={() => close(deleteSelected)}>
                <span>Delete</span>
                <span className={shortcutClass}>Del</span>
              </button>
              <button className={menuItemClass} onClick={() => close(selectAll)}>
                <span>Select All</span>
                <span className={shortcutClass}>Ctrl+A</span>
              </button>
              <button className={menuItemClass} onClick={() => close(deselectAll)}>
                <span>Deselect</span>
                <span className={shortcutClass}>Ctrl+D</span>
              </button>
              <div className="h-px bg-slate-800 my-1" />
              <button className={menuItemClass} onClick={() => close(() => setModal("findReplace", true))}>
                <span>Find & Replace...</span>
                <span className={shortcutClass}>Ctrl+H</span>
              </button>
              <button className={menuItemClass} onClick={() => close(onOpenShortcuts)}>
                <span>Keyboard Shortcuts...</span>
                <span className={shortcutClass}>F1</span>
              </button>
              <button className={menuItemClass} onClick={() => close(onOpenPreferences)}>
                <span>Preferences...</span>
                <span className={shortcutClass}>Ctrl+K</span>
              </button>
            </div>
          )}
        </div>

        {/* Image Menu */}
        <div className="relative">
          <button
            className={`${topBtnClass} ${openMenu === "image" ? "bg-slate-800 text-white" : ""}`}
            onClick={() => setOpenMenu((v) => (v === "image" ? null : "image"))}
          >
            Image
          </button>
          {openMenu === "image" && (
            <div className="absolute left-0 top-8 z-50 w-56 rounded-lg p-1.5 bg-[#111827] border border-[#2D3748] shadow-2xl">
              <button className={menuItemClass} onClick={() => close(() => setModal("canvasSize", true))}>
                <span>Canvas Size...</span>
              </button>
              <div className="h-px bg-slate-800 my-1" />
              <button className={menuItemClass} onClick={() => close(() => rotateCanvas(90))}>
                <span>Rotate 90° CW</span>
              </button>
              <button className={menuItemClass} onClick={() => close(() => rotateCanvas(-90))}>
                <span>Rotate 90° CCW</span>
              </button>
              <button className={menuItemClass} onClick={() => close(() => rotateCanvas(180))}>
                <span>Rotate 180°</span>
              </button>
              <button className={menuItemClass} onClick={() => close(flipH)}>
                <span>Flip Horizontal</span>
              </button>
              <button className={menuItemClass} onClick={() => close(flipV)}>
                <span>Flip Vertical</span>
              </button>
              <div className="h-px bg-slate-800 my-1" />
              <button className={menuItemClass} onClick={() => close(flattenImage)}>
                <span>Flatten Image</span>
              </button>
            </div>
          )}
        </div>

        {/* Layer Menu */}
        <div className="relative">
          <button
            className={`${topBtnClass} ${openMenu === "layer" ? "bg-slate-800 text-white" : ""}`}
            onClick={() => setOpenMenu((v) => (v === "layer" ? null : "layer"))}
          >
            Layer
          </button>
          {openMenu === "layer" && (
            <div className="absolute left-0 top-8 z-50 w-56 rounded-lg p-1.5 bg-[#111827] border border-[#2D3748] shadow-2xl">
              <button className={menuItemClass} onClick={() => close(addBlankLayer)}>
                <span>New Layer</span>
                <span className={shortcutClass}>Ctrl+Shift+N</span>
              </button>
              <button className={menuItemClass} onClick={() => close(duplicateSelected)}>
                <span>Duplicate Layer</span>
                <span className={shortcutClass}>Ctrl+J</span>
              </button>
              <button className={menuItemClass} onClick={() => close(deleteSelected)}>
                <span>Delete Layer</span>
                <span className={shortcutClass}>Del</span>
              </button>
              <div className="h-px bg-slate-800 my-1" />
              <button className={menuItemClass} onClick={() => close(groupSelected)}>
                <span>Group Layers</span>
                <span className={shortcutClass}>Ctrl+G</span>
              </button>
              <button className={menuItemClass} onClick={() => close(ungroupSelected)}>
                <span>Ungroup Layers</span>
                <span className={shortcutClass}>Ctrl+Shift+G</span>
              </button>
              <div className="h-px bg-slate-800 my-1" />
              <button className={menuItemClass} onClick={() => close(bringToFront)}>
                <span>Bring to Front</span>
                <span className={shortcutClass}>Ctrl+Shift+]</span>
              </button>
              <button className={menuItemClass} onClick={() => close(bringForward)}>
                <span>Bring Forward</span>
                <span className={shortcutClass}>Alt+]</span>
              </button>
              <button className={menuItemClass} onClick={() => close(sendBackward)}>
                <span>Send Backward</span>
                <span className={shortcutClass}>Alt+[</span>
              </button>
              <button className={menuItemClass} onClick={() => close(sendToBack)}>
                <span>Send to Back</span>
                <span className={shortcutClass}>Ctrl+Shift+[</span>
              </button>
              <div className="h-px bg-slate-800 my-1" />
              <button className={menuItemClass} onClick={() => close(() => setModal("layerStyle", true))}>
                <span>Layer Style...</span>
              </button>
            </div>
          )}
        </div>

        {/* Select Menu */}
        <div className="relative">
          <button
            className={`${topBtnClass} ${openMenu === "select" ? "bg-slate-800 text-white" : ""}`}
            onClick={() => setOpenMenu((v) => (v === "select" ? null : "select"))}
          >
            Select
          </button>
          {openMenu === "select" && (
            <div className="absolute left-0 top-8 z-50 w-56 rounded-lg p-1.5 bg-[#111827] border border-[#2D3748] shadow-2xl">
              <button className={menuItemClass} onClick={() => close(selectAll)}>
                <span>All</span>
                <span className={shortcutClass}>Ctrl+A</span>
              </button>
              <button className={menuItemClass} onClick={() => close(deselectAll)}>
                <span>Deselect</span>
                <span className={shortcutClass}>Ctrl+D</span>
              </button>
              <div className="h-px bg-slate-800 my-1" />
              <button className={menuItemClass} onClick={() => close(() => setModal("refineEdge", true))}>
                <span>Smart Select & Refine Edge...</span>
              </button>
            </div>
          )}
        </div>

        {/* Filter Menu */}
        <div className="relative">
          <button
            className={`${topBtnClass} ${openMenu === "filter" ? "bg-slate-800 text-white" : ""}`}
            onClick={() => setOpenMenu((v) => (v === "filter" ? null : "filter"))}
          >
            Filter
          </button>
          {openMenu === "filter" && (
            <div className="absolute left-0 top-8 z-50 w-56 rounded-lg p-1.5 bg-[#111827] border border-[#2D3748] shadow-2xl">
              <button className={menuItemClass} onClick={() => close(() => setModal("distort", true))}>
                <span>Distort & Render Filters...</span>
              </button>
            </div>
          )}
        </div>

        {/* View Menu */}
        <div className="relative">
          <button
            className={`${topBtnClass} ${openMenu === "view" ? "bg-slate-800 text-white" : ""}`}
            onClick={() => setOpenMenu((v) => (v === "view" ? null : "view"))}
          >
            View
          </button>
          {openMenu === "view" && (
            <div className="absolute left-0 top-8 z-50 w-56 rounded-lg p-1.5 bg-[#111827] border border-[#2D3748] shadow-2xl">
              <button className={menuItemClass} onClick={() => close(() => setZoom(useCanvasStore.getState().zoom + 15))}>
                <span>Zoom In</span>
                <span className={shortcutClass}>Ctrl++</span>
              </button>
              <button className={menuItemClass} onClick={() => close(() => setZoom(Math.max(10, useCanvasStore.getState().zoom - 15)))}>
                <span>Zoom Out</span>
                <span className={shortcutClass}>Ctrl+-</span>
              </button>
              <button className={menuItemClass} onClick={() => close(() => setZoom(100))}>
                <span>100% (Actual Size)</span>
                <span className={shortcutClass}>Ctrl+1</span>
              </button>
              <div className="h-px bg-slate-800 my-1" />
              <button className={menuItemClass} onClick={() => close(onGrid)}>
                <span>Toggle Grid</span>
                <span className={shortcutClass}>Ctrl+'</span>
              </button>
              <button className={menuItemClass} onClick={() => close(onGuides)}>
                <span>Toggle Guides</span>
                <span className={shortcutClass}>Ctrl+;</span>
              </button>
              <button className={menuItemClass} onClick={() => close(onClearGuides)}>
                <span>Clear Guides</span>
              </button>
              <div className="h-px bg-slate-800 my-1" />
              <button className={menuItemClass} onClick={() => close(() => togglePanel("animation"))}>
                <span>Animation Timeline</span>
              </button>
              <button className={menuItemClass} onClick={() => close(() => setModal("breakpoints", true))}>
                <span>Responsive Breakpoints...</span>
              </button>
              <div className="h-px bg-slate-800 my-1" />
              <button className={menuItemClass} onClick={() => close(onToggleTheme)}>
                <span>Toggle Light/Dark Theme</span>
              </button>
            </div>
          )}
        </div>

        {/* Help Menu */}
        <div className="relative">
          <button
            className={`${topBtnClass} ${openMenu === "help" ? "bg-slate-800 text-white" : ""}`}
            onClick={() => setOpenMenu((v) => (v === "help" ? null : "help"))}
          >
            Help
          </button>
          {openMenu === "help" && (
            <div className="absolute left-0 top-8 z-50 w-56 rounded-lg p-1.5 bg-[#111827] border border-[#2D3748] shadow-2xl">
              <button className={menuItemClass} onClick={() => close(onOpenShortcuts)}>
                <span>Keyboard Shortcuts</span>
                <span className={shortcutClass}>F1</span>
              </button>
              <button className={menuItemClass} onClick={() => close(() => setModal("about", true))}>
                <span>About DesignBox...</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleTheme}
          title="Toggle Theme"
          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition text-xs"
        >
          🌓
        </button>
        <button
          onClick={onExport}
          className="rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3 py-1 text-xs transition shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <span>Export</span>
          <span className="text-[10px] opacity-75">▼</span>
        </button>
      </div>

      {/* Hidden File Input for Opening Images/Projects */}
      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept="image/*,.designbox,.json"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onOpen(file);
          event.target.value = "";
        }}
      />
    </header>
  );
}
