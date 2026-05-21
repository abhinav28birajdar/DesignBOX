interface RulerVerticalProps {
  height: number;
  zoom: number;
  onCreateGuide: (position: number) => void;
}

export default function RulerVertical({ height, zoom, onCreateGuide }: RulerVerticalProps) {
  const scaledHeight = height * (zoom / 100);
  const step = zoom >= 800 ? 10 : zoom >= 300 ? 25 : 50;
  const ticks = Math.ceil(height / step);

  return (
    <div
      className="absolute left-0 top-6 w-6 bg-slate-800/95"
      style={{ height: `${scaledHeight}px` }}
      onMouseDown={(event) => {
        const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
        const y = event.clientY - rect.top;
        const canvasPos = y / (zoom / 100);
        onCreateGuide(canvasPos);
      }}
    >
      {Array.from({ length: ticks + 1 }).map((_, i) => {
        const pos = i * step;
        const y = pos * (zoom / 100);
        const major = i % 2 === 0;
        return (
          <div key={pos} className="absolute left-0" style={{ top: `${y}px` }}>
            <div className={`h-px bg-slate-500 ${major ? "w-5" : "w-3"}`} />
            {major ? <span className="mono absolute left-0 top-1 text-[9px] text-slate-400">{pos}</span> : null}
          </div>
        );
      })}
    </div>
  );
}
