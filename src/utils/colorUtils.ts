export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => `${c}${c}`).join("") : h;
  return {
    r: parseInt(full.slice(0, 2), 16) || 0,
    g: parseInt(full.slice(2, 4), 16) || 0,
    b: parseInt(full.slice(4, 6), 16) || 0,
  };
};

export const rgbToHex = (r: number, g: number, b: number): string =>
  `#${[r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("")}`;

export const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));
