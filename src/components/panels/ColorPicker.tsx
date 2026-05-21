import { HexColorPicker } from "react-colorful";
import { useColorStore } from "@/store/colorStore";

export default function ColorPickerPanel() {
  const foreground = useColorStore((state) => state.foreground);
  const background = useColorStore((state) => state.background);
  const setForeground = useColorStore((state) => state.setForeground);
  const setBackground = useColorStore((state) => state.setBackground);
  const swatches = useColorStore((state) => state.swatches);
  const addSwatch = useColorStore((state) => state.addSwatch);

  return (
    <div className="panel rounded-md p-3">
      <h3 className="mb-2 text-sm font-medium">Color</h3>
      <HexColorPicker color={foreground} onChange={setForeground} />
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button className="surface rounded p-2 text-xs" onClick={() => addSwatch(foreground)}>
          Save FG
        </button>
        <button className="surface rounded p-2 text-xs" onClick={() => setBackground(foreground)}>
          Set BG
        </button>
      </div>
      <div className="mt-3 grid grid-cols-8 gap-1">
        {swatches.map((swatch) => (
          <button
            key={swatch}
            className="h-5 w-5 rounded border border-slate-500"
            style={{ background: swatch }}
            onClick={() => setForeground(swatch)}
            onContextMenu={(e) => {
              e.preventDefault();
              setBackground(swatch);
            }}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs">
        <span>FG {foreground}</span>
        <span className="text-slate-500">|</span>
        <span>BG {background}</span>
      </div>
    </div>
  );
}
