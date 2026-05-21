import { fabric } from 'fabric';

export interface Artboard {
  id: string;
  name: string;
  width: number;
  height: number;
  left: number;
  top: number;
  backgroundColor: string;
  visible: boolean;
  locked: boolean;
}

/**
 * Create a Fabric.js rectangle that represents an artboard
 */
export function createArtboardRect(artboard: Artboard): fabric.Rect {
  return new fabric.Rect({
    left: artboard.left,
    top: artboard.top,
    width: artboard.width,
    height: artboard.height,
    fill: artboard.backgroundColor,
    stroke: '#6366F1',
    strokeWidth: 2,
    strokeDashArray: [5, 5],
    selectable: true,
    evented: true,
    hasControls: true,
    hasBorders: true,
    name: `artboard-${artboard.id}`,
    data: { isArtboard: true, artboardId: artboard.id, artboardName: artboard.name },
  });
}

/**
 * Draw artboard guides/boundaries on canvas
 */
export function drawArtboards(canvas: fabric.Canvas, artboards: Artboard[]): void {
  // Remove existing artboard visuals
  const artboardRects = canvas.getObjects().filter((obj: any) => obj.data?.isArtboard);
  artboardRects.forEach((obj) => canvas.remove(obj));

  // Draw all artboards
  artboards.forEach((artboard) => {
    if (artboard.visible) {
      const rect = createArtboardRect(artboard);
      canvas.add(rect);
      canvas.sendToBack(rect);
    }
  });

  canvas.renderAll();
}

/**
 * Export all artboards as separate images/PDFs
 */
export function exportArtboards(
  canvas: fabric.Canvas,
  artboards: Artboard[],
  format: 'png' | 'jpg' | 'webp' = 'png'
): { name: string; data: string }[] {
  const results: { name: string; data: string }[] = [];

  artboards.forEach((artboard) => {
    // Get original canvas state
    const originalZoom = canvas.getZoom();
    const originalViewport = canvas.viewportTransform?.slice() || [1, 0, 0, 1, 0, 0];

    // Set canvas to show only this artboard
    canvas.setZoom(1);
    canvas.setViewportTransform([1, 0, 0, 1, -artboard.left, -artboard.top]);

    // Create temporary canvas for this artboard
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = artboard.width;
    tempCanvas.height = artboard.height;

    // Render to temp canvas
    const ctx = tempCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = artboard.backgroundColor;
      ctx.fillRect(0, 0, artboard.width, artboard.height);
      ctx.drawImage(canvas.getElement(), 0, 0);
    }

    // Export
    const mimeType = format === 'jpg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
    const dataUrl = tempCanvas.toDataURL(mimeType, format === 'jpg' ? 0.9 : undefined);
    results.push({ name: `${artboard.name}.${format}`, data: dataUrl });

    // Restore canvas
    canvas.setZoom(originalZoom);
    canvas.setViewportTransform(originalViewport);
  });

  canvas.renderAll();
  return results;
}

/**
 * Snap object to artboard boundaries
 */
export function snapToArtboard(
  obj: fabric.Object,
  artboard: Artboard,
  threshold: number = 10
): void {
  const objLeft = obj.left || 0;
  const objTop = obj.top || 0;
  const objRight = objLeft + (obj.width || 0);
  const objBottom = objTop + (obj.height || 0);

  const abRight = artboard.left + artboard.width;
  const abBottom = artboard.top + artboard.height;

  // Snap to left edge
  if (Math.abs(objLeft - artboard.left) < threshold) {
    obj.set({ left: artboard.left });
  }
  // Snap to right edge
  if (Math.abs(objRight - abRight) < threshold) {
    obj.set({ left: abRight - (obj.width || 0) });
  }
  // Snap to top edge
  if (Math.abs(objTop - artboard.top) < threshold) {
    obj.set({ top: artboard.top });
  }
  // Snap to bottom edge
  if (Math.abs(objBottom - abBottom) < threshold) {
    obj.set({ top: abBottom - (obj.height || 0) });
  }
}

/**
 * Constrain object to stay within artboard
 */
export function constrainToArtboard(
  obj: fabric.Object,
  artboard: Artboard
): void {
  const objLeft = Math.max(artboard.left, Math.min(obj.left || 0, artboard.left + artboard.width - (obj.width || 0)));
  const objTop = Math.max(artboard.top, Math.min(obj.top || 0, artboard.top + artboard.height - (obj.height || 0)));

  obj.set({ left: objLeft, top: objTop });
}
