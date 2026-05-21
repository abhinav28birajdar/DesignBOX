import { useMemo } from "react";

interface GridOverlayProps {
  visible: boolean;
  gridSize: number;
  zoom: number;
}

export default function GridOverlay({ visible, gridSize, zoom }: GridOverlayProps) {
  const backgroundSize = `${Math.max(2, gridSize * (zoom / 100))}px ${Math.max(2, gridSize * (zoom / 100))}px`;
  const opacity = zoom > 500 ? 0.35 : 0.18;

  const style = useMemo(
    () => ({
      backgroundImage:
        "linear-gradient(to right, rgba(148,163,184,0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.25) 1px, transparent 1px)",
      backgroundSize,
      opacity,
    }),
    [backgroundSize, opacity]
  );

  if (!visible) return null;

  return <div className="pointer-events-none absolute inset-0" style={style} />;
}
