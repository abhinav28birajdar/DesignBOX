import { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import Checkbox from '@/components/ui/Checkbox';
import Slider from '@/components/ui/Slider';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Plus, ChevronDown, Trash2 } from '@/components/ui/Icons';
import { useCanvasStore } from '@/store/canvasStore';
import { useLayersStore } from '@/store/layersStore';

type EffectType = 'drop-shadow' | 'inner-shadow' | 'outer-glow' | 'inner-glow' | 'bevel' | 'satin' | 'color-overlay' | 'gradient-overlay' | 'pattern-overlay' | 'stroke';

interface LayerEffect {
  type: EffectType;
  enabled: boolean;
  params: Record<string, any>;
}

interface LayerStylesState {
  effects: LayerEffect[];
}

let copiedStyles: LayerEffect[] | null = null;

export const LayerStylesPanel = () => {
  const canvas = useCanvasStore((state) => state.canvas);
  const syncFromCanvas = useLayersStore((state) => state.syncFromCanvas);

  const [styles, setStyles] = useState<LayerStylesState>({
    effects: [
      {
        type: 'drop-shadow',
        enabled: false,
        params: {
          blendMode: 'multiply',
          color: '#000000',
          opacity: 0.5,
          angle: 45,
          distance: 5,
          spread: 0,
          size: 10,
        },
      },
      {
        type: 'inner-shadow',
        enabled: false,
        params: {
          blendMode: 'multiply',
          color: '#000000',
          opacity: 0.5,
          angle: 45,
          distance: 5,
          choke: 0,
          size: 10,
        },
      },
      {
        type: 'outer-glow',
        enabled: false,
        params: {
          blendMode: 'screen',
          opacity: 0.8,
          color: '#ffff00',
          spread: 0,
          size: 20,
        },
      },
      {
        type: 'color-overlay',
        enabled: false,
        params: {
          blendMode: 'normal',
          color: '#ff0000',
          opacity: 0.5,
        },
      },
      {
        type: 'stroke',
        enabled: false,
        params: {
          size: 2,
          position: 'outside', // inside, center, outside
          blendMode: 'normal',
          opacity: 1,
          color: '#000000',
        },
      },
    ],
  });

  const applyEffects = (newEffects: LayerEffect[]) => {
    if (!canvas) return;
    const active = canvas.getActiveObject() as any;
    if (!active) return;

    newEffects.forEach((eff) => {
      if (!eff.enabled) {
        if (eff.type === 'drop-shadow' || eff.type === 'outer-glow') {
          if (active.shadow) active.set('shadow', null);
        }
        if (eff.type === 'stroke') {
          active.set({ strokeWidth: 0 });
        }
        return;
      }

      if (eff.type === 'drop-shadow') {
        const angleRad = (eff.params.angle || 0) * (Math.PI / 180);
        const dist = eff.params.distance || 0;
        active.set(
          'shadow',
          new fabric.Shadow({
            color: eff.params.color || '#000000',
            blur: eff.params.size || 0,
            offsetX: Math.cos(angleRad) * dist,
            offsetY: Math.sin(angleRad) * dist,
          })
        );
      } else if (eff.type === 'outer-glow') {
        active.set(
          'shadow',
          new fabric.Shadow({
            color: eff.params.color || '#ffff00',
            blur: eff.params.size || 20,
            offsetX: 0,
            offsetY: 0,
          })
        );
      } else if (eff.type === 'stroke') {
        active.set({
          stroke: eff.params.color || '#000000',
          strokeWidth: eff.params.size || 1,
        });
      } else if (eff.type === 'color-overlay') {
        active.set('fill', eff.params.color || '#ff0000');
      }
    });

    canvas.renderAll();
    syncFromCanvas(canvas);
  };

  const toggleEffect = (index: number) => {
    const newEffects = [...styles.effects];
    newEffects[index].enabled = !newEffects[index].enabled;
    setStyles({ ...styles, effects: newEffects });
    applyEffects(newEffects);
  };

  const updateEffectParam = (effectIndex: number, paramKey: string, value: any) => {
    const newEffects = [...styles.effects];
    newEffects[effectIndex].params[paramKey] = value;
    setStyles({ ...styles, effects: newEffects });
    applyEffects(newEffects);
  };

  const removeEffect = (index: number) => {
    const newEffects = styles.effects.filter((_, i) => i !== index);
    setStyles({ ...styles, effects: newEffects });
    applyEffects(newEffects);
  };

  const handleCopyStyle = () => {
    copiedStyles = JSON.parse(JSON.stringify(styles.effects));
  };

  const handlePasteStyle = () => {
    if (!copiedStyles) return;
    const pasted = JSON.parse(JSON.stringify(copiedStyles));
    setStyles({ effects: pasted });
    applyEffects(pasted);
  };

  const getEffectTitle = (type: EffectType): string => {
    const titles: Record<EffectType, string> = {
      'drop-shadow': 'Drop Shadow',
      'inner-shadow': 'Inner Shadow',
      'outer-glow': 'Outer Glow',
      'inner-glow': 'Inner Glow',
      'bevel': 'Bevel & Emboss',
      'satin': 'Satin',
      'color-overlay': 'Color Overlay',
      'gradient-overlay': 'Gradient Overlay',
      'pattern-overlay': 'Pattern Overlay',
      'stroke': 'Stroke',
    };
    return titles[type];
  };

  return (
    <div className="flex flex-col gap-2 p-3 bg-gray-900 text-white h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Layer Styles</h3>
        <Button size="sm" variant="outline" className="h-6 w-6 p-0">
          <Plus className="w-3 h-3" />
        </Button>
      </div>

      <div className="overflow-y-auto flex-1 space-y-2">
        {styles.effects.map((effect, index) => (
          <div key={index} className="bg-gray-800 border border-gray-700 rounded">
            {/* Effect Header */}
            <div className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-750">
              <Checkbox
                checked={effect.enabled}
                onChange={() => toggleEffect(index)}
                className="w-4 h-4"
              />
              <ChevronDown className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-medium flex-1">{getEffectTitle(effect.type)}</span>
              <button
                onClick={() => removeEffect(index)}
                className="text-gray-500 hover:text-red-400"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>

            {/* Effect Parameters */}
            {effect.enabled && (
              <div className="p-2 space-y-2 border-t border-gray-700 text-xs">
                {/* Drop Shadow / Inner Shadow Parameters */}
                {(effect.type === 'drop-shadow' || effect.type === 'inner-shadow') && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-gray-400 mb-1">Angle</label>
                        <Slider
                          min={0}
                          max={360}
                          step={1}
                          value={[effect.params.angle]}
                          onChange={(val: number | number[]) => updateEffectParam(index, 'angle', Array.isArray(val) ? val[0] : val)}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-1">Distance</label>
                        <Slider
                          min={0}
                          max={100}
                          step={1}
                          value={[effect.params.distance]}
                          onChange={(val: number | number[]) => updateEffectParam(index, 'distance', Array.isArray(val) ? val[0] : val)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">Size</label>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[effect.params.size]}
                        onChange={(val) => updateEffectParam(index, 'size', Array.isArray(val) ? val[0] : val)}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">Opacity</label>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[effect.params.opacity * 100]}
                        onChange={(val) => updateEffectParam(index, 'opacity', (Array.isArray(val) ? val[0] : val) / 100)}
                      />
                    </div>
                  </>
                )}

                {/* Color Overlay Parameters */}
                {effect.type === 'color-overlay' && (
                  <>
                    <div>
                      <label className="block text-gray-400 mb-1">Color</label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={effect.params.color}
                          onChange={(e) => updateEffectParam(index, 'color', e.target.value)}
                          className="w-12 h-8"
                        />
                        <Input
                          value={effect.params.color}
                          onChange={(e) => updateEffectParam(index, 'color', e.target.value)}
                          className="flex-1 h-8 text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">Opacity</label>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[effect.params.opacity * 100]}
                        onChange={(val) => updateEffectParam(index, 'opacity', (Array.isArray(val) ? val[0] : val) / 100)}
                      />
                    </div>
                  </>
                )}

                {/* Stroke Parameters */}
                {effect.type === 'stroke' && (
                  <>
                    <div>
                      <label className="block text-gray-400 mb-1\">Size (px)</label>
                      <Slider
                        min={0}
                        max={50}
                        step={1}
                        value={[effect.params.size]}
                        onChange={(val) => updateEffectParam(index, 'size', Array.isArray(val) ? val[0] : val)}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">Color</label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={effect.params.color}
                          onChange={(e) => updateEffectParam(index, 'color', e.target.value)}
                          className="w-12 h-8"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">Position</label>
                      <select
                        value={effect.params.position}
                        onChange={(e) => updateEffectParam(index, 'position', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs"
                      >
                        <option value="inside">Inside</option>
                        <option value="center">Center</option>
                        <option value="outside">Outside</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Copy/Paste Buttons */}
      <div className="flex gap-2 pt-2 border-t border-gray-700">
        <Button size="sm" variant="outline" className="flex-1 h-7 text-xs" onClick={handleCopyStyle}>
          Copy Style
        </Button>
        <Button size="sm" variant="outline" className="flex-1 h-7 text-xs" onClick={handlePasteStyle}>
          Paste Style
        </Button>
      </div>
    </div>
  );
};
