import { create } from "zustand";

interface ColorState {
  foreground: string;
  background: string;
  swatches: string[];
  gradientStops: { offset: number; color: string; opacity: number }[];
  setForeground: (color: string) => void;
  setBackground: (color: string) => void;
  addSwatch: (color: string) => void;
  setGradientStops: (stops: { offset: number; color: string; opacity: number }[]) => void;
}

export const useColorStore = create<ColorState>((set) => ({
  foreground: "#ffffff",
  background: "#000000",
  swatches: ["#ffffff", "#000000", "#6366f1", "#ef4444", "#22c55e"],
  gradientStops: [
    { offset: 0, color: "#6366f1", opacity: 1 },
    { offset: 1, color: "#22c55e", opacity: 1 },
  ],
  setForeground: (color) => set({ foreground: color }),
  setBackground: (color) => set({ background: color }),
  addSwatch: (color) => set((state) => ({ swatches: Array.from(new Set([color, ...state.swatches])).slice(0, 24) })),
  setGradientStops: (stops) => set({ gradientStops: stops }),
}));
