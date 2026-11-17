import { useState } from "react";
import { useCanvasStore } from "@/store/canvasStore";
import { useUiStore } from "@/store/uiStore";
import { useToolStore } from "@/store/toolStore";

interface PreferencesModalProps {
  open: boolean;
  onClose: () => void;
}

type Tab = "general" | "appearance" | "tools" | "guides" | "performance" | "about";

export default function PreferencesModal({ open, onClose }: PreferencesModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("general");

  const gridSize = useCanvasStore((state) => state.gridSize);
  const setGridSize = useCanvasStore((state) => state.setGridSize);
  const snapToGrid = useCanvasStore((state) => state.snapToGrid);
  const snapToGuides = useCanvasStore((state) => state.snapToGuides);
  const toggleSnapToGrid = useCanvasStore((state) => state.toggleSnapToGrid);
  const toggleSnapToGuides = useCanvasStore((state) => state.toggleSnapToGuides);
  const guideSnapThreshold = useCanvasStore((state) => state.guideSnapThreshold);
  const setGuideSnapThreshold = useCanvasStore((state) => state.setGuideSnapThreshold);

  const theme = useUiStore((state) => state.theme);
  const setTheme = useUiStore((state) => state.setTheme);

  const options = useToolStore((state) => state.options);
  const patchOptions = useToolStore((state) => state.patchOptions);

  const [unit, setUnit] = useState("px");
  const [autoSaveInterval, setAutoSaveInterval] = useState("60");
  const [historyStates, setHistoryStates] = useState("50");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4">
      <div className="panel w-[640px] max-w-[95vw] h-[480px] flex flex-col rounded-xl bg-[#111827] border border-[#2D3748] shadow-2xl overflow-hidden text-slate-200">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#2D3748] bg-[#0A0F1E]">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <span>⚙️</span> Preferences
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-base">✕</button>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Sidebar Tabs */}
          <div className="w-44 bg-[#0A0F1E] border-r border-[#2D3748] p-2 space-y-1">
            {[
              { id: "general", label: "General", icon: "🛠" },
              { id: "appearance", label: "Appearance", icon: "🎨" },
              { id: "tools", label: "Tools", icon: "🖌" },
              { id: "guides", label: "Guides & Grid", icon: "📐" },
              { id: "performance", label: "Auto-Save & Cache", icon: "⚡" },
              { id: "about", label: "About", icon: "ℹ️" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded text-xs transition ${
                  activeTab === item.id
                    ? "bg-indigo-600 text-white font-medium"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-5 text-xs space-y-4">
            {activeTab === "general" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-1">General Settings</h3>
                <div>
                  <label className="block text-slate-400 mb-1">Ruler Units</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full rounded bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs text-white"
                  >
                    <option value="px">Pixels (px)</option>
                    <option value="cm">Centimeters (cm)</option>
                    <option value="mm">Millimeters (mm)</option>
                    <option value="in">Inches (in)</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded accent-indigo-500" />
                  <span>Show Tooltips on hover</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded accent-indigo-500" />
                  <span>Zoom with mouse scroll wheel</span>
                </label>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-1">Appearance & Theme</h3>
                <div>
                  <label className="block text-slate-400 mb-2">Theme</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setTheme("dark")}
                      className={`flex-1 p-3 rounded-lg border text-center transition ${
                        theme === "dark" ? "border-indigo-500 bg-indigo-950/40 text-white font-semibold" : "border-slate-700 bg-slate-900 text-slate-400"
                      }`}
                    >
                      🌙 Dark Mode (Default)
                    </button>
                    <button
                      onClick={() => setTheme("light")}
                      className={`flex-1 p-3 rounded-lg border text-center transition ${
                        theme === "light" ? "border-indigo-500 bg-indigo-950/40 text-white font-semibold" : "border-slate-700 bg-slate-900 text-slate-400"
                      }`}
                    >
                      ☀️ Light Mode
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "tools" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-1">Default Tool Settings</h3>
                <div>
                  <label className="block text-slate-400 mb-1">Default Brush Size: {options.brushSize}px</label>
                  <input
                    type="range"
                    min={1}
                    max={200}
                    value={options.brushSize}
                    onChange={(e) => patchOptions({ brushSize: Number(e.target.value) })}
                    className="w-full accent-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Magic Wand Tolerance: {options.tolerance}</label>
                  <input
                    type="range"
                    min={0}
                    max={255}
                    value={options.tolerance}
                    onChange={(e) => patchOptions({ tolerance: Number(e.target.value) })}
                    className="w-full accent-indigo-500"
                  />
                </div>
              </div>
            )}

            {activeTab === "guides" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-1">Guides, Grid & Snapping</h3>
                <div>
                  <label className="block text-slate-400 mb-1">Grid Size (px)</label>
                  <input
                    type="number"
                    min={2}
                    max={100}
                    value={gridSize}
                    onChange={(e) => setGridSize(Number(e.target.value))}
                    className="w-full rounded bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <label className="flex items-center justify-between rounded bg-slate-900/60 p-2.5 border border-slate-800">
                  <span>Snap to Grid</span>
                  <input type="checkbox" checked={snapToGrid} onChange={toggleSnapToGrid} className="rounded accent-indigo-500" />
                </label>
                <label className="flex items-center justify-between rounded bg-slate-900/60 p-2.5 border border-slate-800">
                  <span>Snap to Guides</span>
                  <input type="checkbox" checked={snapToGuides} onChange={toggleSnapToGuides} className="rounded accent-indigo-500" />
                </label>
                <div>
                  <label className="block text-slate-400 mb-1">Snap Threshold ({guideSnapThreshold}px)</label>
                  <input
                    type="range"
                    min={1}
                    max={25}
                    value={guideSnapThreshold}
                    onChange={(e) => setGuideSnapThreshold(Number(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>
              </div>
            )}

            {activeTab === "performance" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-1">Auto-Save & Performance</h3>
                <div>
                  <label className="block text-slate-400 mb-1">Auto-Save Interval</label>
                  <select
                    value={autoSaveInterval}
                    onChange={(e) => setAutoSaveInterval(e.target.value)}
                    className="w-full rounded bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs text-white"
                  >
                    <option value="30">Every 30 seconds</option>
                    <option value="60">Every 60 seconds (Recommended)</option>
                    <option value="300">Every 5 minutes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">History Undo/Redo States</label>
                  <select
                    value={historyStates}
                    onChange={(e) => setHistoryStates(e.target.value)}
                    className="w-full rounded bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs text-white"
                  >
                    <option value="30">30 states</option>
                    <option value="50">50 states (Balanced)</option>
                    <option value="100">100 states (High RAM)</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded accent-indigo-500" />
                  <span>Use Web Workers for Pixel Adjustments</span>
                </label>
              </div>
            )}

            {activeTab === "about" && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-lg">
                    DB
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">DesignBox</h4>
                    <p className="text-xs text-indigo-400">Design Without Limits</p>
                  </div>
                </div>
                <p className="text-slate-400 leading-relaxed text-xs">
                  Version 1.0.0. A 100% browser-based photo & graphic design editor. No cloud backend, no subscriptions. Everything runs locally in your browser.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end px-5 py-3 border-t border-[#2D3748] bg-[#0A0F1E]">
          <button
            onClick={onClose}
            className="rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-1.5 text-xs transition shadow-md shadow-indigo-600/30"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
