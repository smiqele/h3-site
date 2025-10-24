import type { Layer, FrameObject } from '../../lib/types';
import { drawFrame } from './draw';
import { calcDelay } from './speed';

export interface PlayOptions {
  outW: number;
  outH: number;
  blockSize: number;
  canvasBg: string;
  layers: Layer[];
  speed?: number;
}

/**
 * Воспроизводит GIF по кадрам на Canvas.
 * Возвращает объект с методами stop и updateOptions.
 */
export function playGif(
  frames: FrameObject[],
  ctx: CanvasRenderingContext2D,
  options: PlayOptions
) {
  if (!frames || frames.length === 0) return { stop: () => {}, updateOptions: () => {} };

  let i = 0;
  let stopped = false;
  let rafId: number | null = null;
  let lastTime = performance.now();
  let acc = 0;

  const optionsRef = { current: options };

  const updateOptions = (newOptions: Partial<PlayOptions>) => {
    optionsRef.current = { ...optionsRef.current, ...newOptions };
  };

  function loop(now: number) {
    if (stopped) return;

    const frame = frames[i];
    if (!frame) {
      stopped = true;
      return;
    }

    const delay = calcDelay(60, optionsRef.current.speed ?? 5);
    const dt = now - lastTime;
    lastTime = now;
    acc += dt;

    if (acc >= delay) {
      drawFrame(ctx, frame, optionsRef.current);
      i = (i + 1) % frames.length;
      acc = 0;
    }

    rafId = requestAnimationFrame(loop);
  }

  drawFrame(ctx, frames[0], optionsRef.current);
  rafId = requestAnimationFrame(loop);

  return {
    stop: () => {
      stopped = true;
      if (rafId) cancelAnimationFrame(rafId);
    },
    updateOptions,
  };
}
