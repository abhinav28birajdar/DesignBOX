import { useState } from "react";
import LayersPanel from "@/components/panels/LayersPanel";
import PropertiesPanel from "@/components/panels/PropertiesPanel";
import AdjustmentsPanel from "@/components/panels/AdjustmentsPanel";
import ColorPickerPanel from "@/components/panels/ColorPicker";
import GradientEditor from "@/components/panels/GradientEditor";
import HistoryPanel from "@/components/panels/HistoryPanel";
import { AssetsPanel } from "@/components/panels/AssetsPanel";
import { NavigatorPanel } from "@/components/panels/NavigatorPanel";
import ArtboardsPanel from "@/components/panels/ArtboardsPanel";
import VectorEditorPanel from "@/components/panels/VectorEditorPanel";
import AIToolsPanel from "@/components/panels/AIToolsPanel";
import NotesPanel from "@/components/panels/NotesPanel";
import PatternsPanel from "@/components/panels/PatternsPanel";
import PluginsPanel from "@/components/panels/PluginsPanel";

type TabKey =
  | "layers"
  | "properties"
  | "adjustments"
  | "history"
  | "colors"
  | "gradient"
  | "assets"
  | "navigator"
  | "artboards"
  | "vector"
  | "ai"
  | "notes"
  | "patterns"
  | "plugins";

const TAB_ICONS: Record<TabKey, string> = {
  layers: "📑",
  properties: "⚙️",
  adjustments: "🎨",
  history: "⏱️",
  colors: "🎛️",
  gradient: "🌈",
  assets: "📦",
  navigator: "🗺️",
  artboards: "🎯",
  vector: "✏️",
  ai: "🤖",
  notes: "💬",
  patterns: "🏁",
  plugins: "🔌",
};

export default function RightPanel() {
  const [activeTab, setActiveTab] = useState<TabKey>("layers");

  const renderPanel = () => {
    switch (activeTab) {
      case "layers":
        return <LayersPanel />;
      case "properties":
        return <PropertiesPanel />;
      case "adjustments":
        return <AdjustmentsPanel />;
      case "history":
        return <HistoryPanel />;
      case "colors":
        return <ColorPickerPanel />;
      case "gradient":
        return <GradientEditor />;
      case "assets":
        return <AssetsPanel />;
      case "navigator":
        return <NavigatorPanel />;
      case "artboards":
        return <ArtboardsPanel />;
      case "vector":
        return <VectorEditorPanel />;
      case "ai":
        return <AIToolsPanel />;
      case "notes":
        return <NotesPanel />;
      case "patterns":
        return <PatternsPanel />;
      case "plugins":
        return <PluginsPanel />;
      default:
        return <LayersPanel />;
    }
  };

  return (
    <div className="flex flex-col w-80 h-full bg-[#111827] border-l border-[#2D3748]">
      {/* Tab Bar */}
      <div className="flex gap-1 p-2 bg-[#0A0F1E] border-b border-[#2D3748] overflow-x-auto shrink-0">
        {(Object.keys(TAB_ICONS) as TabKey[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            title={tab}
            className={`p-2 rounded text-xs transition-colors capitalize whitespace-nowrap shrink-0 ${
              activeTab === tab
                ? "bg-[#6366F1] text-white font-bold"
                : "bg-[#1F2937] text-[#9CA3AF] hover:bg-[#252F3F]"
            }`}
          >
            {TAB_ICONS[tab]} {tab}
          </button>
        ))}
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto bg-[#111827]">
        {renderPanel()}
      </div>
    </div>
  );
}
