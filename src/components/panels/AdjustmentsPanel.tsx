import { useEffect, useState } from "react";
import { fabric } from "fabric";
import { useCanvasStore } from "@/store/canvasStore";
import { useAdjustmentWorker, type AdjustmentLayer } from "@/hooks/useAdjustmentWorker";
import { useHistory } from "@/hooks/useHistory";

const createLayer = (): AdjustmentLayer => ({
  id: crypto.randomUUID(),
  enabled: true,
  mode: "brightness-contrast",
  values: {
    brightness: 0,
    contrast: 0,
    saturation: 0,
  },
});

const layerModes: Array<{ value: AdjustmentLayer["mode"]; label: string }> = [
  { value: "brightness-contrast", label: "Brightness / Contrast" },
  { value: "hue-saturation", label: "Hue / Saturation" },
  { value: "vibrance", label: "Vibrance" },
  { value: "threshold", label: "Threshold" },
  { value: "invert", label: "Invert" },
  { value: "posterize", label: "Posterize" },
  { value: "exposure", label: "Exposure" },
];

const getSourceFromObject = (obj: fabric.Object): string | null => {
  const stored = obj.data?.originalDataUrl as string | undefined;
  if (stored) return stored;
  const element = (obj as unknown as { _element?: HTMLImageElement })._element;
  return element?.src || null;
};

export default function AdjustmentsPanel() {
  const canvas = useCanvasStore((state) => state.canvas);
  const { process } = useAdjustmentWorker();
  const { snapshot } = useHistory();

  const [layers, setLayers] = useState<AdjustmentLayer[]>([createLayer()]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeObject = canvas?.getActiveObject() ?? null;
  const activeImage = activeObject && activeObject.type === "image" ? activeObject : null;

  useEffect(() => {
    if (!activeImage) {
      setLayers([createLayer()]);
      return;
    }
    const existing = activeImage.data?.adjustmentLayers as AdjustmentLayer[] | undefined;
    if (existing && existing.length > 0) {
      setLayers(existing);
    } else {
      setLayers([createLayer()]);
    }
  }, [activeImage]);

  const commitAdjustments = async (nextLayers: AdjustmentLayer[]) => {
    if (!canvas || !activeImage) return;

    const sourceUrl = getSourceFromObject(activeImage);
    if (!sourceUrl) {
      setError("Selected image cannot be processed.");
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load source image"));
        img.src = sourceUrl;
      });

      const temp = document.createElement("canvas");
      temp.width = img.naturalWidth || img.width;
      temp.height = img.naturalHeight || img.height;
      const ctx = temp.getContext("2d");
      if (!ctx) {
        throw new Error("Cannot create image context");
      }

      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, temp.width, temp.height);
      const output = await process(data, nextLayers);
      ctx.putImageData(output, 0, 0);

      const url = temp.toDataURL("image/png");
      fabric.Image.fromURL(url, (newImage) => {
        newImage.set({
          left: activeImage.left,
          top: activeImage.top,
          scaleX: activeImage.scaleX,
          scaleY: activeImage.scaleY,
          angle: activeImage.angle,
          flipX: activeImage.flipX,
          flipY: activeImage.flipY,
          opacity: activeImage.opacity,
          data: {
            ...(activeImage.data || {}),
            originalDataUrl: sourceUrl,
            adjustmentLayers: nextLayers,
          },
        });

        canvas.remove(activeImage);
        canvas.add(newImage);
        canvas.setActiveObject(newImage);
        canvas.renderAll();
        snapshot("Apply Adjustment Layer");
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to process adjustments";
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  const updateLayer = (layerId: string, updater: (layer: AdjustmentLayer) => AdjustmentLayer) => {
    const next = layers.map((layer) => (layer.id === layerId ? updater(layer) : layer));
    setLayers(next);
    void commitAdjustments(next);
  };

  return (
    <div className="panel mt-3 rounded-md p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Adjustments</h3>
        <button
          className="rounded bg-indigo-600 px-2 py-1 text-xs text-white"
          onClick={() => {
            const next = [...layers, createLayer()];
            setLayers(next);
            void commitAdjustments(next);
          }}
          disabled={!activeImage || busy}
        >
          + Layer
        </button>
      </div>

      {!activeImage ? <p className="text-xs text-slate-400">Select an image layer to edit adjustments.</p> : null}

      {error ? <p className="mb-2 rounded bg-red-900/40 px-2 py-1 text-xs text-red-300">{error}</p> : null}
      {busy ? <p className="mb-2 text-xs text-slate-400">Processing...</p> : null}

      {activeImage ? (
        <div className="max-h-64 space-y-2 overflow-auto pr-1">
          {layers.map((layer, index) => (
            <div key={layer.id} className="surface rounded p-2 text-xs">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium">Adjustment {index + 1}</span>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={layer.enabled}
                      onChange={(event) => updateLayer(layer.id, (current) => ({ ...current, enabled: event.target.checked }))}
                    />
                    On
                  </label>
                  <button
                    className="rounded bg-red-700 px-2 py-0.5"
                    onClick={() => {
                      const next = layers.filter((item) => item.id !== layer.id);
                      const safe = next.length > 0 ? next : [createLayer()];
                      setLayers(safe);
                      void commitAdjustments(safe);
                    }}
                  >
                    Del
                  </button>
                </div>
              </div>

              <select
                className="mb-2 w-full rounded bg-slate-800 px-2 py-1"
                value={layer.mode}
                onChange={(event) =>
                  updateLayer(layer.id, (current) => ({
                    ...current,
                    mode: event.target.value as AdjustmentLayer["mode"],
                    values: {},
                  }))
                }
              >
                {layerModes.map((mode) => (
                  <option key={mode.value} value={mode.value}>{mode.label}</option>
                ))}
              </select>

              {layer.mode === "brightness-contrast" ? (
                <>
                  <label className="mb-1 block">Brightness: {Math.round(layer.values.brightness ?? 0)}</label>
                  <input
                    className="mb-2 w-full"
                    type="range"
                    min={-150}
                    max={150}
                    value={layer.values.brightness ?? 0}
                    onChange={(event) => updateLayer(layer.id, (current) => ({ ...current, values: { ...current.values, brightness: Number(event.target.value) } }))}
                  />
                  <label className="mb-1 block">Contrast: {Math.round(layer.values.contrast ?? 0)}</label>
                  <input
                    className="w-full"
                    type="range"
                    min={-150}
                    max={150}
                    value={layer.values.contrast ?? 0}
                    onChange={(event) => updateLayer(layer.id, (current) => ({ ...current, values: { ...current.values, contrast: Number(event.target.value) } }))}
                  />
                </>
              ) : null}

              {layer.mode === "hue-saturation" ? (
                <>
                  <label className="mb-1 block">Hue: {Math.round(layer.values.hue ?? 0)}</label>
                  <input
                    className="mb-2 w-full"
                    type="range"
                    min={-180}
                    max={180}
                    value={layer.values.hue ?? 0}
                    onChange={(event) => updateLayer(layer.id, (current) => ({ ...current, values: { ...current.values, hue: Number(event.target.value) } }))}
                  />
                  <label className="mb-1 block">Saturation: {Math.round(layer.values.saturation ?? 0)}</label>
                  <input
                    className="w-full"
                    type="range"
                    min={-100}
                    max={100}
                    value={layer.values.saturation ?? 0}
                    onChange={(event) => updateLayer(layer.id, (current) => ({ ...current, values: { ...current.values, saturation: Number(event.target.value) } }))}
                  />
                </>
              ) : null}

              {layer.mode === "vibrance" ? (
                <>
                  <label className="mb-1 block">Vibrance: {Math.round(layer.values.vibrance ?? 0)}</label>
                  <input
                    className="w-full"
                    type="range"
                    min={-100}
                    max={100}
                    value={layer.values.vibrance ?? 0}
                    onChange={(event) => updateLayer(layer.id, (current) => ({ ...current, values: { ...current.values, vibrance: Number(event.target.value) } }))}
                  />
                </>
              ) : null}

              {layer.mode === "threshold" ? (
                <>
                  <label className="mb-1 block">Threshold: {Math.round(layer.values.threshold ?? 128)}</label>
                  <input
                    className="w-full"
                    type="range"
                    min={0}
                    max={255}
                    value={layer.values.threshold ?? 128}
                    onChange={(event) => updateLayer(layer.id, (current) => ({ ...current, values: { ...current.values, threshold: Number(event.target.value) } }))}
                  />
                </>
              ) : null}

              {layer.mode === "posterize" ? (
                <>
                  <label className="mb-1 block">Levels: {Math.round(layer.values.posterize ?? 6)}</label>
                  <input
                    className="w-full"
                    type="range"
                    min={2}
                    max={24}
                    value={layer.values.posterize ?? 6}
                    onChange={(event) => updateLayer(layer.id, (current) => ({ ...current, values: { ...current.values, posterize: Number(event.target.value) } }))}
                  />
                </>
              ) : null}

              {layer.mode === "exposure" ? (
                <>
                  <label className="mb-1 block">Exposure: {(layer.values.exposure ?? 0).toFixed(2)} EV</label>
                  <input
                    className="w-full"
                    type="range"
                    min={-3}
                    max={3}
                    step={0.1}
                    value={layer.values.exposure ?? 0}
                    onChange={(event) => updateLayer(layer.id, (current) => ({ ...current, values: { ...current.values, exposure: Number(event.target.value) } }))}
                  />
                </>
              ) : null}

              {layer.mode === "invert" ? <p className="text-slate-400">No extra controls.</p> : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
