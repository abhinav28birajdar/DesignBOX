import { useEffect, useRef } from "react";

export type AdjustmentLayer = {
  id: string;
  enabled: boolean;
  mode:
    | "brightness-contrast"
    | "hue-saturation"
    | "vibrance"
    | "threshold"
    | "invert"
    | "posterize"
    | "exposure";
  values: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    hue?: number;
    vibrance?: number;
    threshold?: number;
    posterize?: number;
    exposure?: number;
  };
};

export const useAdjustmentWorker = () => {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const worker = new Worker(new URL("../workers/imageProcessor.worker.ts", import.meta.url), { type: "module" });
    workerRef.current = worker;

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  const process = (imageData: ImageData, layers: AdjustmentLayer[]): Promise<ImageData> => {
    return new Promise((resolve, reject) => {
      const worker = workerRef.current;
      if (!worker) {
        reject(new Error("Adjustment worker is not available"));
        return;
      }

      const onMessage = (event: MessageEvent<{ imageData: ImageData }>) => {
        worker.removeEventListener("message", onMessage as EventListener);
        resolve(event.data.imageData);
      };
      const onError = (event: ErrorEvent) => {
        worker.removeEventListener("error", onError as EventListener);
        reject(event.error || new Error(event.message));
      };

      worker.addEventListener("message", onMessage as EventListener, { once: true });
      worker.addEventListener("error", onError as EventListener, { once: true });
      worker.postMessage({ imageData, layers });
    });
  };

  return { process };
};
