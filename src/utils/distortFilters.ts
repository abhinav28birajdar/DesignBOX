/**
 * Distort & Render Filters for DesignBox
 */

/**
 * Warp filter - mesh-based  distortion
 */
export function warpImage(
  canvas: HTMLCanvasElement,
  meshPoints: Array<{ x: number; y: number; offsetX: number; offsetY: number }>,
  strength: number = 1
): HTMLCanvasElement {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;
  const height = canvas.height;

  // Create displacement map
  const output = new Uint8ClampedArray(data);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let displaceX = 0;
      let displaceY = 0;

      // Calculate displacement from mesh points
      for (const point of meshPoints) {
        const dist = Math.hypot(x - point.x, y - point.y);
        const influence = 1 / (1 + dist / 50);
        displaceX += point.offsetX * influence * strength;
        displaceY += point.offsetY * influence * strength;
      }

      const srcX = Math.round(Math.max(0, Math.min(width - 1, x + displaceX)));
      const srcY = Math.round(Math.max(0, Math.min(height - 1, y + displaceY)));

      const srcIdx = (srcY * width + srcX) * 4;
      const dstIdx = (y * width + x) * 4;

      output[dstIdx] = data[srcIdx];
      output[dstIdx + 1] = data[srcIdx + 1];
      output[dstIdx + 2] = data[srcIdx + 2];
      output[dstIdx + 3] = data[srcIdx + 3];
    }
  }

  imageData.data.set(output);
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/**
 * Liquify filter - twirl/pinch/push distortion
 */
export function liquifyImage(
  canvas: HTMLCanvasElement,
  brushX: number,
  brushY: number,
  brushRadius: number = 50,
  mode: "twirl" | "pinch" | "push" = "twirl",
  strength: number = 0.5
): HTMLCanvasElement {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;
  const height = canvas.height;
  const output = new Uint8ClampedArray(data);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - brushX;
      const dy = y - brushY;
      const dist = Math.hypot(dx, dy);

      if (dist > brushRadius) continue;

      let srcX = x;
      let srcY = y;

      const influence = (1 - dist / brushRadius) * strength;

      if (mode === "twirl") {
        // Twirl distortion
        const angle = (influence * Math.PI * 2) * (dist / brushRadius);
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        srcX = brushX + dx * cos - dy * sin;
        srcY = brushY + dx * sin + dy * cos;
      } else if (mode === "pinch") {
        // Pinch distortion
        const scale = 1 - influence * 0.5;
        srcX = brushX + dx * scale;
        srcY = brushY + dy * scale;
      } else if (mode === "push") {
        // Push distortion
        const angle = Math.atan2(dy, dx);
        srcX = x - Math.cos(angle) * influence * 30;
        srcY = y - Math.sin(angle) * influence * 30;
      }

      srcX = Math.max(0, Math.min(width - 1, srcX));
      srcY = Math.max(0, Math.min(height - 1, srcY));

      const ix = Math.floor(srcX);
      const iy = Math.floor(srcY);
      const fx = srcX - ix;
      const fy = srcY - iy;

      // Bilinear interpolation for smooth sampling
      const idx00 = (iy * width + ix) * 4;
      const idx10 = (iy * width + Math.min(width - 1, ix + 1)) * 4;
      const idx01 = (Math.min(height - 1, iy + 1) * width + ix) * 4;
      const idx11 = (Math.min(height - 1, iy + 1) * width + Math.min(width - 1, ix + 1)) * 4;

      const dstIdx = (y * width + x) * 4;

      for (let c = 0; c < 4; c++) {
        const v00 = data[idx00 + c];
        const v10 = data[idx10 + c];
        const v01 = data[idx01 + c];
        const v11 = data[idx11 + c];

        const v0 = v00 * (1 - fx) + v10 * fx;
        const v1 = v01 * (1 - fx) + v11 * fx;
        output[dstIdx + c] = Math.round(v0 * (1 - fy) + v1 * fy);
      }
    }
  }

  imageData.data.set(output);
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/**
 * Generate Perlin noise-based clouds
 */
export function generateClouds(
  width: number,
  height: number,
  scale: number = 100,
  opacity: number = 255
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  // Perlin noise simulation using simplex-like algorithm
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const value = perlinNoise(x / scale, y / scale);
      const normalized = Math.floor((value + 1) * 128);

      const idx = (y * width + x) * 4;
      data[idx] = normalized;
      data[idx + 1] = normalized;
      data[idx + 2] = normalized;
      data[idx + 3] = opacity;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/**
 * Simplified Perlin noise function
 */
function perlinNoise(x: number, y: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;

  // Fade curves
  const u = easeInOutQuint(xf);
  const v = easeInOutQuint(yf);

  // Gradients
  const g00 = gradientDot(xi, yi, xf, yf);
  const g10 = gradientDot(xi + 1, yi, xf - 1, yf);
  const g01 = gradientDot(xi, yi + 1, xf, yf - 1);
  const g11 = gradientDot(xi + 1, yi + 1, xf - 1, yf - 1);

  // Interpolation
  const nx0 = mix(g00, g10, u);
  const nx1 = mix(g01, g11, u);
  return mix(nx0, nx1, v);
}

function easeInOutQuint(t: number): number {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
}

function mix(a: number, b: number, t: number): number {
  return a * (1 - t) + b * t;
}

function gradientDot(xi: number, yi: number, x: number, y: number): number {
  const n = Math.sin(xi * 12.9898 + yi * 78.233) * 43758.5453;
  const angle = (n - Math.floor(n)) * Math.PI * 2;
  return Math.cos(angle) * x + Math.sin(angle) * y;
}

/**
 * Generate plasma effect
 */
export function generatePlasma(
  width: number,
  height: number,
  complexity: number = 0.5
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const v1 = Math.sin((x * complexity) / width * Math.PI * 2) * 0.5;
      const v2 = Math.sin((y * complexity) / height * Math.PI * 2) * 0.5;
      const v3 = Math.sin(((x + y) * complexity) / (width + height) * Math.PI * 4) * 0.5;
      const v4 = Math.sin(Math.sqrt(x * x + y * y) * (complexity / 10)) * 0.5;

      const value = Math.floor(
        ((v1 + v2 + v3 + v4) * 64 + 128) % 256
      );

      const idx = (y * width + x) * 4;
      const hue = value / 256;
      const rgb = hsvToRgb(hue, 1, value / 256);

      data[idx] = rgb.r;
      data[idx + 1] = rgb.g;
      data[idx + 2] = rgb.b;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

function hsvToRgb(h: number, s: number, v: number) {
  const c = v * s;
  const hp = h * 6;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r = 0,
    g = 0,
    b = 0;

  if (hp < 1) {
    r = c;
    g = x;
  } else if (hp < 2) {
    r = x;
    g = c;
  } else if (hp < 3) {
    g = c;
    b = x;
  } else if (hp < 4) {
    g = x;
    b = c;
  } else if (hp < 5) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  const m = v - c;
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

/**
 * Turbulence filter - fractal noise
 */
export function generateTurbulence(
  width: number,
  height: number,
  octaves: number = 4,
  persistence: number = 0.5
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let value = 0;
      let amplitude = 1;
      let frequency = 1;
      let maxValue = 0;

      for (let i = 0; i < octaves; i++) {
        value += perlinNoise(x * frequency / width, y * frequency / height) * amplitude;
        maxValue += amplitude;
        amplitude *= persistence;
        frequency *= 2;
      }

      value /= maxValue;
      const normalized = Math.floor((value + 1) * 128);

      const idx = (y * width + x) * 4;
      data[idx] = normalized;
      data[idx + 1] = normalized;
      data[idx + 2] = normalized;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/**
 * Pixelate/mosaic filter
 */
export function pixelate(canvas: HTMLCanvasElement, pixelSize: number = 10): HTMLCanvasElement {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;

  for (let y = 0; y < canvas.height; y += pixelSize) {
    for (let x = 0; x < width; x += pixelSize) {
      // Get average color of block
      let r = 0,
        g = 0,
        b = 0,
        a = 0,
        count = 0;

      for (let dy = 0; dy < pixelSize && y + dy < canvas.height; dy++) {
        for (let dx = 0; dx < pixelSize && x + dx < width; dx++) {
          const idx = ((y + dy) * width + (x + dx)) * 4;
          r += data[idx];
          g += data[idx + 1];
          b += data[idx + 2];
          a += data[idx + 3];
          count++;
        }
      }

      const avgR = Math.round(r / count);
      const avgG = Math.round(g / count);
      const avgB = Math.round(b / count);
      const avgA = Math.round(a / count);

      // Fill block with average color
      for (let dy = 0; dy < pixelSize && y + dy < canvas.height; dy++) {
        for (let dx = 0; dx < pixelSize && x + dx < width; dx++) {
          const idx = ((y + dy) * width + (x + dx)) * 4;
          data[idx] = avgR;
          data[idx + 1] = avgG;
          data[idx + 2] = avgB;
          data[idx + 3] = avgA;
        }
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}
