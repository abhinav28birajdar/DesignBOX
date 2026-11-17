import { useState } from 'react';
import { fabric } from 'fabric';
import { useCanvasStore } from '@/store/canvasStore';
import { useLayersStore } from '@/store/layersStore';
import Button from '@/components/ui/Button';
import Slider from '@/components/ui/Slider';

export default function MaskingPanel() {
  const canvas = useCanvasStore((state) => state.canvas);
  const { layers, syncFromCanvas } = useLayersStore();
  const [maskType, setMaskType] = useState<'reveal' | 'hide'>('reveal');
  const [featherAmount, setFeatherAmount] = useState(0);

  const handleAddMask = () => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) {
      alert('Select a layer to apply a mask');
      return;
    }

    const width = active.width || 100;
    const height = active.height || 100;

    const clipRect = new fabric.Rect({
      left: maskType === 'reveal' ? -width / 2 : 0,
      top: maskType === 'reveal' ? -height / 2 : 0,
      width: maskType === 'reveal' ? width : 0,
      height: maskType === 'reveal' ? height : 0,
      originX: 'center',
      originY: 'center',
      rx: featherAmount,
      ry: featherAmount,
    });

    active.set('clipPath', clipRect);
    canvas.renderAll();
    syncFromCanvas(canvas);
  };

  const handleAddClippingMask = () => {
    if (!canvas) return;
    const objects = canvas.getObjects();
    const active = canvas.getActiveObject();
    if (!active || objects.length < 2) {
      alert('Requires at least 2 layers on canvas to create a clipping mask');
      return;
    }

    const activeIndex = objects.indexOf(active);
    if (activeIndex <= 0) {
      alert('Select an object with a layer below it to clip against');
      return;
    }

    const maskObject = objects[activeIndex - 1];

    // Clone lower object as clipPath
    maskObject.clone((cloned: fabric.Object) => {
      cloned.set({
        originX: 'center',
        originY: 'center',
        left: 0,
        top: 0,
      });
      active.set('clipPath', cloned);
      canvas.renderAll();
      syncFromCanvas(canvas);
    });
  };

  const handleAddVectorMask = () => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;

    const circleMask = new fabric.Circle({
      radius: Math.min(active.width || 100, active.height || 100) / 2,
      originX: 'center',
      originY: 'center',
      left: 0,
      top: 0,
    });

    active.set('clipPath', circleMask);
    canvas.renderAll();
    syncFromCanvas(canvas);
  };

  const handleFeatherChange = (val: number) => {
    setFeatherAmount(val);
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (active && active.clipPath && active.clipPath.type === 'rect') {
      (active.clipPath as fabric.Rect).set({ rx: val, ry: val });
      canvas.renderAll();
    }
  };

  const handleRemoveMask = () => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (active) {
      active.set('clipPath', undefined);
      canvas.renderAll();
      syncFromCanvas(canvas);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-3">Layer Mask</h3>
        <div className="space-y-2 mb-3">
          <label className="text-xs text-text-secondary">Mask Type</label>
          <div className="flex gap-2">
            <button
              onClick={() => setMaskType('reveal')}
              className={`flex-1 px-2 py-1 text-xs rounded ${
                maskType === 'reveal'
                  ? 'bg-accent text-white'
                  : 'bg-bg-surface text-text-secondary'
              }`}
            >
              Reveal All
            </button>
            <button
              onClick={() => setMaskType('hide')}
              className={`flex-1 px-2 py-1 text-xs rounded ${
                maskType === 'hide'
                  ? 'bg-accent text-white'
                  : 'bg-bg-surface text-text-secondary'
              }`}
            >
              Hide All
            </button>
          </div>
        </div>
        <Button variant="primary" size="sm" className="w-full" onClick={handleAddMask}>
          Add Layer Mask
        </Button>
      </div>

      <div className="border-t border-border pt-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Clipping Mask</h3>
        <Button variant="secondary" size="sm" className="w-full" onClick={handleAddClippingMask}>
          Create Clipping Mask
        </Button>
      </div>

      <div className="border-t border-border pt-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Vector Mask</h3>
        <Button variant="secondary" size="sm" className="w-full" onClick={handleAddVectorMask}>
          Add Vector Mask
        </Button>
      </div>

      <div className="border-t border-border pt-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Mask Options</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-text-secondary">Feather Edges (px)</label>
            <Slider
              value={[featherAmount]}
              onChange={(val) => handleFeatherChange(Array.isArray(val) ? val[0] : val)}
              min={0}
              max={100}
              step={1}
            />
          </div>
          <Button variant="secondary" size="sm" className="w-full bg-red-800 hover:bg-red-700 text-white" onClick={handleRemoveMask}>
            Remove Mask
          </Button>
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Focus Area</h3>
        <div className="space-y-2">
          <label className="text-xs text-text-secondary">Detect: Subject / Focus</label>
          <Button variant="secondary" size="sm" className="w-full">
            Auto Detect Focus
          </Button>
        </div>
      </div>
    </div>
  );
}
