export interface CanvasPreset {
  category: string;
  name: string;
  width: number;
  height: number;
}

export const presets: CanvasPreset[] = [
  { category: "Social", name: "Instagram Post", width: 1080, height: 1080 },
  { category: "Social", name: "Instagram Story", width: 1080, height: 1920 },
  { category: "Social", name: "YouTube Thumbnail", width: 1280, height: 720 },
  { category: "Web", name: "Full HD", width: 1920, height: 1080 },
  { category: "Web", name: "4K", width: 3840, height: 2160 },
  { category: "Print", name: "A4", width: 2480, height: 3508 },
  { category: "Print", name: "Business Card", width: 1050, height: 600 },
];
