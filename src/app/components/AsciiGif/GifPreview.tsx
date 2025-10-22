'use client';
import React, { useRef, useEffect } from 'react';
import { saveGif, playGif } from './lib/gif';
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

  useEffect(() => {
    console.log('▶️ useEffect start', { frames, canvasW, canvasH });

    if (!frames || !canvasRef.current) {
      console.warn('⚠️ Нет данных для рендера');
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) {
      console.warn('⚠️ Не удалось получить контекст Canvas');
      return;
    }

    canvas.width = canvasW;
    canvas.height = canvasH;

    const stop = playGif(
      frames,
      ctx,
      {
        outW: canvasW,
        outH: canvasH,
        blockSize,
        canvasBg,
        layers,
      },
      speed
    );

    return () => {
      stop();
      console.log('🛑 useEffect cleanup, animation stopped');
    };
  }, [frames, layers, blockSize, canvasBg, speed, canvasW, canvasH]);

  return (
    <div className="relative h-full flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="max-w-full" />
    </div>
  );
}
