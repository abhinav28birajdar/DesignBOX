import { useColorStore } from "@/store/colorStore";

export default function GradientEditor() {
  const stops = useColorStore((state) => state.gradientStops);
  const setStops = useColorStore((state) => state.setGradientStops);

  return (
    <div className="panel mt-3 rounded-md p-3">
      <h3 className="mb-2 text-sm font-medium">Gradient Stops</h3>
      <div className="space-y-2">
        {stops.map((stop, index) => (
          <div key={`${stop.offset}-${index}`} className="flex items-center gap-2">
            <input
              type="color"
              value={stop.color}
              onChange={(e) => {
                const next = [...stops];
                next[index] = { ...stop, color: e.target.value };
                setStops(next);
              }}
            />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={stop.offset}
              onChange={(e) => {
                const next = [...stops];
                next[index] = { ...stop, offset: Number(e.target.value) };
                setStops(next);
              }}
            />
            <span className="text-xs">{Math.round(stop.offset * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
