import { useEffect, useRef, useState } from 'react';
import { useCanvasStore } from '@/store/canvasStore';
import { useLayersStore } from '@/store/layersStore';
import Slider from '@/components/ui/Slider';
import Button from '@/components/ui/Button';
import { ZoomIn, ZoomOut } from '@/components/ui/Icons';

export const NavigatorPanel = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas = useCanvasStore((state) => state.canvas);
  const zoom = useCanvasStore((state) => state.zoom);
  const setZoom = useCanvasStore((state) => state.setZoom);
  const pan = useCanvasStore((state) => state.pan);
  const setPan = useCanvasStore((state) => state.setPan);
  const layers = useLayersStore((state) => state.layers);

  const [isDragging, setIsDragging] = useState(false);
  const miniCanvasWidth = 180;
  const miniCanvasHeight = 140;

  // Update mini map every 500ms
  useEffect(() => {
    const interval = setInterval(() => {
      if (!canvas || !canvasRef.current) return;

      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = '#1E293B';
      ctx.fillRect(0, 0, miniCanvasWidth, miniCanvasHeight);

      // Draw canvas border
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, miniCanvasWidth - 1, miniCanvasHeight - 1);

      // Calculate scale for mini map
      const canvasWidth = canvas.width || 1000;
      const canvasHeight = canvas.height || 1000;
      const scale = Math.min(
        miniCanvasWidth / canvasWidth,
        miniCanvasHeight / canvasHeight
      );

      // Draw background
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, miniCanvasWidth, miniCanvasHeight);

      // Draw viewport indicator (red rectangle)
      const viewportWidth = (window.innerWidth / zoom) * scale;
      const viewportHeight = (window.innerHeight / zoom) * scale;
      const viewportX = (-pan.x / canvasWidth) * miniCanvasWidth * scale;
      const viewportY = (-pan.y / canvasHeight) * miniCanvasHeight * scale;

      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        Math.max(0, viewportX),
        Math.max(0, viewportY),
        Math.min(miniCanvasWidth, viewportWidth),
        Math.min(miniCanvasHeight, viewportHeight)
      );

      // Draw small objects as blue boxes (for reference)
      const objects = canvas.getObjects();
      objects.forEach((obj) => {
        if (obj.left !== undefined && obj.top !== undefined) {
          const x = ((obj.left || 0) / canvasWidth) * miniCanvasWidth;
          const y = ((obj.top || 0) / canvasHeight) * miniCanvasHeight;
          const w = Math.max(2, ((obj.width || 50) / canvasWidth) * miniCanvasWidth);
          const h = Math.max(2, ((obj.height || 50) / canvasHeight) * miniCanvasHeight);

          if (x + w > 0 && x < miniCanvasWidth && y + h > 0 && y < miniCanvasHeight) {
            ctx.fillStyle = '#60A5FA';
            ctx.fillRect(
              Math.max(0, x),
              Math.max(0, y),
              Math.min(miniCanvasWidth - x, w),
              Math.min(miniCanvasHeight - y, h)
            );
          }
        }
      });
    }, 500);

    return () => clearInterval(interval);
  }, [canvas, zoom, pan, miniCanvasWidth, miniCanvasHeight]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvas || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const canvasWidth = canvas.width || 1000;
    const canvasHeight = canvas.height || 1000;
    const scale = Math.min(miniCanvasWidth / canvasWidth, miniCanvasHeight / canvasHeight);

    // Convert mini-map click to canvas pan
    const clickCanvasX = (x / scale) / zoom;
    const clickCanvasY = (y / scale) / zoom;

    setPan(
      -clickCanvasX + window.innerWidth / (2 * zoom),
      -clickCanvasY + window.innerHeight / (2 * zoom)
    );
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !canvas || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const canvasWidth = canvas.width || 1000;
    const canvasHeight = canvas.height || 1000;
    const scale = Math.min(miniCanvasWidth / canvasWidth, miniCanvasHeight / canvasHeight);

    const clickCanvasX = (x / scale) / zoom;
    const clickCanvasY = (y / scale) / zoom;

    setPan(
      -clickCanvasX + window.innerWidth / (2 * zoom),
      -clickCanvasY + window.innerHeight / (2 * zoom)
    );
  };

  const handleZoomChange = (value: number | number[]) => {
    const zoomValue = Array.isArray(value) ? value[0] : value;
    setZoom(zoomValue / 100);
  };

  const handleQuickZoom = (zoomLevel: number) => {
    setZoom(zoomLevel);
  };

  const handleFitToCanvas = () => {
    if (!canvas) return;
    const scale = Math.min(
      window.innerWidth / (canvas.width || 1000),
      window.innerHeight / (canvas.height || 1000)
    );
    setZoom(scale);
    setPan(0, 0);
  };

  return (
    <div className="flex h-full flex-col bg-slate-900 text-white">
      <h3 className="border-b border-slate-700 px-4 py-3 font-semibold">Navigator</h3>

      <div className="flex-1 overflow-y-auto flex flex-col gap-4 p-3">
        {/* Mini Map Canvas */}
        <div className="border border-slate-700 rounded bg-slate-800 p-2">
          <canvas
            ref={canvasRef}
            width={miniCanvasWidth}
            height={miniCanvasHeight}
            onClick={handleCanvasClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseUp}
            className="w-full border border-slate-600 rounded cursor-move hover:border-slate-500 transition-colors bg-slate-950"
            title="Click to pan, drag the red rectangle to navigate"
          />
          <p className="text-xs text-slate-400 mt-2 text-center">
            {canvas?.width || 1000} × {canvas?.height || 1000}px
          </p>
        </div>

        {/* Zoom Display */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{Math.round(zoom * 100)}%</span>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleQuickZoom(0.5)}
              title="Zoom to 50%"
              className="text-xs"
            >
              50%
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleQuickZoom(1)}
              title="Zoom to 100%"
              className="text-xs"
            >
              100%
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleQuickZoom(2)}
              title="Zoom to 200%"
              className="text-xs"
            >
              200%
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleFitToCanvas}
              title="Fit entire canvas to view"
              className="text-xs"
            >
              Fit
            </Button>
          </div>
        </div>

        {/* Zoom Slider */}
        <div className="flex items-center gap-2">
          <ZoomOut className="w-4 h-4 text-slate-400" />
          <Slider
            value={zoom * 100}
            onChange={handleZoomChange}
            min={10}
            max={320}
            step={10}
            className="flex-1"
          />
          <ZoomIn className="w-4 h-4 text-slate-400" />
        </div>

        {/* Info */}
        <div className="bg-slate-800 rounded p-3 text-xs space-y-1 border border-slate-700">
          <p><span className="text-slate-400">Click:</span> Pan to location</p>
          <p><span className="text-slate-400">Drag:</span> Move viewport rect</p>
          <p><span className="text-slate-400">Layers:</span> {layers.length}</p>
        </div>
      </div>
    </div>
  );
};
