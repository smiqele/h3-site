// lib/gif/draw.ts
import type { Layer, FrameObject } from '../types';
import { hexToRgb, colorDistance } from '../utils';
import { svgBlocks } from '../ascii';

// Кэш для SVG → Image
const svgCache: Record<string, HTMLImageElement> = {};

function getSvgImage(symbol: string, fg: string, bg: string): HTMLImageElement | null {
  const key = `${symbol}_${fg}_${bg}`;
  if (svgCache[key]) return svgCache[key];

  const svgStr = svgBlocks[symbol]?.(fg, bg);
  if (!svgStr) return null;

  const img = new Image();
  const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  img.src = url;

  img.onload = () => {
    URL.revokeObjectURL(url);
  };

  svgCache[key] = img;
  return img;
}

export function drawFrame(
  ctx: CanvasRenderingContext2D,
  frame: FrameObject,
  options: {
    outW: number;
    outH: number;
    blockSize: number;
    canvasBg: string;
    layers: Layer[];
  }
) {
  const { width: w, height: h, imageData } = frame;
  const { outW, outH, blockSize, canvasBg, layers } = options;

  ctx.fillStyle = canvasBg;
  ctx.fillRect(0, 0, outW, outH);

  const layersRGB = layers.map((l) => ({
    ...l,
    rgb: hexToRgb(l.target) as [number, number, number],
  }));

  // ---------------------- GIF слой ----------------------
  const originalLayer = layersRGB.find((l) => l.id === -1 && l.visible);
  if (originalLayer) {
    const scaleH = outH / h;
    const newW = w * scaleH;
    const newH = h * scaleH;
    const offsetX = (outW - newW) / 2;
    const offsetY = 0;

    const tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = w;
    tmpCanvas.height = h;
    const tmpCtx = tmpCanvas.getContext('2d');
    if (tmpCtx) tmpCtx.putImageData(frame.imageData, 0, 0);

    ctx.drawImage(tmpCanvas, 0, 0, w, h, offsetX, offsetY, newW, newH);
  }

  // ---------------------- ASCII SVG блоки ----------------------
  const cols = Math.ceil(w / blockSize);
  const rows = Math.ceil(h / blockSize);
  const scaleH = outH / h;
  const asciiOffsetX = (outW - w * scaleH) / 2;
  const asciiOffsetY = 0;

  for (let by = 0; by < rows; by++) {
    for (let bx = 0; bx < cols; bx++) {
      const sxPix = Math.min(w - 1, Math.floor(bx * blockSize + blockSize / 2));
      const syPix = Math.min(h - 1, Math.floor(by * blockSize + blockSize / 2));
      const idx = (syPix * w + sxPix) * 4;
      const pr = imageData.data[idx],
        pg = imageData.data[idx + 1],
        pb = imageData.data[idx + 2],
        pa = imageData.data[idx + 3];
      if (pa === 0) continue;

      let chosen: Layer | null = null;
      for (let li = layersRGB.length - 1; li >= 0; li--) {
        const lay = layersRGB[li];
        if (!lay.visible || lay.id === -1) continue;
        const dist = colorDistance([pr, pg, pb], lay.rgb);
        if (dist <= lay.spread) {
          chosen = lay;
          break;
        }
      }

      if (chosen && chosen.symbol && svgBlocks[chosen.symbol]) {
        const cx = bx * blockSize * scaleH + (blockSize * scaleH) / 2 + asciiOffsetX;
        const cy = by * blockSize * scaleH + (blockSize * scaleH) / 2 + asciiOffsetY;
        const size = blockSize * scaleH;

        const img = getSvgImage(chosen.symbol, chosen.fg, chosen.bg);
        if (img) {
          ctx.drawImage(img, cx - size / 2, cy - size / 2, size, size);
        }
      }
    }
  }
}
