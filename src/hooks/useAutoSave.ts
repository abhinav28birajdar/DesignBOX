import { useEffect } from "react";
import localforage from "localforage";
import { useCanvasStore } from "@/store/canvasStore";

export const useAutoSave = () => {
  const canvas = useCanvasStore((state) => state.canvas);

  useEffect(() => {
    if (!canvas) return;

    const save = async () => {
      const payload = {
        app: "DesignBox",
        version: "1.0",
        modified: new Date().toISOString(),
        fabricJSON: canvas.toJSON(["data", "globalCompositeOperation"]),
      };
      await localforage.setItem("designbox_autosave", payload);
    };

    const interval = window.setInterval(save, 60000);
    const unload = () => {
      void save();
    };
    const visibility = () => {
      if (document.visibilityState === "hidden") {
        void save();
      }
    };

    window.addEventListener("beforeunload", unload);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("beforeunload", unload);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [canvas]);
};
