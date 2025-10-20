'use client';

import { useEffect, useRef } from 'react';
import * as effects from './effects';

export type EffectKey = keyof typeof effects;

interface AsciiAnimationProps {
  effect?: EffectKey; // эффект по умолчанию
  width?: number; // ширина canvas
  height?: number; // высота canvas
  block?: number; // размер блока
  speed?: number; // скорость анимации
  back?: string; // фон
  style?: React.CSSProperties; // доп. стили для canvas
  className?: string; // класс для canvas
  active?: boolean; // запуск анимации
}

export default function AsciiAnimation({
  effect = 'loadEffect',
  width = 400,
  height = 480,
  block = 20,
  speed = 0.5,
  back = '#1B1B1B',
  style,
  className,
  active = true,
}: AsciiAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return; // если неактивно — не запускаем анимацию

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.font = `${block * 0.6}px monospace`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    let frame = 0;
    let animationId: number;

    function draw() {
      // очищаем фон
      ctx.fillStyle = back;
      ctx.fillRect(0, 0, width, height);

      // вызываем эффект с кастомными параметрами
      const effectFunc = effects[effect];
      if (effectFunc) effectFunc(ctx, frame, { width, height, block, back, speed });

      frame += speed;
      animationId = requestAnimationFrame(draw);
    }

    draw();

    return () => cancelAnimationFrame(animationId);
  }, [effect, width, height, block, speed, back, active]); // следим за active

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{
        display: 'block',
        ...style,
      }}
    />
  );
}
