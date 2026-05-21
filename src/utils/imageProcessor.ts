import { clamp } from "@/utils/colorUtils";
import { imageDataRGBA } from "stackblur-canvas";

export interface AdjustmentInput {
  brightness?: number;
  contrast?: number;
  saturation?: number;
  hue?: number;
  blur?: number;
}

export const applyAdjustments = (data: ImageData, input: AdjustmentInput): ImageData => {
  const { brightness = 0, contrast = 0, saturation = 0, blur = 0 } = input;
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

  for (let i = 0; i < data.data.length; i += 4) {
    let r = data.data[i];
    let g = data.data[i + 1];
    let b = data.data[i + 2];

    r = clamp(factor * (r - 128) + 128 + brightness, 0, 255);
    g = clamp(factor * (g - 128) + 128 + brightness, 0, 255);
    b = clamp(factor * (b - 128) + 128 + brightness, 0, 255);

    const avg = (r + g + b) / 3;
    r = clamp(avg + (r - avg) * (1 + saturation / 100), 0, 255);
    g = clamp(avg + (g - avg) * (1 + saturation / 100), 0, 255);
    b = clamp(avg + (b - avg) * (1 + saturation / 100), 0, 255);

    data.data[i] = r;
    data.data[i + 1] = g;
    data.data[i + 2] = b;
  }

  if (blur > 0) {
    const radius = Math.max(1, Math.min(120, Math.round(blur)));
    imageDataRGBA(data, 0, 0, data.width, data.height, radius);
  }

  return data;
};
