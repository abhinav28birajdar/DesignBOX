import jsPDF from 'jspdf';
import { fabric } from 'fabric';

export interface PrintSettings {
  paperSize: 'A4' | 'Letter' | 'A3' | 'A5' | 'Legal';
  orientation: 'portrait' | 'landscape';
  margin: number; // in mm
  scale: number; // 0.5-2.0
  includeMetadata: boolean;
  centerOnPage: boolean;
}

export interface PrintJob {
  title: string;
  canvas: fabric.Canvas;
  settings: PrintSettings;
  timestamp: Date;
}

const PAPER_SIZES: Record<string, { width: number; height: number }> = {
  'A4': { width: 210, height: 297 },
  'Letter': { width: 215.9, height: 279.4 },
  'A3': { width: 297, height: 420 },
  'A5': { width: 148, height: 210 },
  'Legal': { width: 215.9, height: 355.6 },
};

/**
 * Print a Fabric.js canvas
 */
export function printCanvas(job: PrintJob): void {
  const { canvas, settings } = job;
  const paperSize = PAPER_SIZES[settings.paperSize];
  
  // Create a print window
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    console.error('Could not open print window');
    return;
  }

  // Get canvas data
  const canvasElement = canvas.getElement();
  const dataUrl = canvasElement.toDataURL('image/png');

  // Create print HTML
  const printHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${job.title}</title>
      <style>
        * { margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; }
        @page { 
          size: ${settings.paperSize} ${settings.orientation}; 
          margin: ${settings.margin}mm;
        }
        .print-container {
          width: 100%;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: ${settings.centerOnPage ? 'center' : 'flex-start'};
          padding: ${settings.margin}mm;
          box-sizing: border-box;
        }
        img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        .metadata {
          font-size: 8pt;
          color: #666;
          margin-top: 10mm;
          width: 100%;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="print-container">
        <img src="${dataUrl}" alt="${job.title}">
        ${settings.includeMetadata ? `
          <div class="metadata">
            <p>${job.title}</p>
            <p>Printed: ${job.timestamp.toLocaleString()}</p>
            <p>Size: ${settings.paperSize} - ${settings.orientation}</p>
          </div>
        ` : ''}
      </div>
      <script>
        window.print();
        setTimeout(() => window.close(), 1000);
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(printHTML);
  printWindow.document.close();
}

/**
 * Export canvas to PDF
 */
export async function exportCanvasToPDF(
  job: PrintJob,
  filename: string = 'export.pdf'
): Promise<void> {
  const { canvas, settings } = job;
  const paperSize = PAPER_SIZES[settings.paperSize];

  // Create PDF
  const pdf = new jsPDF({
    orientation: settings.orientation,
    unit: 'mm',
    format: settings.paperSize,
  });

  // Get canvas data
  const canvasElement = canvas.getElement();
  const imgData = canvasElement.toDataURL('image/png');

  // Calculate dimensions
  const margin = settings.margin;
  const pdfWidth = paperSize.width - margin * 2;
  const pdfHeight = paperSize.height - margin * 2;

  // Calculate aspect ratio and fit
  const canvasWidth = canvas.width || 1000;
  const canvasHeight = canvas.height || 750;
  const canvasRatio = canvasWidth / canvasHeight;
  const pdfRatio = pdfWidth / pdfHeight;

  let imgWidth = pdfWidth;
  let imgHeight = pdfHeight;

  if (canvasRatio > pdfRatio) {
    imgHeight = imgWidth / canvasRatio;
  } else {
    imgWidth = imgHeight * canvasRatio;
  }

  // Apply scale
  imgWidth *= settings.scale;
  imgHeight *= settings.scale;

  // Center if requested
  let x = margin;
  let y = margin;

  if (settings.centerOnPage) {
    x = (paperSize.width - imgWidth) / 2;
    y = (paperSize.height - imgHeight) / 2;
  }

  // Add image
  pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

  // Add metadata if requested
  if (settings.includeMetadata) {
    pdf.setFontSize(8);
    pdf.text(`${job.title}`, margin, paperSize.height - margin + 5);
    pdf.text(`Exported: ${job.timestamp.toLocaleString()}`, margin, paperSize.height - margin + 10);
  }

  // Save
  pdf.save(filename);
}

/**
 * Batch print multiple artboards
 */
export async function printArtboards(
  canvas: fabric.Canvas,
  artboards: Array<{ id: string; name: string; left: number; top: number; width: number; height: number }>,
  settings: PrintSettings
): Promise<void> {
  for (const artboard of artboards) {
    const job: PrintJob = {
      title: artboard.name,
      canvas: canvas,
      settings,
      timestamp: new Date(),
    };

    await exportCanvasToPDF(job, `${artboard.name}.pdf`);
  }
}

/**
 * Get print preview as data URL
 */
export function getPrintPreview(
  canvas: fabric.Canvas,
  settings: PrintSettings
): string {
  const paperSize = PAPER_SIZES[settings.paperSize];
  
  // Create preview canvas
  const previewCanvas = document.createElement('canvas');
  const dpi = 96; // screen DPI
  previewCanvas.width = (paperSize.width / 25.4) * dpi;
  previewCanvas.height = (paperSize.height / 25.4) * dpi;

  const ctx = previewCanvas.getContext('2d');
  if (!ctx) return '';

  // Draw white background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);

  // Draw border
  ctx.strokeStyle = '#cccccc';
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, previewCanvas.width, previewCanvas.height);

  // Draw margin guides
  const marginPx = (settings.margin / 25.4) * dpi;
  ctx.strokeStyle = '#e0e0e0';
  ctx.setLineDash([3, 3]);
  ctx.strokeRect(marginPx, marginPx, previewCanvas.width - marginPx * 2, previewCanvas.height - marginPx * 2);

  // Draw canvas content
  const contentWidth = previewCanvas.width - marginPx * 2;
  const contentHeight = previewCanvas.height - marginPx * 2;

  ctx.drawImage(
    canvas.getElement(),
    marginPx,
    marginPx,
    contentWidth,
    contentHeight
  );

  return previewCanvas.toDataURL();
}
