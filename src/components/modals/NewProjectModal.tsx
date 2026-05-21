import { useMemo, useState } from "react";
import { presets } from "@/utils/presets";
import { useProjectStore } from "@/store/projectStore";

interface NewProjectModalProps {
  open: boolean;
  onClose: () => void;
}

export default function NewProjectModal({ open, onClose }: NewProjectModalProps) {
  const openTab = useProjectStore((state) => state.openTab);
  const [name, setName] = useState("Untitled");
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [dpi, setDpi] = useState(72);
  const [background, setBackground] = useState("#ffffff");
  const [unit, setUnit] = useState<"px" | "cm" | "mm" | "in">("px");

  const unitMultipliers: Record<string, number> = { px: 1, cm: 37.8, mm: 3.78, in: 96 };

  const grouped = useMemo(() => {
    const map = new Map<string, typeof presets>();
    presets.forEach((preset) => {
      const values = map.get(preset.category) || [];
      values.push(preset);
      map.set(preset.category, values);
    });
    return Array.from(map.entries());
  }, []);

  const handleCreate = () => {
    const multiplier = unitMultipliers[unit];
    openTab({
      id: crypto.randomUUID(),
      name,
      width: Math.round(width * multiplier),
      height: Math.round(height * multiplier),
      dpi,
      background,
      modified: false,
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
      <div className="panel w-full max-w-2xl max-h-[80vh] overflow-auto rounded-lg p-6">
        <h2 className="mb-4 text-xl font-bold">New Project</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Presets */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Quick Presets</h3>
            <div className="space-y-3">
              {grouped.map(([category, items]) => (
                <div key={category}>
                  <p className="mb-1 text-xs font-medium text-slate-400">{category}</p>
                  <div className="space-y-1">
                    {items.slice(0, 4).map((item) => (
                      <button
                        key={item.name}
                        onClick={() => {
                          setName(item.name);
                          setWidth(item.width);
                          setHeight(item.height);
                        }}
                        className="surface hover:bg-slate-700 block w-full rounded px-2 py-1 text-left text-xs transition"
                      >
                        {item.name} ({item.width}×{item.height})
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Settings */}
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold">Project Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="surface w-full rounded px-2 py-1 text-xs"
                placeholder="Untitled"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs font-semibold">Width</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="surface w-full rounded px-2 py-1 text-xs"
                  min={1}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold">Height</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="surface w-full rounded px-2 py-1 text-xs"
                  min={1}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs font-semibold">Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as typeof unit)}
                  className="surface w-full rounded px-2 py-1 text-xs"
                >
                  <option value="px">Pixels (px)</option>
                  <option value="cm">Centimeters (cm)</option>
                  <option value="mm">Millimeters (mm)</option>
                  <option value="in">Inches (in)</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold">DPI</label>
                <input
                  type="number"
                  value={dpi}
                  onChange={(e) => setDpi(Number(e.target.value))}
                  className="surface w-full rounded px-2 py-1 text-xs"
                  min={72}
                  max={600}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold">Background</label>
              <div className="flex gap-2">
                <div
                  className="h-9 w-12 rounded border-2 border-slate-600 cursor-pointer"
                  style={{ backgroundColor: background }}
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "color";
                    input.value = background;
                    input.onchange = (e) => setBackground((e.target as HTMLInputElement).value);
                    input.click();
                  }}
                />
                <input
                  type="text"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  className="surface flex-1 rounded px-2 py-1 text-xs font-mono"
                  placeholder="#ffffff"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded px-4 py-2 text-sm font-medium surface hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="rounded px-4 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
