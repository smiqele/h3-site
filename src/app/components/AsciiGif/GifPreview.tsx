'use client';
import React, { useRef, useEffect } from 'react';
import { playGif } from './lib/gif/play';
import { saveGif } from './lib/gif/export';
import type { Layer, FrameObject } from './lib/types';

type Props = {
  frames: FrameObject[] | null;
  layers: Layer[];
  blockSize: number;
  canvasBg: string;
  speed: number;
  canvasW: number;
  canvasH: number;
};

export function GifPreview({
  frames,
  layers,
  blockSize,
  canvasBg,
  speed,
  canvasW,
  canvasH,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playerRef = useRef<ReturnType<typeof playGif> | null>(null);

  // Перезапуск анимации только при изменении кадров или размеров холста
  useEffect(() => {
    if (!frames || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    canvas.width = canvasW;
    canvas.height = canvasH;

    playerRef.current?.stop();

    playerRef.current = playGif(frames, ctx, {
      outW: canvasW,
      outH: canvasH,
      blockSize,
      canvasBg,
      layers,
      speed,
    });

    return () => playerRef.current?.stop();
  }, [frames, canvasW, canvasH]);

  // live-update для blockSize, layers, canvasBg и speed
  useEffect(() => {
    playerRef.current?.updateOptions({ blockSize, canvasBg, layers, speed });
  }, [blockSize, canvasBg, layers, speed]);

  const handleSave = () => {
    if (!frames || frames.length === 0) return;

    saveGif(frames, layers, {
      blockSize,
      canvasBg,
      gifDims: { w: canvasW, h: canvasH },
      speed,
    })
      .then(() => console.log('✅ GIF сохранён'))
      .catch(console.error);
  };

  return (
    <div className="relative h-full flex flex-col items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="max-w-full" />
      <button
        onClick={handleSave}
        className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
      >
        Save GIF
      </button>
    </div>
  );
}
