import type { fabric } from "fabric";

// All 20 tools as per spec
export type ToolId =
  | "move"
  | "select-rect"
  | "select-ellipse"
  | "lasso"
  | "magic-wand"
  | "crop"
  | "brush"
  | "eraser"
  | "clone"
  | "healing-brush"
  | "blur-sharpen-smudge"
  | "pen"
  | "fill"
  | "gradient-fill"
  | "eyedropper"
  | "text"
  | "shape"
  | "zoom"
  | "hand"
  | "measure";

export type ShapeType = "rect" | "ellipse" | "line" | "polygon" | "star";

// All 18 blend modes as per spec (plus normal = 19 total)
export type BlendMode =
  | "normal"
  | "dissolve"
  | "darken"
  | "multiply"
  | "color-burn"
  | "linear-burn"
  | "lighten"
  | "screen"
  | "color-dodge"
  | "linear-dodge"
  | "overlay"
  | "soft-light"
  | "hard-light"
  | "difference"
  | "exclusion"
  | "hue"
  | "saturation"
  | "color"
  | "luminosity";

export type AdjustmentType =
  | "brightness-contrast"
  | "levels"
  | "curves"
  | "exposure"
  | "vibrance"
  | "hue-saturation"
  | "color-balance"
  | "black-white"
  | "photo-filter"
  | "channel-mixer"
  | "gradient-map"
  | "selective-color"
  | "threshold"
  | "posterize"
  | "invert"
  | "blur"
  | "sharpen"
  | "noise-add"
  | "noise-reduce"
  | "vignette";

export type LayerType = "image" | "text" | "shape" | "group" | "adjustment";

export interface LayerItem {
  id: string;
  name: string;
  type: LayerType;
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: BlendMode;
  object: fabric.Object;
  colorLabel?: "red" | "orange" | "yellow" | "green" | "blue" | "purple" | null;
  thumbnail?: string; // base64 thumbnail
}

export interface ProjectTab {
  id: string;
  name: string;
  width: number;
  height: number;
  dpi: number;
  background: string;
  modified: boolean;
}

export interface Project {
  app: "DesignBox";
  version: string;
  name: string;
  created: string;
  modified: string;
  width: number;
  height: number;
  dpi: number;
  background: string;
  fabricJSON: Record<string, any>;
  layers?: LayerItem[];
  guides?: Array<{ id: string; axis: "h" | "v"; position: number }>;
  swatches?: string[];
  customFonts?: Array<{ name: string; data: string }>;
}

export interface ToolOptions {
  // Selection tools
  feather: number;
  antiAlias: boolean;
  
  // Brush tools
  brushSize: number;
  brushOpacity: number;
  hardness: number;
  flow: number;
  smoothing: number;
  brushType: "round" | "flat" | "textured" | "splatter";
  
  // Fill tools
  tolerance: number;
  contiguous: boolean;
  
  // Shape tools
  shapeType: ShapeType;
  polygonSides: number;
  strokeWidth: number;
  cornerRadius: number;
  
  // Text tool
  fontSize: number;
  fontFamily: string;
  fontWeight: "normal" | "bold" | "italic" | "bold-italic";
  textAlignment: "left" | "center" | "right";
  
  // General
  zoom: number;
  mode?: string;
}
