'use client';

import React, { useRef, useEffect } from 'react';
import { saveGif, playGif } from './lib/gif';
import { saveAs } from 'file-saver';
import type { Layer, FrameObject } from './lib/types';
import { hexToRgb, colorDistance } from './lib/utils';

type Props = {
  frames: FrameObject[] | null;
  layers: Layer[];
  scale: number;
  blockSize: number;
  canvasBg: string;
  gifDims: { w: number; h: number } | null;
  speed: number; // 1..10, оригинальная скорость = 3
};

export function GifPreview({ frames, layers, scale, blockSize, canvasBg, gifDims, speed }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!frames || !canvasRef.current || !gifDims) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const outW = Math.floor(gifDims.w * scale);
    const outH = Math.floor(gifDims.h * scale);
    canvas.width = outW;
    canvas.height = outH;

    // Вся логика скорости внутри playGif
    const stop = playGif(
      frames,
      ctx,
      {
        outW,
        outH,
        blockSize,
        scale,
        canvasBg,
        layers,
      },
      speed // 1..10, оригинальная скорость = 3
    );

    return () => stop();
  }, [frames, layers, scale, blockSize, canvasBg, gifDims, speed]);

  // Сохранение текущего кадра canvas как PNG
  const saveCanvasAsFile = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (blob) saveAs(blob, 'ascii_canvas.png');
    });
  };

  // Сохранение анимации как SVG HTML файл
  const saveSvgAnimationAsFile = () => {
    if (!frames || !gifDims) return;

    const cols = Math.ceil(gifDims.w / blockSize);
    const rows = Math.ceil(gifDims.h / blockSize);

    const layersRGB = layers.map((l) => ({
      ...l,
      rgb: hexToRgb(l.target) as [number, number, number],
    }));
    const asciiLayers = layersRGB.filter((l) => l.visible && l.id !== -1);
    const showOriginal = layers.find((l) => l.id === -1 && l.visible);

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${gifDims.w}" height="${gifDims.h}" style="background:${canvasBg}">`;

    frames.forEach((frame, fi) => {
      svg += `<g id="frame${fi}" style="display:${fi === 0 ? 'inline' : 'none'}">`;
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
            const x = bx * blockSize + blockSize / 2;
            const y = by * blockSize + blockSize / 2;
            svg += `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" fill="${chosen.fg}" font-family="monospace" font-size="${blockSize}">${chosen.symbol}</text>`;
          }
        }
      }
      svg += `</g>`;
    });

    // Скрипт для анимации кадров
    const totalFrames = frames.length;
    svg += `<script><![CDATA[
      const frames = ${JSON.stringify(frames.map((_, i) => `frame${i}`))};
      let idx = 0;
      function showNext() {
        frames.forEach((id, i) => {
          document.getElementById(id).style.display = (i === idx) ? 'inline' : 'none';
        });
        idx = (idx + 1) % frames.length;
        setTimeout(showNext, 1000 / ${speed});
      }
      showNext();
    ]]></script>`;

    svg += `</svg>`;

    const blob = new Blob([svg], { type: 'text/html;charset=utf-8' });
    saveAs(blob, 'ascii_animation.html');
  };

  return (
    <div className="relative h-full flex items-center overflow-hidden">
      <div className="w-full flex justify-center items-center">
        {/* Кнопки сохранения */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            className="text-sm p-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-300 cursor-pointer"
            onClick={() =>
              frames &&
              saveGif(frames, layers, {
                scale,
                blockSize,
                canvasBg,
                gifDims: gifDims!,
                speed,
              })
            }
            disabled={!frames}
          >
            Сохранить GIF 💾
          </button>

          <button
            className="text-sm p-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-300 cursor-pointer"
            onClick={saveCanvasAsFile}
            disabled={!frames}
          >
            Сохранить Canvas PNG 🖼
          </button>

          <button
            className="text-sm p-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-300 cursor-pointer"
            onClick={saveSvgAnimationAsFile}
            disabled={!frames}
          >
            Сохранить SVG Анимацию 🖼
          </button>
        </div>

        {/* Canvas */}
        <canvas ref={canvasRef} className="max-w-full" />
      </div>
    </div>
  );
}
