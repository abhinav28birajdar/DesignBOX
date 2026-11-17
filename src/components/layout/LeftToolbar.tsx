import { motion } from "framer-motion";
import { Tooltip } from "react-tooltip";
import { useToolStore } from "@/store/toolStore";
import { useColorStore } from "@/store/colorStore";
import type { ToolId } from "@/types";
import type { ReactNode } from "react";

interface ToolItem {
  id: ToolId;
  label: string;
  icon: ReactNode;
  group?: string;
}

const TOOL_ICONS: Record<string, ReactNode> = {
  move: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" />
    </svg>
  ),
  "select-rect": (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3">
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  ),
  "select-ellipse": (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3">
      <circle cx="12" cy="12" r="9" />
    </svg>
  ),
  lasso: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 22a5 5 0 0 1-2-4c0-4 4-7 9-7 4 0 7 2 7 5s-3 5-7 5c-3 0-5-1-6-3l-2 4" />
      <path d="M15 11V3" />
    </svg>
  ),
  "magic-wand": (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m19 5-7 7-2-2 7-7 2 2zM15 3l1 1M18 6l1 1M19 2l.5 1.5L21 4l-1.5.5L19 6l-.5-1.5L17 4l1.5-.5L19 2zM3 21l9-9" />
    </svg>
  ),
  crop: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2v14a2 2 0 0 0 2 2h14" />
      <path d="M18 22V8a2 2 0 0 0-2-2H2" />
    </svg>
  ),
  brush: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
      <path d="M7.07 14.94c-1.66 0-3 1.34-3 3 0 1.95-1.74 2.56-2.07 2.06-.5-.76 0-2.5 1.5-4 1.5-1.5 3.5-1.5 3.57-1.06z" />
    </svg>
  ),
  eraser: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
      <path d="M22 21H7" />
      <path d="m5 11 9 9" />
    </svg>
  ),
  clone: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <circle cx="12" cy="14" r="3" />
    </svg>
  ),
  "healing-brush": (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <path d="M9 12h6M12 9v6" />
    </svg>
  ),
  "blur-sharpen-smudge": (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  ),
  pen: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m12 19 7-7 3 3-7 7-3-3z" />
      <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="m2 2 7.586 7.586" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  ),
  shape: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="11" height="11" rx="1" />
      <circle cx="16" cy="16" r="5" />
    </svg>
  ),
  fill: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z" />
      <path d="m5 2 5 5" />
      <path d="M2 13h15" />
      <path d="M22 20a2 2 0 1 1-4 0c0-1.6 2-3 2-3s2 1.4 2 3z" />
    </svg>
  ),
  "gradient-fill": (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 15h18M3 9h18" strokeDasharray="2 2" />
    </svg>
  ),
  eyedropper: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m2 22 1-1h3l9-9M17 7l-2-2 3.5-3.5a1 1 0 0 1 1.4 0l.6.6a1 1 0 0 1 0 1.4L17 7z" />
      <path d="m14 10 3 3" />
    </svg>
  ),
  text: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7V4h16v3M9 20h6M12 4v16" />
    </svg>
  ),
  zoom: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35M11 8v6M8 11h6" />
    </svg>
  ),
  hand: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v3M14 9V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v7M10 10V5a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v9M18 11a2 2 0 0 1 2 2v2a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-5.7-2.3L2.3 18a1.5 1.5 0 0 1 .4-2.1l1.5-1.1a1.5 1.5 0 0 1 2.1.4L8 17" />
    </svg>
  ),
  measure: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 18 18 2l4 4L6 22l-4-4Z" />
      <path d="m7.5 4.5 2 2M10.5 7.5l2 2M13.5 10.5l2 2M16.5 13.5l2 2" />
    </svg>
  ),
  notes: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z" />
      <path d="M15 3v5h5M9 13h6M9 17h4" />
    </svg>
  ),
};

const tools: ToolItem[] = [
  { id: "move", label: "Move Tool (V)", icon: TOOL_ICONS.move },
  { id: "select-rect", label: "Rectangular Marquee (M)", icon: TOOL_ICONS["select-rect"] },
  { id: "select-ellipse", label: "Elliptical Marquee (M)", icon: TOOL_ICONS["select-ellipse"] },
  { id: "lasso", label: "Lasso Tool (L)", icon: TOOL_ICONS.lasso },
  { id: "magic-wand", label: "Magic Wand Tool (W)", icon: TOOL_ICONS["magic-wand"] },
  { id: "crop", label: "Crop Tool (C)", icon: TOOL_ICONS.crop },
  { id: "brush", label: "Brush Tool (B)", icon: TOOL_ICONS.brush },
  { id: "eraser", label: "Eraser Tool (E)", icon: TOOL_ICONS.eraser },
  { id: "clone", label: "Clone Stamp Tool (S)", icon: TOOL_ICONS.clone },
  { id: "healing-brush", label: "Healing Brush (J)", icon: TOOL_ICONS["healing-brush"] },
  { id: "blur-sharpen-smudge", label: "Blur / Sharpen / Smudge (R)", icon: TOOL_ICONS["blur-sharpen-smudge"] },
  { id: "pen", label: "Pen Tool (P)", icon: TOOL_ICONS.pen },
  { id: "shape", label: "Shape Tool (U)", icon: TOOL_ICONS.shape },
  { id: "fill", label: "Paint Bucket Fill (G)", icon: TOOL_ICONS.fill },
  { id: "gradient-fill", label: "Gradient Fill Tool (G)", icon: TOOL_ICONS["gradient-fill"] },
  { id: "eyedropper", label: "Eyedropper Tool (I)", icon: TOOL_ICONS.eyedropper },
  { id: "text", label: "Text Tool (T)", icon: TOOL_ICONS.text },
  { id: "zoom", label: "Zoom Tool (Z)", icon: TOOL_ICONS.zoom },
  { id: "hand", label: "Hand Tool / Pan (H)", icon: TOOL_ICONS.hand },
  { id: "measure", label: "Ruler / Measure Tool", icon: TOOL_ICONS.measure },
  { id: "notes", label: "Notes & Annotations (N)", icon: TOOL_ICONS.notes },
];

export default function LeftToolbar() {
  const activeTool = useToolStore((state) => state.activeTool);
  const setTool = useToolStore((state) => state.setTool);
  const foreground = useColorStore((state) => state.foreground);
  const background = useColorStore((state) => state.background);
  const setForeground = useColorStore((state) => state.setForeground);
  const setBackground = useColorStore((state) => state.setBackground);
  const swapColors = useColorStore((state) => state.swapColors);
  const resetColors = useColorStore((state) => state.resetColors);

  return (
    <aside className="panel flex w-14 flex-col justify-between items-center py-2 bg-[#111827] border-r border-[#2D3748] select-none z-20">
      {/* Tool List */}
      <div className="flex flex-col gap-1 w-full items-center overflow-y-auto max-h-[calc(100vh-180px)] px-1">
        {tools.map((tool) => (
          <motion.button
            key={tool.id}
            whileTap={{ scale: 0.92 }}
            className={`flex items-center justify-center w-10 h-10 rounded transition-colors ${
              activeTool === tool.id
                ? "bg-[#6366F1] text-white shadow-md shadow-indigo-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
            data-tooltip-id="tooltips"
            data-tooltip-content={tool.label}
            onClick={() => setTool(tool.id)}
            aria-label={tool.label}
          >
            {tool.icon}
          </motion.button>
        ))}
      </div>

      {/* Foreground / Background Color Swatches */}
      <div className="flex flex-col items-center gap-1.5 pt-2 border-t border-slate-700 w-full">
        <div className="relative w-8 h-8">
          {/* Background Swatch (bottom-right) */}
          <label
            title={`Background Color: ${background} (Double-click to set)`}
            className="absolute bottom-0 right-0 w-5 h-5 rounded border border-slate-600 shadow cursor-pointer overflow-hidden z-0"
            style={{ backgroundColor: background }}
          >
            <input
              type="color"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="opacity-0 w-0 h-0 absolute pointer-events-none"
            />
          </label>

          {/* Foreground Swatch (top-left) */}
          <label
            title={`Foreground Color: ${foreground} (Click to change)`}
            className="absolute top-0 left-0 w-5 h-5 rounded border border-slate-400 shadow cursor-pointer overflow-hidden z-10"
            style={{ backgroundColor: foreground }}
          >
            <input
              type="color"
              value={foreground}
              onChange={(e) => setForeground(e.target.value)}
              className="opacity-0 w-0 h-0 absolute pointer-events-none"
            />
          </label>
        </div>

        {/* Swap & Default Controls */}
        <div className="flex items-center gap-1 text-[10px] text-slate-400">
          <button
            onClick={swapColors}
            title="Swap Colors (X)"
            className="hover:text-white px-1 py-0.5 rounded bg-slate-800 hover:bg-slate-700"
          >
            ⇄
          </button>
          <button
            onClick={resetColors}
            title="Default Black & White (D)"
            className="hover:text-white px-1 py-0.5 rounded bg-slate-800 hover:bg-slate-700 font-bold"
          >
            D
          </button>
        </div>
      </div>

      <Tooltip
        id="tooltips"
        delayShow={350}
        place="right"
        className="!rounded-md !bg-slate-900 !px-2.5 !py-1 !text-xs !text-slate-100 !border !border-slate-700 shadow-xl z-50"
      />
    </aside>
  );
}
