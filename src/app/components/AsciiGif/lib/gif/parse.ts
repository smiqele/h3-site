import { parseGIF, decompressFrames } from "gifuct-js";
import type { FrameObject } from "@/lib/types";

export async function parseFileToFrames(file: File): Promise<FrameObject[]> {
  const arrayBuffer = await file.arrayBuffer();
  const gif = parseGIF(arrayBuffer);
  const frames = decompressFrames(gif, true);

  return frames.map((f: any, i: number) => {
    const { delay, disposalType, dims, patch } = f;
    const { width, height, left, top } = dims;
    const imageData = new ImageData(new Uint8ClampedArray(patch), width, height);

    // нормализация задержки
    let delayMs = delay * 10;
    if (delayMs < 20) delayMs = 100;
    if (delayMs > 200) delayMs = 100;

    return { delay, delayMs, disposalType, width, height, left, top, imageData };
  });
}