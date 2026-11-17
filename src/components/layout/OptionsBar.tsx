import { useToolStore } from "@/store/toolStore";
import { useCanvasStore } from "@/store/canvasStore";
import { useColorStore } from "@/store/colorStore";
import type { ShapeType } from "@/types";

export default function OptionsBar() {
  const activeTool = useToolStore((state) => state.activeTool);
  const options = useToolStore((state) => state.options);
  const patchOptions = useToolStore((state) => state.patchOptions);
  const canvas = useCanvasStore((state) => state.canvas);
  const setZoom = useCanvasStore((state) => state.setZoom);
  const foreground = useColorStore((state) => state.foreground);
  const setForeground = useColorStore((state) => state.setForeground);

  const activeObj = canvas?.getActiveObject();
  const objX = activeObj ? Math.round(activeObj.left || 0) : 0;
  const objY = activeObj ? Math.round(activeObj.top || 0) : 0;
  const objW = activeObj ? Math.round((activeObj.width || 0) * (activeObj.scaleX || 1)) : 0;
  const objH = activeObj ? Math.round((activeObj.height || 0) * (activeObj.scaleY || 1)) : 0;
  const objAngle = activeObj ? Math.round(activeObj.angle || 0) : 0;

  const align = (type: "left" | "center" | "right" | "top" | "middle" | "bottom") => {
    if (!canvas || !activeObj) return;
    const cw = canvas.getWidth();
    const ch = canvas.getHeight();
    const bound = activeObj.getBoundingRect();

    switch (type) {
      case "left":
        activeObj.set("left", 0);
        break;
      case "center":
        activeObj.set("left", (cw - bound.width) / 2);
        break;
      case "right":
        activeObj.set("left", cw - bound.width);
        break;
      case "top":
        activeObj.set("top", 0);
        break;
      case "middle":
        activeObj.set("top", (ch - bound.height) / 2);
        break;
      case "bottom":
        activeObj.set("top", ch - bound.height);
        break;
    }
    activeObj.setCoords();
    canvas.renderAll();
  };

  return (
    <div className="panel flex h-11 items-center gap-4 px-4 text-xs bg-[#111827] border-b border-[#2D3748] text-slate-300 overflow-x-auto select-none z-10">
      {/* Active Tool Label Badge */}
      <span className="rounded bg-indigo-900/60 text-indigo-300 font-semibold px-2.5 py-1 capitalize shrink-0 border border-indigo-700/50">
        {activeTool.replace("-", " ")}
      </span>

      {/* Move Tool Controls */}
      {activeTool === "move" && (
        <div className="flex items-center gap-3 shrink-0">
          {activeObj ? (
            <>
              <div className="flex items-center gap-1 font-mono text-[11px]">
                <span className="text-slate-400">X:</span>
                <span className="text-white font-medium">{objX}px</span>
                <span className="text-slate-400 ml-2">Y:</span>
                <span className="text-white font-medium">{objY}px</span>
                <span className="text-slate-400 ml-2">W:</span>
                <span className="text-white font-medium">{objW}px</span>
                <span className="text-slate-400 ml-2">H:</span>
                <span className="text-white font-medium">{objH}px</span>
                <span className="text-slate-400 ml-2">∠</span>
                <span className="text-white font-medium">{objAngle}°</span>
              </div>
              <div className="h-4 w-px bg-slate-700 mx-1" />
              <div className="flex items-center gap-1">
                <button onClick={() => align("left")} className="px-1.5 py-1 rounded hover:bg-slate-700" title="Align Left">⇤</button>
                <button onClick={() => align("center")} className="px-1.5 py-1 rounded hover:bg-slate-700" title="Align Center">⇥⇤</button>
                <button onClick={() => align("right")} className="px-1.5 py-1 rounded hover:bg-slate-700" title="Align Right">⇥</button>
                <button onClick={() => align("top")} className="px-1.5 py-1 rounded hover:bg-slate-700" title="Align Top">⤒</button>
                <button onClick={() => align("middle")} className="px-1.5 py-1 rounded hover:bg-slate-700" title="Align Middle">⤓⤒</button>
                <button onClick={() => align("bottom")} className="px-1.5 py-1 rounded hover:bg-slate-700" title="Align Bottom">⤓</button>
              </div>
            </>
          ) : (
            <span className="text-slate-400 italic">Click an object on canvas to transform or align</span>
          )}
        </div>
      )}

      {/* Brush & Eraser Controls */}
      {(activeTool === "brush" || activeTool === "eraser" || activeTool === "blur-sharpen-smudge" || activeTool === "healing-brush" || activeTool === "clone") && (
        <div className="flex items-center gap-4 shrink-0">
          <label className="flex items-center gap-2">
            <span>Size:</span>
            <input
              type="range"
              min={1}
              max={300}
              value={options.brushSize}
              onChange={(e) => patchOptions({ brushSize: Number(e.target.value) })}
              className="w-24 accent-indigo-500"
            />
            <span className="w-8 font-mono">{options.brushSize}px</span>
          </label>

          <label className="flex items-center gap-2">
            <span>Opacity:</span>
            <input
              type="range"
              min={1}
              max={100}
              value={options.brushOpacity}
              onChange={(e) => patchOptions({ brushOpacity: Number(e.target.value) })}
              className="w-24 accent-indigo-500"
            />
            <span className="w-8 font-mono">{options.brushOpacity}%</span>
          </label>

          <label className="flex items-center gap-2">
            <span>Hardness:</span>
            <input
              type="range"
              min={0}
              max={100}
              value={options.brushHardness ?? options.hardness ?? 100}
              onChange={(e) => {
                const val = Number(e.target.value);
                patchOptions({ brushHardness: val, hardness: val });
              }}
              className="w-20 accent-indigo-500"
            />
            <span className="w-8 font-mono">{options.brushHardness ?? options.hardness ?? 100}%</span>
          </label>
        </div>
      )}

      {/* Magic Wand Controls */}
      {activeTool === "magic-wand" && (
        <div className="flex items-center gap-4 shrink-0">
          <label className="flex items-center gap-2">
            <span>Tolerance:</span>
            <input
              type="range"
              min={0}
              max={255}
              value={options.tolerance}
              onChange={(e) => patchOptions({ tolerance: Number(e.target.value) })}
              className="w-28 accent-indigo-500"
            />
            <span className="w-8 font-mono">{options.tolerance}</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded accent-indigo-500" />
            <span>Contiguous</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded accent-indigo-500" />
            <span>Anti-alias</span>
          </label>
        </div>
      )}

      {/* Selection Marquee Tools */}
      {(activeTool === "select-rect" || activeTool === "select-ellipse" || activeTool === "lasso") && (
        <div className="flex items-center gap-4 shrink-0">
          <span className="text-slate-400">Mode: New Selection</span>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded accent-indigo-500" />
            <span>Anti-alias</span>
          </label>
          <span className="text-[11px] text-slate-400">Shift = Add to selection | Alt = Subtract</span>
        </div>
      )}

      {/* Shape Tool Controls */}
      {activeTool === "shape" && (
        <div className="flex items-center gap-3 shrink-0">
          <span>Shape:</span>
          <select
            value={options.shapeType}
            onChange={(e) => patchOptions({ shapeType: e.target.value as ShapeType })}
            className="rounded bg-slate-800 px-2 py-1 text-xs border border-slate-700"
          >
            <option value="rect">Rectangle</option>
            <option value="ellipse">Ellipse / Circle</option>
            <option value="line">Line</option>
            <option value="polygon">Polygon</option>
            <option value="star">Star</option>
          </select>

          <label className="flex items-center gap-1.5">
            <span>Fill:</span>
            <input
              type="color"
              value={options.fillColor || foreground}
              onChange={(e) => {
                patchOptions({ fillColor: e.target.value });
                setForeground(e.target.value);
              }}
              className="w-6 h-6 rounded border border-slate-600 cursor-pointer"
            />
          </label>

          <label className="flex items-center gap-1.5">
            <span>Stroke:</span>
            <input
              type="color"
              value={options.strokeColor || "#000000"}
              onChange={(e) => patchOptions({ strokeColor: e.target.value })}
              className="w-6 h-6 rounded border border-slate-600 cursor-pointer"
            />
          </label>

          <label className="flex items-center gap-1.5">
            <span>Width:</span>
            <input
              type="number"
              min={0}
              max={50}
              value={options.strokeWidth}
              onChange={(e) => patchOptions({ strokeWidth: Number(e.target.value) })}
              className="w-14 rounded bg-slate-800 px-1.5 py-1 text-xs border border-slate-700"
            />
          </label>
        </div>
      )}

      {/* Text Tool Controls */}
      {activeTool === "text" && (
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-slate-400">Color:</span>
          <input
            type="color"
            value={foreground}
            onChange={(e) => setForeground(e.target.value)}
            className="w-6 h-6 rounded border border-slate-600 cursor-pointer"
          />
          <span className="text-[11px] text-slate-400">Click canvas to place text box, or drag to create text area.</span>
        </div>
      )}

      {/* Zoom Tool Controls */}
      {activeTool === "zoom" && (
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setZoom(100)} className="rounded bg-slate-800 hover:bg-slate-700 px-2.5 py-1 border border-slate-700">100%</button>
          <button onClick={() => setZoom(200)} className="rounded bg-slate-800 hover:bg-slate-700 px-2.5 py-1 border border-slate-700">200%</button>
          <button onClick={() => setZoom(50)} className="rounded bg-slate-800 hover:bg-slate-700 px-2.5 py-1 border border-slate-700">50%</button>
          <span className="text-[11px] text-slate-400 ml-2">Click to zoom in | Alt + Click to zoom out</span>
        </div>
      )}

      {/* Hand Tool Controls */}
      {activeTool === "hand" && (
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-slate-400">Click and drag to pan around the canvas. Space + Drag works in any tool.</span>
        </div>
      )}

      {/* Crop Tool Controls */}
      {activeTool === "crop" && (
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[11px] text-slate-400">Drag bounding box to define crop area. Press Enter to commit or Esc to cancel.</span>
        </div>
      )}
    </div>
  );
}
