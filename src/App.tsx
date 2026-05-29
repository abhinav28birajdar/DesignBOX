import { useEffect } from "react";
import CanvasEngine from "@/canvas/CanvasEngine";
import SelectionManager from "@/canvas/SelectionManager";
import TopMenuBar from "@/components/layout/TopMenuBar";
import LeftToolbar from "@/components/layout/LeftToolbar";
import RightPanel from "@/components/layout/RightPanel";
import BottomStatusBar from "@/components/layout/BottomStatusBar";
import OptionsBar from "@/components/layout/OptionsBar";
import SplashScreen from "@/components/layout/SplashScreen";
import NewProjectModal from "@/components/modals/NewProjectModal";
import ExportModal from "@/components/modals/ExportModal";
import FontPickerModal from "@/components/modals/FontPickerModal";
import KeyboardShortcutsModal from "@/components/modals/KeyboardShortcutsModal";
import PreferencesModal from "@/components/modals/PreferencesModal";
import FindReplaceModal from "@/components/modals/FindReplaceModalNew";
import { AnimationTimelinePanel } from "@/components/panels/AnimationTimelinePanel";
import { useUiStore } from "@/store/uiStore";
import { useProjectStore } from "@/store/projectStore";
import { useCanvasStore } from "@/store/canvasStore";
import { useFileHandler } from "@/hooks/useFileHandler";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useHistory } from "@/hooks/useHistory";
import { useLayersStore } from "@/store/layersStore";
import type { fabric } from "fabric";
import type { ProjectTab } from "@/types";
import { useState } from "react";
import ContextMenu from "@/components/overlays/ContextMenu";
import HomePage from "@/pages/HomePage";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isOnHomePage, setIsOnHomePage] = useState(true);

  const theme = useUiStore((state) => state.theme);
  const setTheme = useUiStore((state) => state.setTheme);
  const openExportModal = useUiStore((state) => state.openExportModal);
  const openFontModal = useUiStore((state) => state.openFontModal);
  const openNewProjectModal = useUiStore((state) => state.openNewProjectModal);
  const openShortcutsModal = useUiStore((state) => state.openShortcutsModal);
  const openPreferencesModal = useUiStore((state) => state.openPreferencesModal);
  const openFindReplaceModal = useUiStore((state) => state.openFindReplaceModal);
  const showAnimationTimeline = useUiStore((state) => state.showAnimationTimeline);
  const setModal = useUiStore((state) => state.setModal);
  const togglePanel = useUiStore((state) => state.togglePanel);

  const tabs = useProjectStore((state) => state.tabs);
  const activeTabId = useProjectStore((state) => state.activeTabId);
  const openTab = useProjectStore((state) => state.openTab);
  const closeTab = useProjectStore((state) => state.closeTab);
  const setActiveTab = useProjectStore((state) => state.setActiveTab);

  const canvas = useCanvasStore((state) => state.canvas);
  const setZoom = useCanvasStore((state) => state.setZoom);
  const toggleGrid = useCanvasStore((state) => state.toggleGrid);
  const toggleGuidesVisible = useCanvasStore((state) => state.toggleGuidesVisible);
  const clearGuides = useCanvasStore((state) => state.clearGuides);
  const syncFromCanvas = useLayersStore((state) => state.syncFromCanvas);

  const { openImage, openProjectJson, saveProject, saveAsProject } = useFileHandler();
  const { undo, redo } = useHistory();
  useAutoSave();

  useEffect(() => {
    const timeout = window.setTimeout(() => setShowSplash(false), 850);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
  }, [theme]);

  const handleNewProject = (tab: ProjectTab) => {
    openTab(tab);
    setIsOnHomePage(false);
  };

  const handleOpenProject = (id: string) => {
    setActiveTab(id);
    setIsOnHomePage(false);
  };

  const handleBackToHome = () => {
    setIsOnHomePage(true);
  };

  const activeTab = tabs.find((tab) => tab.id === activeTabId) || tabs[0];

  useKeyboardShortcuts({
    undo,
    redo,
    save: saveProject,
    exportOpen: () => setModal("export", true),
    deleteSelected: () => {
      if (!canvas) return;
      const active = canvas.getActiveObject();
      if (!active) return;
      canvas.remove(active);
      canvas.discardActiveObject();
      canvas.renderAll();
      syncFromCanvas(canvas);
    },
    fit: () => setZoom(100),
    zoomIn: () => setZoom(useCanvasStore.getState().zoom + 10),
    zoomOut: () => setZoom(useCanvasStore.getState().zoom - 10),
    actual: () => setZoom(100),
    toggleGrid,
    toggleGuides: toggleGuidesVisible,
    togglePanels: () => {
      togglePanel("layers");
      togglePanel("properties");
      togglePanel("adjustments");
    },
    newProject: () => setModal("newProject", true),
    openPreferences: () => setModal("preferences", true),
    openShortcutEditor: () => setModal("shortcuts", true),
  });

  const openAny = async (file: File) => {
    if (file.name.endsWith(".designbox") || file.name.endsWith(".json")) {
      await openProjectJson(file);
      setIsOnHomePage(false);
      return;
    }
    await openImage(file);
    setIsOnHomePage(false);
  };

  if (showSplash) {
    return <SplashScreen visible={true} />;
  }

  if (isOnHomePage) {
    return (
      <div className={`h-screen w-screen ${theme}`}>
        <HomePage onNewProject={handleNewProject} onOpenProject={handleOpenProject} />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <TopMenuBar
        onNew={() => setModal("newProject", true)}
        onOpen={openAny}
        onSave={saveProject}
        onSaveAs={saveAsProject}
        onExport={() => setModal("export", true)}
        onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
        onUndo={undo}
        onRedo={redo}
        onGrid={toggleGrid}
        onGuides={toggleGuidesVisible}
        onClearGuides={clearGuides}
        onOpenShortcuts={() => setModal("shortcuts", true)}
        onOpenPreferences={() => setModal("preferences", true)}
      />

      <div className="panel flex h-9 items-center gap-1 overflow-auto px-2">
        <button
          onClick={handleBackToHome}
          className="rounded bg-slate-700 px-2 py-1 text-xs hover:bg-slate-600 mr-2"
          title="Back to Home"
        >
          ⌂ Home
        </button>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex items-center gap-2 rounded px-3 py-1 text-xs ${tab.id === activeTabId ? "bg-indigo-600" : "bg-slate-700"}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.name}{tab.modified ? " *" : ""}</span>
            <span
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
            >
              x
            </span>
          </button>
        ))}
        <button className="rounded bg-slate-700 px-2 py-1 text-xs" onClick={() => setModal("newProject", true)}>
          +
        </button>
      </div>

      <OptionsBar />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <LeftToolbar />
        <div className="flex-1 relative overflow-hidden">
          {activeTab ? <CanvasEngine width={activeTab.width} height={activeTab.height} /> : null}
          <SelectionManager />
          <ContextMenu />
        </div>
        <RightPanel />
      </div>

      <BottomStatusBar />

      <NewProjectModal
        open={openNewProjectModal}
        onClose={() => setModal("newProject", false)}
      />

      <ExportModal
        open={openExportModal}
        onClose={() => setModal("export", false)}
      />

      <FontPickerModal
        open={openFontModal}
        onClose={() => setModal("font", false)}
        onSelect={(font) => {
          if (!canvas) return;
          const active = canvas.getActiveObject();
          if (active && (active.type === "textbox" || active.type === "text")) {
            (active as fabric.Textbox).set("fontFamily", font);
            canvas.renderAll();
          }
        }}
      />

      <KeyboardShortcutsModal open={openShortcutsModal} onClose={() => setModal("shortcuts", false)} />
      <PreferencesModal open={openPreferencesModal} onClose={() => setModal("preferences", false)} />
      <FindReplaceModal isOpen={openFindReplaceModal} onClose={() => setModal("findReplace", false)} />

      {showAnimationTimeline && (
        <div className="fixed bottom-0 left-64 right-80 h-64 bg-[#111827] border-t border-[#2D3748] overflow-hidden">
          <AnimationTimelinePanel />
        </div>
      )}
    </div>
  );
}
