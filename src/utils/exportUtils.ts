import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import type { fabric } from "fabric";

export const exportRaster = async (
  canvas: fabric.Canvas,
  format: "png" | "jpg" | "webp",
  quality: number,
  multiplier = 1
): Promise<void> => {
  const mime = format === "jpg" ? "jpeg" : format;
  const url = canvas.toDataURL({
    format: mime,
    quality: Math.max(0.1, Math.min(1, quality / 100)),
    multiplier,
  });
  saveAs(url, `designbox-export.${format === "jpg" ? "jpg" : format}`);
};

export const exportSvg = (canvas: fabric.Canvas): void => {
  const blob = new Blob([canvas.toSVG()], { type: "image/svg+xml;charset=utf-8" });
  saveAs(blob, "designbox-export.svg");
};

export const exportPdf = async (element: HTMLElement): Promise<void> => {
  const snap = await html2canvas(element, { backgroundColor: null });
  const img = snap.toDataURL("image/png");
  const pdf = new jsPDF({ unit: "px", format: [snap.width, snap.height] });
  pdf.addImage(img, "PNG", 0, 0, snap.width, snap.height);
  pdf.save("designbox-export.pdf");
};
