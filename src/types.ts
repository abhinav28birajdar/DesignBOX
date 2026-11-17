import type { fabric } from "fabric";

// ============================================================================
// TOOLS & SHAPES
// ============================================================================

export type ToolId =
  | "move" | "select-rect" | "select-ellipse" | "lasso" | "magic-wand" | "crop"
  | "brush" | "eraser" | "clone" | "healing-brush" | "blur-sharpen-smudge"
  | "pen" | "fill" | "gradient-fill" | "eyedropper" | "text" | "shape"
  | "zoom" | "hand" | "measure" | "notes";

export type ShapeType = "rect" | "ellipse" | "line" | "polygon" | "star";

// ============================================================================
// LAYER SYSTEM (12 LAYER TYPES + PHASE 1 EXTENSIONS)
// ============================================================================

export type LayerType =
  | "raster"          // Pixel layer
  | "vector-shape"    // Vector path
  | "text"            // Live text
  | "smart-object"    // Non-destructive wrapper
  | "adjustment"      // Adjustment layer
  | "fill"            // Solid/Gradient/Pattern
  | "group"           // Layer group/folder
  | "artboard"        // Artboard container
  | "3d"              // 3D layer
  | "video"           // Video frames
  | "linked"          // External file link
  | "mask";           // Layer mask

// ============================================================================
// EFFECTS & ADJUSTMENTS (12 EFFECTS + 24 ADJUSTMENTS)
// ============================================================================

export type EffectType =
  | "drop-shadow" | "inner-shadow" | "outer-glow" | "inner-glow"
  | "bevel-emboss" | "satin" | "color-overlay" | "gradient-overlay"
  | "pattern-overlay" | "stroke" | "contour" | "texture";

export type AdjustmentType =
  | "brightness-contrast" | "levels" | "curves" | "exposure" | "vibrance"
  | "hue-saturation" | "color-balance" | "black-white" | "photo-filter"
  | "channel-mixer" | "color-lookup" | "posterize" | "threshold"
  | "selective-color" | "gradient-map" | "invert" | "shadow-highlights"
  | "hdr-toning" | "desaturate" | "match-color" | "replace-color"
  | "equalize" | "variations" | "lens-correction";

// ============================================================================
// COLOR & BLEND MODES (35 BLEND MODES)
// ============================================================================

export type BlendMode =
  | "normal" | "dissolve"
  | "darken" | "multiply" | "color-burn" | "linear-burn"
  | "lighten" | "screen" | "color-dodge" | "linear-dodge"
  | "overlay" | "soft-light" | "hard-light" | "vivid-light" | "linear-light"
  | "pin-light" | "hard-mix"
  | "difference" | "exclusion"
  | "hue" | "saturation" | "color" | "luminosity"
  | "erase" | "fog" | "glow" | "reflect" | "freeze" | "heat" | "glare";

// ============================================================================
// LAYER EFFECTS & MASKS
// ============================================================================

export interface LayerEffect {
  id: string;
  type: EffectType;
  enabled: boolean;
  properties: Record<string, any>;
  opacity?: number;        // 0-100
  blendMode?: BlendMode;
}

export interface LayerMask {
  id: string;
  type: "pixel" | "vector";
  object?: fabric.Object;  // The mask shape/image
  enabled: boolean;
  density: number;         // 0-100
  feather: number;         // 0-250px
  linked: boolean;         // Link mask to layer content
}

export interface SmartObjectData {
  linkedPath?: string;     // For linked smart objects
  embedded: boolean;       // Embedded or linked
  transformMatrix?: number[];  // For non-destructive transforms
  originalData?: string;   // Serialized original content
}

export interface AdjustmentLayerData {
  adjustmentType: AdjustmentType;
  properties: Record<string, any>;
  clipping: boolean;       // Clip to layer below
  affectedLayers?: string[];  // Which layers this affects (if not all)
}

export interface FillLayerData {
  type: "solid" | "gradient" | "pattern";
  properties: Record<string, any>;
}

// ============================================================================
// LAYER ITEM (EXTENDED FOR PHASE 1)
// ============================================================================

export interface LayerItem {
  id: string;
  name: string;
  type: LayerType;
  visible: boolean;
  locked: boolean;
  opacity: number;         // 0-100
  blendMode: BlendMode;
  object?: fabric.Object;
  colorLabel?: "red" | "orange" | "yellow" | "green" | "blue" | "purple" | null;
  thumbnail?: string;      // base64 thumbnail

  // Phase 1 Extensions
  parentId?: string;       // For groups/artboards
  children?: LayerItem[];  // For group layers
  effects?: LayerEffect[]; // Layer effects (max 12)
  mask?: LayerMask;        // Layer mask
  linkedSource?: string;   // For linked layers
  smartObjectData?: SmartObjectData;
  adjustmentData?: AdjustmentLayerData;
  fillData?: FillLayerData;
}

// ============================================================================
// PROJECT & DOCUMENT
// ============================================================================

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

// ============================================================================
// TOOLS & OPTIONS
// ============================================================================

export interface ToolOptions {
  feather: number;
  antiAlias: boolean;
  brushSize: number;
  brushOpacity: number;
  hardness: number;
  flow: number;
  smoothing: number;
  brushType: "round" | "flat" | "textured" | "splatter";
  tolerance: number;
  contiguous: boolean;
  shapeType: ShapeType;
  polygonSides: number;
  strokeWidth: number;
  cornerRadius: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: "normal" | "bold" | "italic" | "bold-italic";
  textAlignment: "left" | "center" | "right";
  zoom: number;
  mode?: string;
  brushHardness?: number;
  fillColor?: string;
  strokeColor?: string;
}

// ============================================================================
// WORKSPACE & UI (PHASE 1)
// ============================================================================

export type RulerUnit = "px" | "%" | "cm" | "mm" | "inches" | "pt" | "pica" | "em";

export interface PanelConfig {
  id: string;
  title: string;
  visible: boolean;
  position: "left" | "right" | "floating";
  width?: number;
  height?: number;
  docked?: boolean;
  tabGroup?: string;
}

export interface WorkspaceConfig {
  name: string;
  panels: PanelConfig[];
  theme: "light" | "dark";
  fullscreen: boolean;
  presentation: boolean;
}

export type Persona = "photoshop" | "affinity-designer" | "photopea";

export interface SnapSettings {
  snapToGrid: boolean;
  snapToGuides: boolean;
  snapToEdges: boolean;
  snapToCenter: boolean;
  snapToDistribution: boolean;
  snapTolerance: number;  // 1-10px
}
