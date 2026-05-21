import { motion } from "framer-motion";
import { Tooltip } from "react-tooltip";
import { useToolStore } from "@/store/toolStore";
import type { ToolId } from "@/types";

const tools: { id: ToolId; label: string; icon: string; group?: string }[] = [
  // Selection & Transform
  { id: "move", label: "Move (V)", icon: "V", group: "transform" },
  { id: "select-rect", label: "Rect Select (M)", icon: "M", group: "selection" },
  { id: "select-ellipse", label: "Ellipse Select (M)", icon: "E", group: "selection" },
  { id: "lasso", label: "Lasso (L)", icon: "L", group: "selection" },
  { id: "magic-wand", label: "Magic Wand (W)", icon: "W", group: "selection" },
  { id: "crop", label: "Crop (C)", icon: "C", group: "transform" },
  
  // Painting & Retouching
  { id: "brush", label: "Brush (B)", icon: "B", group: "paint" },
  { id: "eraser", label: "Eraser (E)", icon: "E", group: "paint" },
  { id: "clone", label: "Clone (S)", icon: "S", group: "retouch" },
  { id: "healing-brush", label: "Healing (J)", icon: "J", group: "retouch" },
  { id: "blur-sharpen-smudge", label: "Blur/Sharpen (R)", icon: "R", group: "retouch" },
  
  // Drawing & Shapes
  { id: "pen", label: "Pen (P)", icon: "P", group: "draw" },
  { id: "shape", label: "Shape (U)", icon: "U", group: "draw" },
  
  // Fill & Color
  { id: "fill", label: "Fill (G)", icon: "G", group: "fill" },
  { id: "gradient-fill", label: "Gradient (G)", icon: "N", group: "fill" },
  { id: "eyedropper", label: "Eyedropper (I)", icon: "I", group: "color" },
  
  // Text
  { id: "text", label: "Text (T)", icon: "T", group: "text" },
  
  // Navigation & Measurement
  { id: "zoom", label: "Zoom (Z)", icon: "Z", group: "nav" },
  { id: "hand", label: "Hand (H)", icon: "H", group: "nav" },
  { id: "measure", label: "Measure", icon: "M", group: "nav" },
];

export default function LeftToolbar() {
  const activeTool = useToolStore((state) => state.activeTool);
  const setTool = useToolStore((state) => state.setTool);

  return (
    <>
      <div className="panel flex w-14 flex-col gap-2 p-2">
        {tools.map((tool) => (
          <motion.button
            key={tool.id}
            whileTap={{ scale: 0.94 }}
            className={`tool-btn ${activeTool === tool.id ? "active" : ""}`}
            data-tooltip-id="tooltips"
            data-tooltip-content={tool.label}
            onClick={() => setTool(tool.id)}
            title={tool.label}
          >
            {tool.icon}
          </motion.button>
        ))}
      </div>
      <Tooltip
        id="tooltips"
        delayShow={400}
        className="!rounded-md !bg-slate-900 !px-2 !py-1 !text-xs !text-slate-100"
      />
    </>
  );
}
