# DesignBox

DesignBox is a browser-first photo and graphic editor built with React 18 + TypeScript + Fabric.js.

Tagline: Design Without Limits

## Stack

- Vite + React 18 + TypeScript (strict)
- Fabric.js v5 canvas engine
- Zustand global state
- Tailwind CSS UI styling
- Framer Motion transitions
- react-colorful color controls
- localforage IndexedDB persistence
- file-saver + jsPDF + SVG export
- react-dnd layer drag-reorder
- react-tooltip toolbar tooltips
- react-hotkeys-hook keyboard shortcuts
- perfect-freehand stroke smoothing
- stackblur-canvas image blur processing

## Run

```bash
npm install
npm run dev
```

Local URL:

- http://localhost:5173

Validation:

```bash
npm run lint
npm run build
```

## Current Feature Coverage

- DesignBox branding: logo, favicon, title, top bar identity
- Dark-first design system with light theme toggle
- Canvas workspace with zoom (10% to 3200%), grid overlay, and wheel zoom
- Tool system wired to Fabric for move/select/lasso/magic-wand/crop/brush/eraser/fill/eyedropper/text/shape/clone/pen
- Smooth brush path generation using perfect-freehand
- Layers panel with rename, visibility, lock, opacity, blend mode, duplicate/delete
- Drag-and-drop layer reordering with canvas z-index sync
- Adjustment panel with pixel-level brightness/contrast/saturation and blur processing
- History snapshots with undo/redo and timeline jump panel
- File open, project save/load (.designbox), auto-save to IndexedDB, and export modal
- Keyboard shortcuts powered by react-hotkeys-hook
- Toolbar hover tooltips powered by react-tooltip

## Persistence

- Auto-save key: designbox_autosave (IndexedDB via localforage)
- Project extension: .designbox

## Notes

- The app is fully frontend-only and runs without backend services.
- Build currently emits a large bundle warning due Fabric.js size; app still builds successfully.
