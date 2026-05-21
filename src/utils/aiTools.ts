/**
 * AI Tools for DesignBox
 * Client-side implementations for AI-powered features
 */

/**
 * Remove object background using edge detection
 */
export async function removeBackground(
  imageCanvas: HTMLCanvasElement,
  similarity: number = 30
): Promise<HTMLCanvasElement> {
  const ctx = imageCanvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  const imageData = ctx.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
  const data = imageData.data;

  // Use edge detection to identify background
  const edges = detectEdges(imageCanvas);

  // Convert edges to mask
  for (let i = 0; i < data.length; i += 4) {
    const edgeValue = edges.data[i];

    // If not an edge, consider it background
    if (edgeValue < 128) {
      // Reduce alpha
      const alpha = data[i + 3];
      data[i + 3] = Math.max(0, alpha - similarity);
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return imageCanvas;
}

/**
 * Detect edges using Sobel operator
 */
function detectEdges(canvas: HTMLCanvasElement): ImageData {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;
  const height = canvas.height;

  const edgeData = ctx.createImageData(width, height);
  const edges = edgeData.data;

  // Sobel kernels
  const sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
  const sobelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let gx = 0;
      let gy = 0;

      // Apply Sobel operators
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4;
          const pixel = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;

          gx += pixel * sobelX[ky + 1][kx + 1];
          gy += pixel * sobelY[ky + 1][kx + 1];
        }
      }

      const magnitude = Math.sqrt(gx * gx + gy * gy);
      const idx = (y * width + x) * 4;

      edges[idx] = edges[idx + 1] = edges[idx + 2] = Math.min(255, magnitude);
      edges[idx + 3] = 255;
    }
  }

  return edgeData;
}

/**
 * Content-aware fill using inpainting algorithm
 */
export async function contentAwareFill(
  imageCanvas: HTMLCanvasElement,
  mask: HTMLCanvasElement,
  sampleSize: number = 25
): Promise<HTMLCanvasElement> {
  const ctx = imageCanvas.getContext("2d");
  const maskCtx = mask.getContext("2d");
  if (!ctx || !maskCtx) throw new Error("Failed to get canvas context");

  const imageData = ctx.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
  const maskData = maskCtx.getImageData(0, 0, mask.width, mask.height);
  const data = imageData.data;
  const maskPixels = maskData.data;

  // Find pixels to fill (mask areas)
  const pixelsToFill: Array<{ x: number; y: number; idx: number }> = [];

  for (let i = 0; i < maskPixels.length; i += 4) {
    if (maskPixels[i] > 128) {
      // White pixels in mask = area to fill
      const pixelIdx = i / 4;
      const x = pixelIdx % imageCanvas.width;
      const y = Math.floor(pixelIdx / imageCanvas.width);
      pixelsToFill.push({ x, y, idx: i });
    }
  }

  // For each pixel to fill, find best matching sample
  for (const pixel of pixelsToFill) {
    let bestMatch = { r: 128, g: 128, b: 128 };
    let bestScore = Infinity;

    // Sample surrounding non-masked areas
    const sampleRadius = 50;

    for (let sy = Math.max(0, pixel.y - sampleRadius); sy < Math.min(imageCanvas.height, pixel.y + sampleRadius); sy++) {
      for (let sx = Math.max(0, pixel.x - sampleRadius); sx < Math.min(imageCanvas.width, pixel.x + sampleRadius); sx++) {
        const sampleIdx = (sy * imageCanvas.width + sx) * 4;
        const maskIdx = (sy * mask.width + sx) * 4;

        // Skip if this sample is in the mask area
        if (maskPixels[maskIdx] > 128) continue;

        // Calculate dissimilarity
        const r = data[sampleIdx];
        const g = data[sampleIdx + 1];
        const b = data[sampleIdx + 2];

        const distance = Math.hypot(pixel.x - sx, pixel.y - sy);
        const score = distance * 0.5; // Weight by distance

        if (score < bestScore) {
          bestScore = score;
          bestMatch = { r, g, b };
        }
      }
    }

    // Fill pixel with best match
    data[pixel.idx] = bestMatch.r;
    data[pixel.idx + 1] = bestMatch.g;
    data[pixel.idx + 2] = bestMatch.b;
    data[pixel.idx + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
  return imageCanvas;
}

/**
 * Auto color correction
 */
export function autoColorCorrect(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Calculate histogram
  const rHist = new Array(256).fill(0);
  const gHist = new Array(256).fill(0);
  const bHist = new Array(256).fill(0);

  for (let i = 0; i < data.length; i += 4) {
    rHist[data[i]]++;
    gHist[data[i + 1]]++;
    bHist[data[i + 2]]++;
  }

  // Find black and white points
  const blackPoints = [
    rHist.findIndex((v, i) => i > 0 && v > data.length / 1000),
    gHist.findIndex((v, i) => i > 0 && v > data.length / 1000),
    bHist.findIndex((v, i) => i > 0 && v > data.length / 1000),
  ];

  const whitePoints = [
    255 - rHist.reverse().findIndex((v) => v > data.length / 1000),
    255 - gHist.reverse().findIndex((v) => v > data.length / 1000),
    255 - bHist.reverse().findIndex((v) => v > data.length / 1000),
  ];

  // Stretch histogram
  const rScale = 255 / (whitePoints[0] - blackPoints[0]);
  const gScale = 255 / (whitePoints[1] - blackPoints[1]);
  const bScale = 255 / (whitePoints[2] - blackPoints[2]);

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.round((data[i] - blackPoints[0]) * rScale);
    data[i + 1] = Math.round((data[i + 1] - blackPoints[1]) * gScale);
    data[i + 2] = Math.round((data[i + 2] - blackPoints[2]) * bScale);
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/**
 * Auto contrast enhancement
 */
export function autoContrast(canvas: HTMLCanvasElement, strength: number = 1.5): HTMLCanvasElement {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Calculate average luminance
  let totalLum = 0;
  for (let i = 0; i < data.length; i += 4) {
    const lum = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    totalLum += lum;
  }
  const avgLum = totalLum / (data.length / 4);

  // Apply contrast
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.round(avgLum + (data[i] - avgLum) * strength);
    data[i + 1] = Math.round(avgLum + (data[i + 1] - avgLum) * strength);
    data[i + 2] = Math.round(avgLum + (data[i + 2] - avgLum) * strength);
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/**
 * Denoise image using bilateral filter
 */
export function denoise(
  canvas: HTMLCanvasElement,
  radius: number = 3,
  sigmaSpace: number = 10,
  sigmaColor: number = 0.1
): HTMLCanvasElement {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const output = new Uint8ClampedArray(data);

  for (let y = radius; y < canvas.height - radius; y++) {
    for (let x = radius; x < canvas.width - radius; x++) {
      const centerIdx = (y * canvas.width + x) * 4;
      const cr = data[centerIdx];
      const cg = data[centerIdx + 1];
      const cb = data[centerIdx + 2];

      let r = 0,
        g = 0,
        b = 0,
        totalWeight = 0;

      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const idx = ((y + dy) * canvas.width + (x + dx)) * 4;
          const pr = data[idx];
          const pg = data[idx + 1];
          const pb = data[idx + 2];

          const spatialDist = Math.sqrt(dx * dx + dy * dy);
          const colorDist = Math.sqrt(
            Math.pow((cr - pr) * 255, 2) + Math.pow((cg - pg) * 255, 2) + Math.pow((cb - pb) * 255, 2)
          ) / 255;

          const weight = Math.exp(-(spatialDist * spatialDist) / (2 * sigmaSpace * sigmaSpace)) * Math.exp(-(colorDist * colorDist) / (2 * sigmaColor * sigmaColor));

          r += pr * weight;
          g += pg * weight;
          b += pb * weight;
          totalWeight += weight;
        }
      }

      output[centerIdx] = r / totalWeight;
      output[centerIdx + 1] = g / totalWeight;
      output[centerIdx + 2] = b / totalWeight;
    }
  }

  imageData.data.set(output);
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/**
 * Enhance image sharpness
 */
export function sharpen(canvas: HTMLCanvasElement, amount: number = 1): HTMLCanvasElement {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;

  const kernel = [-0.1, -0.1, -0.1, -0.1, 1.8, -0.1, -0.1, -0.1, -0.1];

  const output = new Uint8ClampedArray(data);

  for (let y = 1; y < canvas.height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let r = 0,
        g = 0,
        b = 0;

      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4;
          const weight = kernel[(ky + 1) * 3 + (kx + 1)];
          r += data[idx] * weight;
          g += data[idx + 1] * weight;
          b += data[idx + 2] * weight;
        }
      }

      const idx = (y * width + x) * 4;
      output[idx] = Math.round(r * amount + data[idx] * (1 - amount));
      output[idx + 1] = Math.round(g * amount + data[idx + 1] * (1 - amount));
      output[idx + 2] = Math.round(b * amount + data[idx + 2] * (1 - amount));
    }
  }

  imageData.data.set(output);
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}
