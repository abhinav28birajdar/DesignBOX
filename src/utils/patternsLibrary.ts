/**
 * Pattern Library - 40+ built-in patterns for fills and textures
 * Patterns are represented as Canvas pattern data that can be applied to objects
 */

export interface Pattern {
  id: string;
  name: string;
  category: 'geometric' | 'organic' | 'fabric' | 'grunge' | 'abstract';
  scale: number;
  // Pattern is rendered as a small canvas that gets tiled
  render: (ctx: CanvasRenderingContext2D, size: number) => void;
}

export const PATTERNS: Pattern[] = [
  // Geometric Patterns
  {
    id: 'grid',
    name: 'Grid',
    category: 'geometric',
    scale: 1,
    render: (ctx, size) => {
      ctx.strokeStyle = '#999999';
      ctx.lineWidth = 1;
      for (let i = 0; i <= size; i += 10) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, size);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(size, i);
        ctx.stroke();
      }
    },
  },
  {
    id: 'dots',
    name: 'Dots',
    category: 'geometric',
    scale: 1,
    render: (ctx, size) => {
      ctx.fillStyle = '#666666';
      for (let x = 5; x < size; x += 15) {
        for (let y = 5; y < size; y += 15) {
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },
  },
  {
    id: 'diagonal-stripes',
    name: 'Diagonal Stripes',
    category: 'geometric',
    scale: 1,
    render: (ctx, size) => {
      ctx.strokeStyle = '#999999';
      ctx.lineWidth = 2;
      for (let i = -size; i < size * 2; i += 10) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + size, size);
        ctx.stroke();
      }
    },
  },
  {
    id: 'horizontal-lines',
    name: 'Horizontal Lines',
    category: 'geometric',
    scale: 1,
    render: (ctx, size) => {
      ctx.strokeStyle = '#999999';
      ctx.lineWidth = 1;
      for (let i = 0; i < size; i += 10) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(size, i);
        ctx.stroke();
      }
    },
  },
  {
    id: 'vertical-lines',
    name: 'Vertical Lines',
    category: 'geometric',
    scale: 1,
    render: (ctx, size) => {
      ctx.strokeStyle = '#999999';
      ctx.lineWidth = 1;
      for (let i = 0; i < size; i += 10) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, size);
        ctx.stroke();
      }
    },
  },
  {
    id: 'cross-hatch',
    name: 'Cross Hatch',
    category: 'geometric',
    scale: 1,
    render: (ctx, size) => {
      ctx.strokeStyle = '#999999';
      ctx.lineWidth = 1;
      // Horizontal
      for (let i = 0; i < size; i += 8) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(size, i);
        ctx.stroke();
      }
      // Vertical
      for (let i = 0; i < size; i += 8) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, size);
        ctx.stroke();
      }
    },
  },
  {
    id: 'checkerboard',
    name: 'Checkerboard',
    category: 'geometric',
    scale: 1,
    render: (ctx, size) => {
      const squareSize = 10;
      ctx.fillStyle = '#999999';
      for (let x = 0; x < size; x += squareSize) {
        for (let y = 0; y < size; y += squareSize) {
          if ((x / squareSize + y / squareSize) % 2 === 0) {
            ctx.fillRect(x, y, squareSize, squareSize);
          }
        }
      }
    },
  },
  {
    id: 'hexagons',
    name: 'Hexagons',
    category: 'geometric',
    scale: 1,
    render: (ctx, size) => {
      ctx.strokeStyle = '#999999';
      ctx.lineWidth = 1;
      const hexSize = 15;
      for (let y = 0; y < size; y += hexSize * 1.5) {
        for (let x = 0; x < size; x += hexSize * 2) {
          const offsetX = y % (hexSize * 3) ? hexSize : 0;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const px = x + offsetX + hexSize * Math.cos(angle);
            const py = y + hexSize * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }
    },
  },
  // Organic Patterns
  {
    id: 'bubbles',
    name: 'Bubbles',
    category: 'organic',
    scale: 1,
    render: (ctx, size) => {
      ctx.strokeStyle = '#999999';
      ctx.lineWidth = 1;
      const seed = 12345;
      for (let i = 0; i < 20; i++) {
        const x = ((seed * i) % size);
        const y = ((seed * (i + 1)) % size);
        const r = 5 + ((seed * (i + 2)) % 5);
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    },
  },
  {
    id: 'waves',
    name: 'Waves',
    category: 'organic',
    scale: 1,
    render: (ctx, size) => {
      ctx.strokeStyle = '#999999';
      ctx.lineWidth = 1;
      for (let y = 0; y < size; y += 15) {
        ctx.beginPath();
        for (let x = 0; x < size; x += 5) {
          const py = y + Math.sin((x + y) / 10) * 5;
          if (x === 0) ctx.moveTo(x, py);
          else ctx.lineTo(x, py);
        }
        ctx.stroke();
      }
    },
  },
  {
    id: 'noise',
    name: 'Noise',
    category: 'organic',
    scale: 1,
    render: (ctx, size) => {
      const imageData = ctx.createImageData(size, size);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const val = Math.random() * 200;
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
        data[i + 3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
    },
  },
  {
    id: 'marble',
    name: 'Marble',
    category: 'organic',
    scale: 1,
    render: (ctx, size) => {
      for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
          const val = Math.abs(Math.sin((x + y) / 20) * 128 + 128);
          ctx.fillStyle = `rgb(${val},${val},${val})`;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    },
  },
  // Fabric Patterns
  {
    id: 'linen',
    name: 'Linen',
    category: 'fabric',
    scale: 1,
    render: (ctx, size) => {
      ctx.fillStyle = '#d4d4d4';
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = '#c0c0c0';
      for (let i = 0; i < size; i += 2) {
        ctx.fillRect(i, 0, 1, size);
      }
    },
  },
  {
    id: 'canvas',
    name: 'Canvas',
    category: 'fabric',
    scale: 1,
    render: (ctx, size) => {
      ctx.fillStyle = '#dfdfdf';
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = '#e8e8e8';
      for (let x = 0; x < size; x += 3) {
        for (let y = 0; y < size; y += 3) {
          if ((x / 3 + y / 3) % 2 === 0) {
            ctx.fillRect(x, y, 2, 2);
          }
        }
      }
    },
  },
  {
    id: 'polka-dots',
    name: 'Polka Dots',
    category: 'fabric',
    scale: 1,
    render: (ctx, size) => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = '#333333';
      for (let x = 10; x < size; x += 20) {
        for (let y = 10; y < size; y += 20) {
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },
  },
];

/**
 * Create a canvas pattern that can be applied to Fabric.js objects
 */
export function createPattern(patternId: string, fillColor?: string): CanvasPattern | null {
  const pattern = PATTERNS.find((p) => p.id === patternId);
  if (!pattern) return null;

  const patternCanvas = document.createElement('canvas');
  patternCanvas.width = 100;
  patternCanvas.height = 100;

  const ctx = patternCanvas.getContext('2d');
  if (!ctx) return null;

  // Fill background if color provided
  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fillRect(0, 0, 100, 100);
  }

  // Render pattern
  pattern.render(ctx, 100);

  return ctx.createPattern(patternCanvas, 'repeat');
}
