import { useRef, useState } from "react";

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

  const menuClass = "rounded px-2 py-1 text-sm text-slate-200 hover:bg-slate-700";

  return (
    <div className="panel flex h-10 items-center justify-between px-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <img src="/designbox-logo.svg" alt="DesignBox" className="h-6 w-6 rounded" />
          <div className="leading-tight">
            <div className="text-sm font-semibold text-indigo-300">DesignBox</div>
            <div className="text-[10px] text-slate-400">Design Without Limits</div>
          </div>
        </div>
        <div className="relative">
          <button className={menuClass} onClick={() => setOpenMenu((v) => (v === "file" ? null : "file"))}>File</button>
          {openMenu === "file" && (
            <div className="surface absolute left-0 top-8 z-20 w-44 rounded-md p-1">
              <button className={menuClass} onClick={onNew}>New</button>
              <button className={menuClass} onClick={() => inputRef.current?.click()}>Open</button>
              <button className={menuClass} onClick={onSave}>Save</button>
              <button className={menuClass} onClick={onSaveAs}>Save As</button>
              <button className={menuClass} onClick={onExport}>Export</button>
            </div>
          )}
        </div>
        <div className="relative">
          <button className={menuClass} onClick={() => setOpenMenu((v) => (v === "edit" ? null : "edit"))}>Edit</button>
          {openMenu === "edit" && (
            <div className="surface absolute left-0 top-8 z-20 w-44 rounded-md p-1">
              <button className={menuClass} onClick={onUndo}>Undo</button>
              <button className={menuClass} onClick={onRedo}>Redo</button>
              <button className={menuClass} onClick={onOpenShortcuts}>Keyboard Shortcuts</button>
              <button className={menuClass} onClick={onOpenPreferences}>Preferences</button>
            </div>
          )}
        </div>
        <div className="relative">
          <button className={menuClass} onClick={() => setOpenMenu((v) => (v === "view" ? null : "view"))}>View</button>
          {openMenu === "view" && (
            <div className="surface absolute left-0 top-8 z-20 w-44 rounded-md p-1">
              <button className={menuClass} onClick={onGrid}>Toggle Grid</button>
              <button className={menuClass} onClick={onGuides}>Toggle Guides</button>
              <button className={menuClass} onClick={onClearGuides}>Clear Guides</button>
              <button className={menuClass} onClick={onToggleTheme}>Toggle Theme</button>
            </div>
          )}
        </div>
      </div>
      <span className="text-xs text-slate-400">100% browser editor</span>
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
    </div>
  );
}
