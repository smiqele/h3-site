// lib/gif/play.ts
import type { Layer, FrameObject } from '../../lib/types';
import { drawFrame } from './draw';
import { calcDelay } from './speed';

/**
 * Воспроизводит GIF по кадрам на Canvas.
 * Скорость 1–10, где 5 = оригинальная ~60 мс (16–17 fps).
 * Scale больше не используется.
 */
export function playGif(
  frames: FrameObject[],
  ctx: CanvasRenderingContext2D,
  options: {
    outW: number;
    outH: number;
    blockSize: number;
    canvasBg: string;
    layers: Layer[];
  },
  speed = 5
) {
  console.groupCollapsed('🎬 playGif старт');
  console.log('frames:', frames?.length);
  console.log('canvas:', ctx.canvas.width, ctx.canvas.height);
  console.log('options:', options);
  console.log('speed:', speed);
  console.groupEnd();

  if (!frames || frames.length === 0) {
    console.warn('⚠️ playGif: frames пуст или отсутствует');
    return () => {};
  }

  let i = 0;
  let stopped = false;
  let rafId: number | null = null;
  let lastTime = performance.now();
  let acc = 0;

  function loop(now: number) {
    if (stopped) return;

    const frame = frames[i];
    if (!frame) {
      console.warn(`⚠️ frame[${i}] отсутствует`);
      stopped = true;
      return;
    }

    const delay = calcDelay(60, speed);
    const dt = now - lastTime;
    lastTime = now;
    acc += dt;

    if (acc >= delay) {
      try {
        //console.log(`🖼️ Рисуем кадр ${i + 1}/${frames.length}, delay=${delay.toFixed(1)}ms`);
        drawFrame(ctx, frame, options);
      } catch (err) {
        console.error('❌ Ошибка при drawFrame:', err);
        stopped = true;
        return;
      }

      i = (i + 1) % frames.length;
      acc = 0;
    }

    rafId = requestAnimationFrame(loop);
  }

  try {
    console.log('✅ Первый кадр рендерится сразу');
    drawFrame(ctx, frames[0], options);
  } catch (err) {
    console.error('❌ Ошибка при первом drawFrame:', err);
    return () => {};
  }

  rafId = requestAnimationFrame(loop);

  return () => {
    console.log('🛑 playGif остановлен');
    stopped = true;
    if (rafId) cancelAnimationFrame(rafId);
  };
}
