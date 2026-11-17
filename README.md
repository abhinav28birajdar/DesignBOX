# DesignBox 🎨
> **Design Without Limits** — The ultimate browser-first photo & graphic design suite.

![DesignBox](/public/favicon.svg)

DesignBox is a high-performance, browser-first photo editing and graphic design web application built with **React 18 + TypeScript + Fabric.js**. It provides a 100% client-side, offline-capable environment with advanced layer management, vector editing, live layer styles, real-time keyframe animation, distortion filters, client-side AI tools, and responsive breakpoint design.

---

## 🚀 Key Feature Matrix

### 1. Canvas & Workspace Engine
- [x] Infinite canvas workspace with zoom (10% to 3200%) and pan controls.
- [x] Horizontal & vertical dynamic rulers with drag-to-create guide lines.
- [x] Interactive grid overlay with snapping and clear guides.
- [x] Figma-style Pink/Magenta **Smart Guides** with distance labels and center/edge snapping.
- [x] **Navigator Panel (Mini-Map)** with live thumbnail updates, viewport red box panning, zoom slider, and quick zoom presets (Fit, 50%, 100%, 200%).

### 2. Multi-Artboard System
- [x] Multi-artboard support on a single infinite canvas.
- [x] **Artboard Tool (`A`)** for interactive drawing, resizing, and header naming.
- [x] Dedicated **Artboards Panel** for reordering, duplicating content, and content clipping toggles.
- [x] Batch export all artboards as individual images packaged in a ZIP archive.

### 3. Complete Tool Suite (20 Tools)
- [x] **Move Tool (`V`)**: Full canvas object selection, translation, scale, rotation, and stacking.
- [x] **Rect / Ellipse Select (`M`)**: Canvas marquee selections.
- [x] **Lasso Tool (`L`)**: Freehand and polygon selection.
- [x] **Magic Wand (`W`)**: Color tolerance flood-fill selection.
- [x] **Crop Tool (`C`)**: Interactive viewport cropping with aspect ratio presets.
- [x] **Brush Tool (`B`)**: Freehand pressure stroke drawing via `perfect-freehand`.
- [x] **Eraser Tool (`E`)**: Transparent stroke erasing.
- [x] **Clone Stamp (`S`)**: Source sampling and stamp cloning.
- [x] **Healing Brush (`J`)**: Texture sampling and spot healing.
- [x] **Blur / Sharpen / Smudge (`R`)**: Filter manipulation on image layers.
- [x] **Pen Tool (`P`)**: Bezier anchor point vector path creation.
- [x] **Shape Tool (`U`)**: Rectangles, Ellipses, Polygons, Stars, and Lines.
- [x] **Fill & Gradient Fill (`G`)**: Linear & Radial multi-stop gradient creation.
- [x] **Eyedropper (`I`)**: Color sampling directly from canvas pixels.
- [x] **Text Tool (`T`)**: Rich text boxes with Google Fonts integration.
- [x] **Notes Tool (`N`)**: Interactive sticky notes pinned to canvas coords.
- [x] **Zoom (`Z`) & Hand (`H`)**: Workspace navigation and viewport panning.

### 4. Layers & Style Effects Engine
- [x] Drag-and-drop layer reordering with canvas z-index sync (`react-dnd`).
- [x] Visibility, locking, opacity sliders, and 18 canvas blend modes (`multiply`, `screen`, `overlay`, etc.).
- [x] **Layer Styles Dialog** with 10 real-time renderable effects:
  - Drop Shadow, Inner Shadow, Outer Glow, Inner Glow, Bevel & Emboss, Satin, Color Overlay, Gradient Overlay, Pattern Overlay, Stroke.
- [x] Copy & Paste Layer Styles across layers.
- [x] Clipping Masks (`Ctrl+Alt+G`) and Layer Masks with feathering options.

### 5. Vector Path Editor & Boolean Operations
- [x] Interactive node selection, coordinate adjustment, and line-to-curve conversion.
- [x] Catmull-Rom path smoothing, direction reversal, and path closure.
- [x] Boolean Path Operations: **Unite**, **Subtract Front**, **Intersect**, **Exclude**, **Divide**, **Outline Stroke**, and **Offset Path**.

### 6. Animation System (Timeline)
- [x] Collapsible bottom Timeline Panel (`View > Timeline`).
- [x] Keyframe insertion (`+KF`) for position X/Y, scale, rotation, and opacity.
- [x] Linear and easing curve keyframe interpolation with live canvas playback.
- [x] Playback controls (Play, Pause, Reset, Loop, FPS selection, duration).
- [x] Export options for GIF, WebM video, PNG sequence ZIP, and APNG.

### 7. Built-in Assets Library
- [x] **100+ SVG Shapes**: Categorized in Basic, UI Elements, Icons, Decorative, and Abstract.
- [x] **Stock Photos**: Unsplash image search, click/drag to canvas as Image layer.
- [x] **30+ Color Palettes**: Curated color sets & K-means 5-color palette extractor from uploaded images.
- [x] **Google Fonts Browser**: Live text preview and click-to-apply font.
- [x] **50+ Templates**: Social Media, Business, Marketing, and Print presets.
- [x] **200+ Stickers**: Transparent PNG/SVG stickers and emojis.

### 8. Filters, AI Tools & Plugin Extensions
- [x] **Distort Filters**: Twirl, Pinch, Push, Pixelate/Mosaic.
- [x] **Render Filters**: Perlin Noise Clouds and Plasma generator.
- [x] **Client-side AI Tools**: Background Removal, Smart Selection, Image Upscale, Text-to-Pattern.
- [x] **Plugin API (`window.DesignBoxAPI`)**: Ruler manager, Batch icon set resizer (16px to 512px ZIP), Palette extractor, and Mockup generator (iPhone 15, MacBook, iPad, Poster).

### 9. Productivity, Output & Printing
- [x] **Find & Replace (`Ctrl+H`)**: Search & replace text content, fonts, colors, and sizes.
- [x] **Responsive Breakpoints**: Viewport switching for Mobile (375px), Tablet (768px), Laptop (1280px), Desktop (1920px).
- [x] **Print System (`Ctrl+P`)**: Print dialog with paper presets, margins, scale, bleed, crop marks, and `window.print()` integration.
- [x] **Export Formats**: PNG (transparent), JPG, WebP, SVG, and PDF (`jsPDF`).
- [x] **Project File Format**: Save & load `.designbox` JSON projects with auto-save to IndexedDB.
- [x] **Toast Notifications**: Spring-animated stacked toasts with action buttons.

---

## 🛠 Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 18** | UI Framework |
| **TypeScript** | Strict Type Safety |
| **Fabric.js v5** | HTML5 Canvas Rendering Engine |
| **Zustand v5** | Global State Management |
| **Tailwind CSS v3** | Styling & UI System |
| **Framer Motion v11** | Animations & Transitions |
| **perfect-freehand** | Smooth Brush Stroke Generation |
| **jsPDF** | Client-side PDF Generation |
| **localforage** | IndexedDB Auto-Save Persistence |
| **react-dnd** | Drag-and-Drop Layer Reordering |

---

## 📁 Project Directory Structure

```
designbox/
├── public/                     # Static assets (logo, favicon)
├── src/
│   ├── canvas/                 # Canvas engine & overlays
│   │   ├── CanvasEngine.tsx    # Main Fabric.js canvas wrapper
│   │   ├── CanvasEvents.ts     # Canvas event bus
│   │   ├── GridOverlay.tsx     # Canvas grid rendering
│   │   ├── RulerHorizontal.tsx # Top horizontal ruler
│   │   ├── RulerVertical.tsx   # Left vertical ruler
│   │   └── SelectionManager.tsx# Active object selection overlay
│   ├── components/
│   │   ├── layout/             # Application structural layout
│   │   │   ├── TopMenuBar.tsx  # Menus (File, Edit, View, Filter, Select)
│   │   │   ├── LeftToolbar.tsx # Tool selection sidebar
│   │   │   ├── RightPanel.tsx  # Multi-tab panel container
│   │   │   └── BottomStatusBar.tsx # Status bar with stats & zoom
│   │   ├── modals/             # Floating modals
│   │   │   ├── ExportModal.tsx
│   │   │   ├── PrintModal.tsx
│   │   │   ├── BreakpointsModal.tsx
│   │   │   ├── DistortRenderModal.tsx
│   │   │   ├── RefineEdgeModal.tsx
│   │   │   └── PreferencesModal.tsx
│   │   ├── overlays/           # Context menus & toast container
│   │   │   ├── ContextMenu.tsx
│   │   │   └── ToastContainer.tsx
│   │   └── panels/             # Right sidebar panels
│   │       ├── AssetsPanel.tsx # Shapes, photos, fonts, templates
│   │       ├── NavigatorPanel.tsx # Mini-map navigator
│   │       ├── ArtboardsPanel.tsx # Multi-artboard manager
│   │       ├── LayerStylesPanel.tsx # 10 layer effects
│   │       ├── VectorEditorPanel.tsx # Path node editor
│   │       ├── AnimationTimelinePanel.tsx # Keyframe animation timeline
│   │       ├── PatternsPanel.tsx# Built-in patterns
│   │       ├── PluginsPanel.tsx # Extensions & API
│   │       └── NotesPanel.tsx   # Canvas sticky notes
│   ├── hooks/                  # Custom React hooks (useHistory, useAutoSave, etc.)
│   ├── store/                  # Zustand state stores (canvasStore, layersStore, etc.)
│   ├── tools/                  # Tool logic modules (BrushTool, PenTool, ShapeTool, etc.)
│   ├── types.ts                # Core TypeScript definitions
│   └── utils/                  # Utility engines (aiTools, distortFilters, printSystem, etc.)
├── index.html                  # HTML entry point
├── package.json
└── vite.config.ts
```

---

## 🎹 Keyboard Shortcuts Reference

| Shortcut | Action |
| :--- | :--- |
| `V` | Move Tool |
| `M` | Rect Selection Tool |
| `L` | Lasso Selection Tool |
| `W` | Magic Wand Tool |
| `C` | Crop Tool |
| `B` | Brush Tool |
| `E` | Eraser Tool |
| `S` | Clone Stamp Tool |
| `J` | Healing Brush Tool |
| `R` | Blur / Sharpen Tool |
| `P` | Pen Tool |
| `U` | Shape Tool |
| `G` | Fill / Gradient Fill |
| `I` | Eyedropper Tool |
| `T` | Text Tool |
| `N` | Sticky Notes Tool |
| `Z` | Zoom Tool |
| `H` | Hand / Pan Tool |
| `Ctrl + Z` | Undo |
| `Ctrl + Shift + Z` | Redo |
| `Ctrl + S` | Save Project |
| `Ctrl + P` | Print Document |
| `Ctrl + H` | Find & Replace |
| `Ctrl + K` | Preferences |
| `Ctrl + Alt + G` | Create Clipping Mask |
| `Delete` / `Backspace` | Delete Selected Layer |

---

## 💾 Project File Format (`.designbox`)

Projects are stored as JSON files containing full canvas object properties, layer hierarchy, metadata, artboards, and animation tracks:

```json
{
  "version": "1.0.0",
  "name": "Project Name",
  "width": 1920,
  "height": 1080,
  "dpi": 72,
  "background": "#ffffff",
  "canvas": { ... },
  "artboards": [ ... ],
  "animationTracks": [ ... ],
  "notes": [ ... ]
}
```

---

## 🏃 Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run TypeScript validation
npx tsc --noEmit

# Build production bundle
npm run build
```

---

## 📜 License

Distributed under the MIT License. Built with ❤️ by the DesignBox Team.
