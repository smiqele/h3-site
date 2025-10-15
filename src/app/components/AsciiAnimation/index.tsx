'use client';

import { useEffect, useRef, useState } from 'react';
import { config } from './config';
import { waveCursorEffect } from './effects/waveCursorEffect';

export default function AsciiAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const { width, height, block } = config;
    const ctx = canvasRef.current!.getContext('2d')!;
    ctx.font = `${block * 0.6}px monospace`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvasRef.current!.getBoundingClientRect();
      setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    canvasRef.current!.addEventListener('mousemove', handleMouseMove);
    canvasRef.current!.addEventListener('mouseleave', () => setCursor(null));

    let frame = 0;

    function draw() {
      ctx.fillStyle = config.back;
      ctx.fillRect(0, 0, width, height);

      waveCursorEffect(ctx, frame, cursor);

      frame += config.speed;
      requestAnimationFrame(draw);
    }

    draw();

    return () => {
      canvasRef.current!.removeEventListener('mousemove', handleMouseMove);
    };
  }, [cursor]);

  return (
    <canvas
      ref={canvasRef}
      width={config.width}
      height={config.height}
      style={{ display: 'block' }}
    />
  );
}
