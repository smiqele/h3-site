import GIF from 'gif.js';
import { saveAs } from 'file-saver';
import type { Layer, FrameObject } from '../types';
import { hexToRgb, colorDistance } from '../utils';

export async function saveGif(
  frames: FrameObject[],
  layers: Layer[],
  options: {
    scale: number;
    blockSize: number;
    canvasBg: string;
    gifDims: { w: number; h: number };
    speed: number;
  }
) {
  const { scale, blockSize, canvasBg, gifDims, speed } = options;

  const outW = Math.floor(gifDims.w * scale);
  const outH = Math.floor(gifDims.h * scale);

  const gif = new GIF({
    workers: 2,
    quality: 10,
    width: outW,
    height: outH,
    workerScript: '/gif.worker.js',
  });

  const layersRGB = layers.map((l) => ({
    ...l,
    rgb: hexToRgb(l.target) as [number, number, number],
  }));
  const showOriginal = layers.find((l) => l.id === -1 && l.visible);
  const asciiLayers = layersRGB.filter((l) => l.visible && l.id !== -1);

  frames.forEach((frame) => {
    const tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = outW;
    tmpCanvas.height = outH;
    const tmpCtx = tmpCanvas.getContext('2d')!;
    tmpCtx.fillStyle = canvasBg;
    tmpCtx.fillRect(0, 0, outW, outH);

    if (showOriginal) {
      const tmpFrameCanvas = document.createElement('canvas');
      tmpFrameCanvas.width = frame.width;
      tmpFrameCanvas.height = frame.height;
      tmpFrameCanvas.getContext('2d')!.putImageData(frame.imageData, 0, 0);
      tmpCtx.drawImage(tmpFrameCanvas, 0, 0, outW, outH);
    }

    if (asciiLayers.length > 0) {
      const cols = Math.ceil(frame.width / blockSize);
      const rows = Math.ceil(frame.height / blockSize);

      tmpCtx.textBaseline = 'middle';
      tmpCtx.textAlign = 'center';
      tmpCtx.font = `${Math.max(6, blockSize * scale)}px monospace`;

      for (let by = 0; by < rows; by++) {
        for (let bx = 0; bx < cols; bx++) {
          const sxPix = Math.min(frame.width - 1, Math.floor(bx * blockSize + blockSize / 2));
          const syPix = Math.min(frame.height - 1, Math.floor(by * blockSize + blockSize / 2));
          const idx = (syPix * frame.width + sxPix) * 4;
          const pr = frame.imageData.data[idx],
            pg = frame.imageData.data[idx + 1],
            pb = frame.imageData.data[idx + 2],
            pa = frame.imageData.data[idx + 3];
          if (pa === 0) continue;

          let chosen: Layer | null = null;
          for (let li = asciiLayers.length - 1; li >= 0; li--) {
            const lay = asciiLayers[li];
            const dist = colorDistance([pr, pg, pb], lay.rgb as [number, number, number]);
            if (dist <= lay.spread) {
              chosen = lay;
              break;
            }
          }

          if (chosen) {
            const cx = (bx * blockSize + blockSize / 2) * (outW / frame.width);
            const cy = (by * blockSize + blockSize / 2) * (outH / frame.height);

            tmpCtx.fillStyle = chosen.bg;
            tmpCtx.fillRect(
              cx - (blockSize * (outW / frame.width)) / 2,
              cy - (blockSize * (outH / frame.height)) / 2,
              blockSize * (outW / frame.width),
              blockSize * (outH / frame.height)
            );

            tmpCtx.fillStyle = chosen.fg;
            tmpCtx.fillText(chosen.symbol, cx, cy);
          }
        }
      }
    }

    const baseDelay = frame.delayMs || 100;
    const minDelay = 1000 / 60;
    let delay = baseDelay;

    if (speed < 5) {
      const t = (5 - speed) / 4;
      delay = baseDelay * (1 + t);
    } else if (speed > 5) {
      const t = (speed - 5) / 5;
      delay = baseDelay * (1 - t) + minDelay * t;
    }

    gif.addFrame(tmpCanvas, { copy: true, delay });
  });

  gif.on('finished', (blob: Blob) => saveAs(blob, 'ascii.gif'));
  gif.render();
}
