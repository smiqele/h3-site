// lib/gif/export.ts
import GIF from 'gif.js';
import { saveAs } from 'file-saver';
import type { Layer, FrameObject } from '../types';
import { drawFrame } from './draw';
import { calcDelay } from './speed';

export async function saveGif(
  frames: FrameObject[],
  layers: Layer[],
  options: {
    blockSize: number;
    canvasBg: string;
    gifDims: { w: number; h: number };
    speed: number;
  }
) {
  const { blockSize, canvasBg, gifDims, speed } = options;
  const outW = gifDims.w;
  const outH = gifDims.h;

  const gif = new GIF({
    workers: 2,
    quality: 10,
    width: outW,
    height: outH,
    workerScript: '/gif.worker.js',
  });

  frames.forEach((frame) => {
    const tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = outW;
    tmpCanvas.height = outH;
    const tmpCtx = tmpCanvas.getContext('2d')!;

    drawFrame(tmpCtx, frame, {
      outW,
      outH,
      blockSize,
      canvasBg,
      layers,
    });

    const delay = calcDelay(60, speed); // задержка как при воспроизведении
    gif.addFrame(tmpCanvas, { copy: true, delay });
  });

  // Сохраняем GIF после окончания рендера
  gif.on('finished', (blob) => saveAs(blob, 'ascii.gif'));
  gif.render();
}
