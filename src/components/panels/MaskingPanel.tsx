import { useState } from 'react';
import { useCanvas } from '@/hooks/useCanvas';
import { useLayersStore } from '@/store/layersStore';
import Button from '@/components/ui/Button';
import Slider from '@/components/ui/Slider';

export default function MaskingPanel() {
  const { canvas } = useCanvas();
  const { layers } = useLayersStore();
  const [maskType, setMaskType] = useState<'reveal' | 'hide'>('reveal');
  const [featherAmount, setFeatherAmount] = useState(0);

  const handleAddMask = () => {
    if (canvas && layers.length > 0) {
      console.log('Adding layer mask with type:', maskType);
    }
  };

  const handleAddClippingMask = () => {
    if (canvas && layers.length > 0) {
      console.log('Creating clipping mask');
    }
  };

  const handleAddVectorMask = () => {
    if (canvas && layers.length > 0) {
      console.log('Adding vector mask');
    }
  };

  const handleRefineMask = () => {
    console.log('Opening Refine Edge dialog');
  };

  const handleApplyMask = () => {
    if (layers.length > 0) {
      console.log('Flattening mask into layer');
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
              value={featherAmount}
              onChange={(val) => setFeatherAmount(Array.isArray(val) ? val[0] : val)}
              min={0}
              max={250}
              step={1}
            />
          </div>
          <Button variant="secondary" size="sm" className="w-full" onClick={handleRefineMask}>
            Refine Edge
          </Button>
          <Button variant="secondary" size="sm" className="w-full" onClick={handleApplyMask}>
            Apply Mask
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
