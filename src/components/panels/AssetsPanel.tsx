import { useState } from 'react';
import { fabric } from 'fabric';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import Input from '@/components/ui/Input';
import { Heart } from '@/components/ui/Icons';
import { useCanvasStore } from '@/store/canvasStore';
import { useLayersStore } from '@/store/layersStore';
import { useColorStore } from '@/store/colorStore';
import { useProjectStore } from '@/store/projectStore';
import { BUILTIN_SHAPES, PALETTES, BUILTIN_FONTS, TEMPLATE_PRESETS, STICKERS_PACK } from '@/utils/assetsLibrary';
import type { ShapeAsset } from '@/utils/assetsLibrary';

export const AssetsPanel = () => {
  const [selectedTab, setSelectedTab] = useState('shapes');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const canvas = useCanvasStore((state) => state.canvas);
  const syncFromCanvas = useLayersStore((state) => state.syncFromCanvas);

  const filteredShapes = BUILTIN_SHAPES.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addShapeToCanvas = async (shape: ShapeAsset) => {
    if (!canvas) return;

    try {
      // Create SVG text wrapper with namespace
      const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">${shape.svg}</svg>`;
      
      // Load SVG into Fabric
      fabric.loadSVGFromString(svgString, (objects, options) => {
        if (objects.length === 0) return;
        
        let obj: fabric.Object;
        if (objects.length === 1) {
          obj = objects[0];
        } else {
          obj = new fabric.Group(objects, options);
        }

        // Set properties
        obj.set({
          left: canvas.width! / 2 - 50,
          top: canvas.height! / 2 - 50,
          fill: '#6366F1',
          stroke: null,
        });

        canvas.add(obj);
        canvas.setActiveObject(obj);
        canvas.renderAll();
        syncFromCanvas(canvas);
      });
    } catch (error) {
      console.error('Failed to add shape:', error);
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const addColorPaletteToSwatches = (paletteId: string) => {
    const palette = PALETTES.find((p) => p.id === paletteId);
    if (palette) {
      palette.colors.forEach((color) => {
        useColorStore.getState().addSwatch(color);
      });
      useColorStore.getState().setForeground(palette.colors[0]);
    }
  };

  const applyFontToCanvas = (font: string) => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (active && (active.type === 'textbox' || active.type === 'text' || active.type === 'i-text')) {
      (active as fabric.Textbox).set('fontFamily', font);
      canvas.renderAll();
    } else {
      const textObj = new fabric.IText(font, {
        left: canvas.width! / 2 - 50,
        top: canvas.height! / 2 - 20,
        fontFamily: font,
        fontSize: 32,
        fill: useColorStore.getState().foreground || '#ffffff',
      });
      canvas.add(textObj);
      canvas.setActiveObject(textObj);
      canvas.renderAll();
      syncFromCanvas(canvas);
    }
  };

  const addStickerToCanvas = (sticker: { name: string; url: string }) => {
    if (!canvas) return;
    const stickerObj = new fabric.IText(sticker.url, {
      left: canvas.width! / 2 - 25,
      top: canvas.height! / 2 - 25,
      fontSize: 48,
    });
    canvas.add(stickerObj);
    canvas.setActiveObject(stickerObj);
    canvas.renderAll();
    syncFromCanvas(canvas);
  };

  const applyTemplate = (template: { name: string; size: string }) => {
    if (!canvas) return;
    const activeTab = useProjectStore.getState().tabs.find((t) => t.id === useProjectStore.getState().activeTabId);
    if (!activeTab) return;

    const [wStr, hStr] = template.size.split('x').map((s) => s.trim().replace('px', ''));
    const w = parseInt(wStr, 10);
    const h = parseInt(hStr, 10);

    if (!isNaN(w) && !isNaN(h)) {
      canvas.setWidth(w);
      canvas.setHeight(h);
      useProjectStore.setState((state) => ({
        tabs: state.tabs.map((t) => (t.id === activeTab.id ? { ...t, width: w, height: h } : t)),
      }));
      canvas.renderAll();
    }
  };

  return (
    <div className="flex h-full flex-col bg-slate-900 text-white">
      <h3 className="border-b border-slate-700 px-4 py-3 font-semibold">Assets</h3>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex flex-col flex-1 overflow-hidden">
        <TabsList className="h-auto gap-1 rounded-none border-b border-slate-700 bg-slate-800 p-2">
          <TabsTrigger value="shapes" className="text-xs">Shapes</TabsTrigger>
          <TabsTrigger value="colors" className="text-xs">Colors</TabsTrigger>
          <TabsTrigger value="fonts" className="text-xs">Fonts</TabsTrigger>
          <TabsTrigger value="templates" className="text-xs">Templates</TabsTrigger>
          <TabsTrigger value="stickers" className="text-xs">Stickers</TabsTrigger>
        </TabsList>

        {/* Shapes Tab */}
        <TabsContent value="shapes" className="flex flex-col flex-1 overflow-hidden">
          <div className="border-b border-slate-700 p-2">
            <Input
              placeholder="Search shapes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-800 text-xs"
            />
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredShapes.length === 0 ? (
              <p className="text-center text-slate-400 text-sm">No shapes found</p>
            ) : (
              <div className="space-y-2">
                {Array.from(new Set(filteredShapes.map((s) => s.category))).map((category) => (
                  <div key={category}>
                    <h4 className="text-xs font-semibold text-slate-300 mb-1">{category}</h4>
                    <div className="grid grid-cols-4 gap-1">
                      {filteredShapes
                        .filter((s) => s.category === category)
                        .map((shape) => (
                          <div
                            key={shape.id}
                            className="group relative aspect-square cursor-pointer rounded bg-slate-800 p-2 hover:bg-slate-700 transition-colors"
                            onClick={() => addShapeToCanvas(shape)}
                            title={shape.name}
                          >
                            <div className="flex items-center justify-center h-full text-lg">{shape.preview}</div>
                            <button
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(shape.id);
                              }}
                            >
                              <Heart
                                className={`w-3 h-3 ${
                                  favorites.includes(shape.id)
                                    ? 'fill-red-500 text-red-500'
                                    : 'text-slate-400'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Colors Tab */}
        <TabsContent value="colors" className="flex-1 overflow-y-auto p-3">
          <div className="space-y-3">
            {PALETTES.map((palette) => (
              <div
                key={palette.id}
                className="rounded bg-slate-800 p-2 cursor-pointer hover:bg-slate-700 transition-colors"
                onClick={() => addColorPaletteToSwatches(palette.id)}
              >
                <p className="text-xs font-semibold mb-2">{palette.name}</p>
                <div className="flex gap-1">
                  {palette.colors.map((color) => (
                    <div
                      key={color}
                      className="h-8 flex-1 rounded border border-slate-600"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Fonts Tab */}
        <TabsContent value="fonts" className="flex-1 overflow-y-auto p-3">
          <div className="space-y-2">
            {BUILTIN_FONTS.map((font) => (
              <div
                key={font}
                className="rounded bg-slate-800 p-2 cursor-pointer hover:bg-slate-700 transition-colors text-sm"
                style={{ fontFamily: font }}
                onClick={() => applyFontToCanvas(font)}
              >
                {font}
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-2 gap-2">
            {TEMPLATE_PRESETS.map((template) => (
              <div
                key={template.id}
                className="rounded bg-slate-800 p-3 cursor-pointer hover:bg-slate-700 transition-colors"
                onClick={() => applyTemplate(template)}
              >
                <p className="text-xs font-semibold">{template.name}</p>
                <p className="text-xs text-slate-400 mt-1">{template.size}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Stickers Tab */}
        <TabsContent value="stickers" className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-4 gap-2">
            {STICKERS_PACK.map((sticker, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center aspect-square rounded bg-slate-800 text-3xl cursor-pointer hover:bg-slate-700 transition-colors"
                onClick={() => addStickerToCanvas(sticker)}
                title={sticker.name}
              >
                {sticker.url}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
