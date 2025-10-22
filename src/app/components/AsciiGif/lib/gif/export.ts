import GIF from 'gif.js';
import { saveAs } from 'file-saver';
import type { Layer, FrameObject } from '../types';
import { drawFrame } from './draw';
import { calcDelay } from './speed';

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

  // 🔹 Используем drawFrame для отрисовки каждого кадра
  frames.forEach((frame) => {
    const tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = outW;
    tmpCanvas.height = outH;
    const tmpCtx = tmpCanvas.getContext('2d')!;
    
    // тот же рендер, что и в preview
    drawFrame(tmpCtx, frame, {
      outW,
      outH,
      blockSize,
      scale,
      canvasBg,
      layers,
    });

    // задержка как в playGif
    const delay = calcDelay(60, speed);
    gif.addFrame(tmpCanvas, { copy: true, delay });
  });

  gif.on('finished', (blob: Blob) => saveAs(blob, 'ascii.gif'));
  gif.render();
}