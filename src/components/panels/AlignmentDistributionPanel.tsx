import { useCanvasStore } from '@/store/canvasStore';
import { useLayersStore } from '@/store/layersStore';
import Button from '@/components/ui/Button';

export const AlignmentDistributionPanel = () => {
  const canvas = useCanvasStore((state) => state.canvas);
  const syncFromCanvas = useLayersStore((state) => state.syncFromCanvas);
  
  if (!canvas) return null;
  const activeObjects = canvas.getActiveObjects() || [];

  const align = (direction: 'left' | 'center-h' | 'right' | 'top' | 'center-v' | 'bottom') => {
    if (activeObjects.length < 2) return;

    let bounds = { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity };
    
    // Calculate bounds of all selected objects
    activeObjects.forEach((obj) => {
      const left = obj.left || 0;
      const top = obj.top || 0;
      const right = left + (obj.width || 0);
      const bottom = top + (obj.height || 0);

      bounds.left = Math.min(bounds.left, left);
      bounds.top = Math.min(bounds.top, top);
      bounds.right = Math.max(bounds.right, right);
      bounds.bottom = Math.max(bounds.bottom, bottom);
    });

    // Apply alignment
    activeObjects.forEach((obj) => {
      switch (direction) {
        case 'left':
          obj.set({ left: bounds.left });
          break;
        case 'center-h':
          const centerH = bounds.left + (bounds.right - bounds.left) / 2;
          obj.set({ left: centerH - (obj.width || 0) / 2 });
          break;
        case 'right':
          obj.set({ left: bounds.right - (obj.width || 0) });
          break;
        case 'top':
          obj.set({ top: bounds.top });
          break;
        case 'center-v':
          const centerV = bounds.top + (bounds.bottom - bounds.top) / 2;
          obj.set({ top: centerV - (obj.height || 0) / 2 });
          break;
        case 'bottom':
          obj.set({ top: bounds.bottom - (obj.height || 0) });
          break;
      }
    });

    canvas.renderAll();
    syncFromCanvas(canvas);
  };

  const distribute = (direction: 'h' | 'v') => {
    if (activeObjects.length < 3) return;

    let bounds = { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity };
    
    activeObjects.forEach((obj) => {
      const left = obj.left || 0;
      const top = obj.top || 0;
      const right = left + (obj.width || 0);
      const bottom = top + (obj.height || 0);

      bounds.left = Math.min(bounds.left, left);
      bounds.top = Math.min(bounds.top, top);
      bounds.right = Math.max(bounds.right, right);
      bounds.bottom = Math.max(bounds.bottom, bottom);
    });

    if (direction === 'h') {
      const totalWidth = activeObjects.reduce((sum, obj) => sum + (obj.width || 0), 0);
      const availableSpace = bounds.right - bounds.left - totalWidth;
      const gap = availableSpace / (activeObjects.length - 1);

      let currentX = bounds.left;
      activeObjects
        .sort((a, b) => (a.left || 0) - (b.left || 0))
        .forEach((obj, idx) => {
          if (idx > 0) currentX += gap;
          obj.set({ left: currentX });
          currentX += obj.width || 0;
        });
    } else {
      const totalHeight = activeObjects.reduce((sum, obj) => sum + (obj.height || 0), 0);
      const availableSpace = bounds.bottom - bounds.top - totalHeight;
      const gap = availableSpace / (activeObjects.length - 1);

      let currentY = bounds.top;
      activeObjects
        .sort((a, b) => (a.top || 0) - (b.top || 0))
        .forEach((obj, idx) => {
          if (idx > 0) currentY += gap;
          obj.set({ top: currentY });
          currentY += obj.height || 0;
        });
    }

    canvas.renderAll();
    syncFromCanvas(canvas);
  };

  const snap = (target: 'grid' | 'guides') => {
    if (activeObjects.length === 0) return;

    if (target === 'grid') {
      const gridSize = 10;
      activeObjects.forEach((obj) => {
        obj.set({
          left: Math.round((obj.left || 0) / gridSize) * gridSize,
          top: Math.round((obj.top || 0) / gridSize) * gridSize,
        });
      });
    }

    canvas.renderAll();
    syncFromCanvas(canvas);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Horizontal Alignment */}
      <div>
        <h4 className="text-xs font-semibold text-slate-300 mb-2">Horizontal</h4>
        <div className="grid grid-cols-3 gap-1">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => align('left')}
            title="Align left edges"
            className="text-xs"
          >
            ◄
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => align('center-h')}
            title="Align horizontal centers"
            className="text-xs"
          >
            ⊗
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => align('right')}
            title="Align right edges"
            className="text-xs"
          >
            ►
          </Button>
        </div>
      </div>

      {/* Vertical Alignment */}
      <div>
        <h4 className="text-xs font-semibold text-slate-300 mb-2">Vertical</h4>
        <div className="grid grid-cols-3 gap-1">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => align('top')}
            title="Align top edges"
            className="text-xs"
          >
            ▲
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => align('center-v')}
            title="Align vertical centers"
            className="text-xs"
          >
            ⊕
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => align('bottom')}
            title="Align bottom edges"
            className="text-xs"
          >
            ▼
          </Button>
        </div>
      </div>

      {/* Distribution */}
      <div>
        <h4 className="text-xs font-semibold text-slate-300 mb-2">Distribute</h4>
        <div className="grid grid-cols-2 gap-1">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => distribute('h')}
            title="Distribute horizontally"
            className="text-xs"
          >
            ⟺ Horiz
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => distribute('v')}
            title="Distribute vertically"
            className="text-xs"
          >
            ⟷ Vert
          </Button>
        </div>
      </div>

      {/* Snap */}
      <div>
        <h4 className="text-xs font-semibold text-slate-300 mb-2">Snap</h4>
        <div className="grid grid-cols-2 gap-1">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => snap('grid')}
            title="Snap to 10px grid"
            className="text-xs"
          >
            📐 Grid
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => snap('guides')}
            title="Snap to guides"
            className="text-xs"
          >
            📏 Guides
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="bg-slate-800 rounded p-2 text-xs text-slate-400 border border-slate-700">
        <p>Select 2+ objects to align</p>
        <p>Select 3+ objects to distribute</p>
      </div>
    </div>
  );
};
