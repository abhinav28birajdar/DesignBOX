interface RulerHorizontalProps {
  width: number;
  zoom: number;
  onCreateGuide: (position: number) => void;
}

export default function RulerHorizontal({ width, zoom, onCreateGuide }: RulerHorizontalProps) {
  const scaledWidth = width * (zoom / 100);
  const step = zoom >= 800 ? 10 : zoom >= 300 ? 25 : 50;
  const ticks = Math.ceil(width / step);

  return (
    <div
      className="absolute left-6 top-0 h-6 bg-slate-800/95"
      style={{ width: `${scaledWidth}px` }}
      onMouseDown={(event) => {
        const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
        const x = event.clientX - rect.left;
        const canvasPos = x / (zoom / 100);
        onCreateGuide(canvasPos);
      }}
    >
      {Array.from({ length: ticks + 1 }).map((_, i) => {
        const pos = i * step;
        const x = pos * (zoom / 100);
        const major = i % 2 === 0;
        return (
          <div key={pos} className="absolute top-0" style={{ left: `${x}px` }}>
            <div className={`w-px bg-slate-500 ${major ? "h-5" : "h-3"}`} />
            {major ? <span className="mono absolute left-1 top-0 text-[9px] text-slate-400">{pos}</span> : null}
          </div>
        );
      })}
    </div>
  );
}
