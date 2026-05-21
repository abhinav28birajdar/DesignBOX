import { useCallback } from "react";
import localforage from "localforage";
import type { fabric } from "fabric";
import { useCanvasStore } from "@/store/canvasStore";
import { exportPdf, exportRaster, exportSvg } from "@/utils/exportUtils";

export const useFileHandler = () => {
  const canvas = useCanvasStore((state) => state.canvas);

  const openImage = useCallback(
    async (file: File) => {
      if (!canvas) return;
      const bitmap = await createImageBitmap(file);
      const off = document.createElement("canvas");
      off.width = bitmap.width;
      off.height = bitmap.height;
      const ctx = off.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(bitmap, 0, 0);
      const dataUrl = off.toDataURL("image/png");
      const { fabric } = await import("fabric");
      fabric.Image.fromURL(dataUrl, (image) => {
        image.set({ left: 80, top: 80 });
        canvas.add(image);
        canvas.setActiveObject(image);
        canvas.renderAll();
      });
    },
    [canvas]
  );

  const saveProject = useCallback(async () => {
    if (!canvas) return;
    await localforage.setItem("designbox_autosave", {
      app: "DesignBox",
      version: "1.0",
      name: "Untitled",
      modified: new Date().toISOString(),
      fabricJSON: canvas.toJSON(["data", "globalCompositeOperation"]),
    });
  }, [canvas]);

  const saveAsProject = useCallback(() => {
    if (!canvas) return;
    const blob = new Blob(
      [
        JSON.stringify(
          {
            app: "DesignBox",
            version: "1.0",
            name: "Untitled",
            modified: new Date().toISOString(),
            fabricJSON: canvas.toJSON(["data", "globalCompositeOperation"]),
          },
          null,
          2
        ),
      ],
      { type: "application/json" }
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "project.designbox";
    a.click();
  }, [canvas]);

  const openProjectJson = useCallback(
    async (file: File) => {
      if (!canvas) return;
      const raw = await file.text();
      const parsed = JSON.parse(raw) as { fabricJSON: fabric.ICanvasOptions };
      canvas.loadFromJSON(parsed.fabricJSON, () => {
        canvas.renderAll();
      });
    },
    [canvas]
  );

  const exportFile = useCallback(
    async (format: "png" | "jpg" | "webp" | "svg" | "pdf", quality: number, multiplier: number) => {
      if (!canvas) return;
      if (format === "svg") {
        exportSvg(canvas);
        return;
      }
      if (format === "pdf") {
        const element = canvas.getElement();
        await exportPdf(element);
        return;
      }
      await exportRaster(canvas, format, quality, multiplier);
    },
    [canvas]
  );

  return { openImage, saveProject, saveAsProject, openProjectJson, exportFile };
};
