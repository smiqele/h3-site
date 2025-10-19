// src/lib/gif/play.ts
import type { Layer, FrameObject } from "../../lib/types";
import { drawFrame } from "./draw";

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

  /** 
   * Рассчитывает задержку кадра в мс, исходя из пользовательской скорости.
   * speed = 5 → оригинал (60 мс), speed = 1 → медленно, speed = 10 → быстро.
   */
  function calcDelay(): number {
    const base = 60; // оригинальная задержка (примерно 16–17 fps)
    const min = 15;  // не быстрее 60 fps
    const max = 240; // не медленнее 4 fps
    let delay = base;

    if (speed < 5) {
      // 1..5 → замедление (до 4×)
      const t = (5 - speed) / 4; // 0..1
      delay = base * (1 + 3 * t); // от 1× до 4×
    } else if (speed > 5) {
      // 5..10 → ускорение (до 0.25×)
      const t = (speed - 5) / 5; // 0..1
      delay = base * (1 - 0.75 * t); // от 1× до 0.25×
    }

    return Math.min(Math.max(delay, min), max);
  }

  function renderNext() {
    if (stopped) return;

    drawFrame(ctx, frames[i], options);

    const delay = calcDelay();
    i = (i + 1) % frames.length;

    timeoutId = setTimeout(renderNext, delay);
  }

  // Первый кадр — сразу
  drawFrame(ctx, frames[0], options);
  timeoutId = setTimeout(renderNext, calcDelay());

  // Возвращаем функцию остановки
  return () => {
    stopped = true;
    if (timeoutId) clearTimeout(timeoutId);
  };
}