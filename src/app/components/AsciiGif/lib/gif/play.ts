import type { Layer, FrameObject } from "@/lib/types";
import { drawFrame } from "./draw";

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
  let timeout: NodeJS.Timeout;

  function calculateDelay(frame: FrameObject) {
    const baseDelay = frame.delayMs ?? 100;
    const minDelay = 1000 / 60;
    let delay = baseDelay;

    if (speed < 5) {
      const t = (5 - speed) / 4;
      delay = baseDelay * (1 + t);
    } else if (speed > 5) {
      const t = (speed - 5) / 5;
      delay = baseDelay * (1 - t) + minDelay * t;
    }

    return delay;
  }

  function renderNext() {
    drawFrame(ctx, frames[i], options);
    const delay = calculateDelay(frames[i]);
    i = (i + 1) % frames.length;
    timeout = setTimeout(renderNext, delay);
  }

  renderNext();
  return () => clearTimeout(timeout);
}