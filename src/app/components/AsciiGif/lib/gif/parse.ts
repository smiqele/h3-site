// src/lib/gif/parse.ts
import { parseGIF, decompressFrames } from "gifuct-js";
import type { FrameObject } from "../types";

function deinterlacePixels(pixels: Uint8ClampedArray, w: number, h: number) {
  const out = new Uint8ClampedArray(pixels.length);
  const passRows = [
    { start: 0, step: 8 },
    { start: 4, step: 8 },
    { start: 2, step: 4 },
    { start: 1, step: 2 },
  ];
  let srcRow = 0;
  for (const p of passRows) {
    for (let r = p.start; r < h; r += p.step) {
      const srcOffset = srcRow * w * 4;
      const dstOffset = r * w * 4;
      out.set(pixels.subarray(srcOffset, srcOffset + w * 4), dstOffset);
      srcRow++;
    }
  }
  return out;
}

export async function parseFileToFrames(file: File): Promise<FrameObject[]> {
  const arrayBuffer = await file.arrayBuffer();
  const gif = parseGIF(arrayBuffer);
  const rawFrames = decompressFrames(gif, true);

  const canvasW = gif.lsd.width;
  const canvasH = gif.lsd.height;

  const bgIndex = (gif.lsd as any).bgColorIndex ?? (gif.lsd as any).backgroundColorIndex ?? 0;
  let bgColor: [number, number, number] = [0, 0, 0];
  if (Array.isArray(gif.gct) && gif.gct[bgIndex]) {
    const c = gif.gct[bgIndex];
    bgColor = [c[0], c[1], c[2]];
  }

  const baseCanvas = document.createElement("canvas");
  baseCanvas.width = canvasW;
  baseCanvas.height = canvasH;
  const baseCtx = baseCanvas.getContext("2d", { willReadFrequently: true })!;
  baseCtx.fillStyle = `rgb(${bgColor.join(",")})`;
  baseCtx.fillRect(0, 0, canvasW, canvasH);

  const prevCanvas = document.createElement("canvas");
  prevCanvas.width = canvasW;
  prevCanvas.height = canvasH;
  const prevCtx = prevCanvas.getContext("2d")!;

  // ✅ единый временный canvas для патчей
  const patchCanvas = document.createElement("canvas");
  const patchCtx = patchCanvas.getContext("2d", { willReadFrequently: true })!;

  const framesOut: FrameObject[] = [];

  for (let i = 0; i < rawFrames.length; i++) {
    const f = rawFrames[i];
    const { delay, disposalType, dims, patch, interlaced } = f;
    const { left = 0, top = 0, width: fw = canvasW, height: fh = canvasH } = dims || {};

    if (disposalType === 3) {
      prevCtx.clearRect(0, 0, canvasW, canvasH);
      prevCtx.drawImage(baseCanvas, 0, 0);
    }

    if (i > 0) {
      const prev = rawFrames[i - 1];
      switch (prev.disposalType) {
        case 2:
          baseCtx.fillStyle = `rgb(${bgColor.join(",")})`;
          baseCtx.fillRect(prev.dims.left, prev.dims.top, prev.dims.width, prev.dims.height);
          break;
        case 3:
          baseCtx.clearRect(0, 0, canvasW, canvasH);
          baseCtx.drawImage(prevCanvas, 0, 0);
          break;
      }
    }

    if (patch && patch.length >= 4) {
      let pixelData = new Uint8ClampedArray(patch);
      if (interlaced) {
        pixelData = deinterlacePixels(pixelData, fw, fh);
      }

      // 🔧 перерисовываем патч прямо в ImageData с альфа-маской
      const img = new ImageData(pixelData, fw, fh);
      patchCanvas.width = fw;
      patchCanvas.height = fh;
      patchCtx.putImageData(img, 0, 0);

      // copy directly (hardware accelerated, single reused canvas)
      baseCtx.drawImage(patchCanvas, left, top);
    }

    const frameData = baseCtx.getImageData(0, 0, canvasW, canvasH);
    let delayMs = (delay ?? 10) * 10;
    if (delayMs < 20) delayMs = 100;
    if (delayMs > 2000) delayMs = 100;

    framesOut.push({
      delay,
      delayMs,
      disposalType,
      width: canvasW,
      height: canvasH,
      left: 0,
      top: 0,
      imageData: frameData,
    });
  }

  return framesOut;
}