import type { Layer, FrameObject } from "../../lib/types";
import { drawFrame } from "./draw";
import { calcDelay } from "./speed"; // ✅ добавили импорт

/**
 * Воспроизводит GIF по кадрам на Canvas.
 * Управляет скоростью (1–10), где 5 = оригинальная ≈ 60 мс (16–17 fps).
 */
export function playGif(
  frames: FrameObject[],
  ctx: CanvasRenderingContext2D,
  options: {
    outW: number;
    outH: number;
    blockSize: number;
    scale: number;
    canvasBg: string;
    layers: Layer[];
  },
  speed = 5
) {
  let i = 0;
  let stopped = false;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  function renderNext() {
    if (stopped) return;

    drawFrame(ctx, frames[i], options);

    const delay = calcDelay(60, speed); // ✅ единая формула
    i = (i + 1) % frames.length;

    timeoutId = setTimeout(renderNext, delay);
  }

  drawFrame(ctx, frames[0], options);
  timeoutId = setTimeout(renderNext, calcDelay(60, speed));

  return () => {
    stopped = true;
    if (timeoutId) clearTimeout(timeoutId);
  };
}