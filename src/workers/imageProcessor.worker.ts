type AdjustmentLayer = {
  id: string;
  enabled: boolean;
  mode:
    | "brightness-contrast"
    | "hue-saturation"
    | "vibrance"
    | "threshold"
    | "invert"
    | "posterize"
    | "exposure"
    | "levels"
    | "curves"
    | "color-balance"
    | "black-white"
    | "photo-filter"
    | "channel-mixer"
    | "gradient-map"
    | "selective-color"
    | "blur"
    | "sharpen"
    | "noise-add"
    | "noise-reduce"
    | "vignette";
  values: Record<string, unknown>;
};

interface WorkerRequest {
  imageData: ImageData;
  layers: AdjustmentLayer[];
}

interface WorkerResponse {
  imageData: ImageData;
}

const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));

const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }

  return [h, s, l];
};

const hue2rgb = (p: number, q: number, t: number): number => {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
};

const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = hue2rgb(p, q, h + 1 / 3);
  const g = hue2rgb(p, q, h);
  const b = hue2rgb(p, q, h - 1 / 3);
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

const applyLayer = (imageData: ImageData, layer: AdjustmentLayer) => {
  const d = imageData.data;

  if (layer.mode === "invert") {
    for (let i = 0; i < d.length; i += 4) {
      d[i] = 255 - d[i];
      d[i + 1] = 255 - d[i + 1];
      d[i + 2] = 255 - d[i + 2];
    }
    return;
  }

  if (layer.mode === "threshold") {
    const threshold = clamp(layer.values.threshold as number ?? 128, 0, 255);
    for (let i = 0; i < d.length; i += 4) {
      const l = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
      const v = l >= threshold ? 255 : 0;
      d[i] = v;
      d[i + 1] = v;
      d[i + 2] = v;
    }
    return;
  }

  if (layer.mode === "posterize") {
    const levels = clamp(layer.values.posterize as number ?? 6, 2, 24);
    const step = 255 / (levels - 1);
    for (let i = 0; i < d.length; i += 4) {
      d[i] = Math.round(d[i] / step) * step;
      d[i + 1] = Math.round(d[i + 1] / step) * step;
      d[i + 2] = Math.round(d[i + 2] / step) * step;
    }
    return;
  }

  // Vignette effect
  if (layer.mode === "vignette") {
    const strength = clamp(layer.values.strength as number ?? 50, 0, 100) / 100;
    const centerX = imageData.width / 2;
    const centerY = imageData.height / 2;
    const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

    for (let i = 0; i < d.length; i += 4) {
      const idx = i / 4;
      const x = idx % imageData.width;
      const y = Math.floor(idx / imageData.width);
      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy) / maxDist;
      const vignette = 1 - Math.pow(Math.min(1, dist * 1.5), 2) * strength;

      d[i] = clamp(d[i] * vignette, 0, 255);
      d[i + 1] = clamp(d[i + 1] * vignette, 0, 255);
      d[i + 2] = clamp(d[i + 2] * vignette, 0, 255);
    }
    return;
  }

  // Noise addition
  if (layer.mode === "noise-add") {
    const amount = clamp(layer.values.amount as number ?? 10, 0, 100) / 100;
    const isMono = layer.values.mono as boolean ?? false;

    for (let i = 0; i < d.length; i += 4) {
      const noise = (Math.random() - 0.5) * amount * 255;
      if (isMono) {
        d[i] = clamp(d[i] + noise, 0, 255);
        d[i + 1] = clamp(d[i + 1] + noise, 0, 255);
        d[i + 2] = clamp(d[i + 2] + noise, 0, 255);
      } else {
        d[i] = clamp(d[i] + (Math.random() - 0.5) * amount * 255, 0, 255);
        d[i + 1] = clamp(d[i + 1] + (Math.random() - 0.5) * amount * 255, 0, 255);
        d[i + 2] = clamp(d[i + 2] + (Math.random() - 0.5) * amount * 255, 0, 255);
      }
    }
    return;
  }

  for (let i = 0; i < d.length; i += 4) {
    let r = d[i];
    let g = d[i + 1];
    let b = d[i + 2];

    if (layer.mode === "brightness-contrast") {
      const brightness = (layer.values.brightness as number ?? 0) * 2;
      const contrast = layer.values.contrast as number ?? 0;
      const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
      r = clamp(factor * (r - 128) + 128 + brightness, 0, 255);
      g = clamp(factor * (g - 128) + 128 + brightness, 0, 255);
      b = clamp(factor * (b - 128) + 128 + brightness, 0, 255);
    }

    if (layer.mode === "hue-saturation") {
      const hueShift = ((layer.values.hue as number ?? 0) / 360);
      const satShift = ((layer.values.saturation as number ?? 0) / 100);
      const [h, s, l] = rgbToHsl(r, g, b);
      const nextH = (h + hueShift + 1) % 1;
      const nextS = clamp(s * (1 + satShift), 0, 1);
      [r, g, b] = hslToRgb(nextH, nextS, l);
    }

    if (layer.mode === "vibrance") {
      const amount = ((layer.values.vibrance as number ?? 0) / 100);
      const max = Math.max(r, g, b);
      const avg = (r + g + b) / 3;
      const delta = (max - avg) / 255;
      const gain = 1 + amount * (1 - delta);
      r = clamp(avg + (r - avg) * gain, 0, 255);
      g = clamp(avg + (g - avg) * gain, 0, 255);
      b = clamp(avg + (b - avg) * gain, 0, 255);
    }

    if (layer.mode === "exposure") {
      const exposure = layer.values.exposure as number ?? 0;
      const mul = Math.pow(2, exposure);
      r = clamp(r * mul, 0, 255);
      g = clamp(g * mul, 0, 255);
      b = clamp(b * mul, 0, 255);
    }

    if (layer.mode === "black-white") {
      const [, , l] = rgbToHsl(r, g, b);
      const gray = Math.round(l * 255);
      r = g = b = gray;
    }

    d[i] = r;
    d[i + 1] = g;
    d[i + 2] = b;
  }
};

// Advanced adjustments

// Gaussian Blur Filter
const gaussianBlur = (imageData: ImageData, radius: number) => {
  if (radius === 0) return;
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;

  // Simple box blur approximation (3 passes)
  const r = Math.ceil(radius);

  for (let pass = 0; pass < 1; pass++) {
    // Horizontal pass
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let rSum = 0, gSum = 0, bSum = 0, aSum = 0, count = 0;
        for (let kx = -r; kx <= r; kx++) {
          const px = clamp(x + kx, 0, width - 1);
          const idx = (y * width + px) * 4;
          rSum += data[idx];
          gSum += data[idx + 1];
          bSum += data[idx + 2];
          aSum += data[idx + 3];
          count++;
        }
        const idx = (y * width + x) * 4;
        data[idx] = Math.round(rSum / count);
        data[idx + 1] = Math.round(gSum / count);
        data[idx + 2] = Math.round(bSum / count);
      }
    }

    // Vertical pass
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        let rSum = 0, gSum = 0, bSum = 0, aSum = 0, count = 0;
        for (let ky = -r; ky <= r; ky++) {
          const py = clamp(y + ky, 0, height - 1);
          const idx = (py * width + x) * 4;
          rSum += data[idx];
          gSum += data[idx + 1];
          bSum += data[idx + 2];
          aSum += data[idx + 3];
          count++;
        }
        const idx = (y * width + x) * 4;
        data[idx] = Math.round(rSum / count);
        data[idx + 1] = Math.round(gSum / count);
        data[idx + 2] = Math.round(bSum / count);
      }
    }
  }
};

// Sharpen filter (Unsharp Mask)
const sharpen = (imageData: ImageData, amount: number) => {
  if (amount === 0) return;
  const data = imageData.data;
  const original = new Uint8ClampedArray(data);

  // Create blurred version
  gaussianBlur(imageData, 1);

  // Combine with original using amount
  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      const diff = original[i + c] - data[i + c];
      data[i + c] = clamp(original[i + c] + diff * (amount / 100), 0, 255);
    }
  }

  imageData.data.set(data);
};

// Levels adjustment
const applyLevels = (
  imageData: ImageData,
  blackPoint: number,
  midPoint: number,
  whitePoint: number
) => {
  const data = imageData.data;
  const outputMin = 0;
  const outputMax = 255;

  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      let val = data[i + c];

      if (val < blackPoint) {
        val = outputMin;
      } else if (val > whitePoint) {
        val = outputMax;
      } else {
        const normalized = (val - blackPoint) / (whitePoint - blackPoint);
        const midAdjusted = Math.pow(normalized, 1 / midPoint);
        val = outputMin + midAdjusted * (outputMax - outputMin);
      }

      data[i + c] = clamp(val, 0, 255);
    }
  }
};

// Color Balance adjustment
const applyColorBalance = (
  imageData: ImageData,
  cyan_red: number,
  magenta_green: number,
  yellow_blue: number
) => {
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;

    const newR = clamp(r + (cyan_red / 100) * (1 - r), 0, 1) * 255;
    const newG = clamp(g + (magenta_green / 100) * (1 - g), 0, 1) * 255;
    const newB = clamp(b + (yellow_blue / 100) * (1 - b), 0, 1) * 255;

    data[i] = Math.round(newR);
    data[i + 1] = Math.round(newG);
    data[i + 2] = Math.round(newB);
  }
};

// Channel Mixer
const applyChannelMixer = (
  imageData: ImageData,
  rMatrix: number[],
  gMatrix: number[],
  bMatrix: number[]
) => {
  const data = imageData.data;
  const output = new Uint8ClampedArray(data);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    output[i] = clamp(r * rMatrix[0] + g * rMatrix[1] + b * rMatrix[2], 0, 255);
    output[i + 1] = clamp(r * gMatrix[0] + g * gMatrix[1] + b * gMatrix[2], 0, 255);
    output[i + 2] = clamp(r * bMatrix[0] + g * bMatrix[1] + b * bMatrix[2], 0, 255);
  }

  imageData.data.set(output);
};

// Add more complete layer application
const applyLayerFull = (imageData: ImageData, layer: AdjustmentLayer) => {
  if (layer.mode === "blur") {
    const radius = clamp(layer.values.radius as number ?? 5, 0, 50);
    gaussianBlur(imageData, radius);
    return;
  }

  if (layer.mode === "sharpen") {
    const amount = clamp(layer.values.amount as number ?? 100, 0, 500);
    sharpen(imageData, amount);
    return;
  }

  if (layer.mode === "levels") {
    const black = layer.values.blackPoint as number ?? 0;
    const mid = layer.values.midPoint as number ?? 1;
    const white = layer.values.whitePoint as number ?? 255;
    applyLevels(imageData, black, mid, white);
    return;
  }

  if (layer.mode === "color-balance") {
    const cr = layer.values.cyanRed as number ?? 0;
    const mg = layer.values.magentaGreen as number ?? 0;
    const yb = layer.values.yellowBlue as number ?? 0;
    applyColorBalance(imageData, cr, mg, yb);
    return;
  }

  if (layer.mode === "channel-mixer") {
    const rMatrix = (layer.values.rMatrix as number[]) ?? [1, 0, 0];
    const gMatrix = (layer.values.gMatrix as number[]) ?? [0, 1, 0];
    const bMatrix = (layer.values.bMatrix as number[]) ?? [0, 0, 1];
    applyChannelMixer(imageData, rMatrix, gMatrix, bMatrix);
    return;
  }

  // Default layer application
  applyLayer(imageData, layer);
};

self.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const { imageData, layers } = event.data;
  layers.filter((layer) => layer.enabled).forEach((layer) => applyLayerFull(imageData, layer));
  const response: WorkerResponse = { imageData };
  self.postMessage(response);
};
