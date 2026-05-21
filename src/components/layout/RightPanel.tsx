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

type TabKey = "layers" | "properties" | "adjustments" | "history" | "colors" | "gradient" | "assets" | "navigator" | "artboards" | "vector" | "ai";

const TAB_ICONS: Record<TabKey, string> = {
  layers: "📑",
  properties: "⚙️",
  adjustments: "🎨",
  history: "⏱️",
  colors: "🎨",
  gradient: "🌈",
  assets: "📦",
  navigator: "🗺️",
  artboards: "🎯",
  vector: "✏️",
  ai: "🤖",
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
      default:
        return <LayersPanel />;
    }
  };

  return (
    <div className="flex flex-col w-80 h-full bg-[#111827] border-l border-[#2D3748]">
      {/* Tab Bar */}
      <div className="flex gap-1 p-2 bg-[#0A0F1E] border-b border-[#2D3748] overflow-x-auto">
        {(Object.keys(TAB_ICONS) as TabKey[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            title={tab}
            className={`p-2 rounded text-sm transition-colors ${
              activeTab === tab
                ? "bg-[#6366F1] text-white"
                : "bg-[#1F2937] text-[#9CA3AF] hover:bg-[#252F3F]"
            }`}
          >
            {TAB_ICONS[tab]}
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
