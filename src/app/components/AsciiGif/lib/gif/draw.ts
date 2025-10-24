// lib/gif/draw.ts
import type { Layer, FrameObject } from '../types';
import { hexToRgb, colorDistance } from '../utils';
import { svgPaths, getSvgString } from '../ascii';

// ------------------- Кэш для SVG → Image -------------------
const svgCache: Record<string, HTMLImageElement> = {};

function getSvgImage(d: string, fg: string, bg: string, size: number): HTMLImageElement {
  const key = `${d}_${fg}_${bg}_${size}`;
  if (svgCache[key]) return svgCache[key];

  const svgStr = getSvgString(d, fg, bg, size);
  const img = new Image();
  const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  img.src = url;
  img.onload = () => URL.revokeObjectURL(url);

  svgCache[key] = img;
  return img;
}

export function drawFrame(
  ctx: CanvasRenderingContext2D,
  frame: FrameObject,
  options: {
    outW: number;
    outH: number;
    blockSize: number; // фиксированный размер блока svg
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

  // масштаб по высоте
  const scaleH = outH / h;
  const gifW = w * scaleH;
  const offsetX = (outW - gifW) / 2;

  // ---------------- GIF слой ----------------
  const originalLayer = layersRGB.find((l) => l.id === -1 && l.visible);
  if (originalLayer) {
    const tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = w;
    tmpCanvas.height = h;
    tmpCanvas.getContext('2d')!.putImageData(frame.imageData, 0, 0);

    ctx.drawImage(tmpCanvas, 0, 0, w, h, offsetX, 0, gifW, outH);
  }

  // ---------------- SVG блоки ----------------
  const cols = Math.ceil(w / blockSize);
  const rows = Math.ceil(h / blockSize);

  for (let by = 0; by < rows; by++) {
    for (let bx = 0; bx < cols; bx++) {
      const sx = Math.min(w - 1, Math.floor(bx * blockSize + blockSize / 2));
      const sy = Math.min(h - 1, Math.floor(by * blockSize + blockSize / 2));
      const idx = (sy * w + sx) * 4;
      const pr = imageData.data[idx],
        pg = imageData.data[idx + 1],
        pb = imageData.data[idx + 2],
        pa = imageData.data[idx + 3];

      // определяем блок для слоя, если пиксель прозрачный, проверяем bg
      let chosen: Layer | null = null;
      for (let li = layersRGB.length - 1; li >= 0; li--) {
        const lay = layersRGB[li];
        if (!lay.visible || lay.id === -1) continue;

        if (pa === 0) {
          // прозрачный — проверяем bg
          const bgRgb = hexToRgb(lay.bg) as [number, number, number];
          const dist = colorDistance([255, 255, 255], bgRgb); // пример для белого фона
          if (dist <= lay.spread) chosen = lay;
        } else {
          const dist = colorDistance([pr, pg, pb], lay.rgb);
          if (dist <= lay.spread) chosen = lay;
        }

        if (chosen) break;
      }

      if (chosen && chosen.symbol && svgPaths[chosen.symbol]) {
        const cx = offsetX + bx * blockSize * scaleH + (blockSize * scaleH) / 2;
        const cy = by * blockSize * scaleH + (blockSize * scaleH) / 2;

        const img = getSvgImage(svgPaths[chosen.symbol], chosen.fg, chosen.bg, blockSize);
        ctx.drawImage(
          img,
          cx - (blockSize * scaleH) / 2,
          cy - (blockSize * scaleH) / 2,
          blockSize * scaleH,
          blockSize * scaleH
        );
      }
    }
  }
}
