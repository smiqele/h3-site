'use client';

import { useEffect, useRef, useState } from 'react';
import * as effects from './effects';

export type EffectKey = keyof typeof effects;
type TriggerMode = 'hover' | 'always' | 'click';

interface AsciiAnimationProps {
  effect?: EffectKey;
  width?: number;
  height?: number;
  block?: number;
  speed?: number;
  back?: string;
  className?: string;
  active?: boolean;
  trigger?: TriggerMode;
}

export default function AsciiAnimation({
  effect = 'loadEffect',
  width = 400,
  height = 480,
  block = 20,
  speed = 0.5,
  back = '#1B1B1B',
  active = true,
  trigger = 'hover',
  className = '',
}: AsciiAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const frameRef = useRef<number>(0);

  // 👇 при hover/click — изначально false, при always — активен
  const [isRunning, setIsRunning] = useState(
    trigger === 'always' ? active : false
  );

  // 🎬 Основной цикл
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.font = `${block * 0.6}px monospace`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    const effectFunc = effects[effect];
    if (!effectFunc) return;

    const draw = () => {
      if (!isRunning) return; // 🔥 не продолжаем если остановлено

      ctx.fillStyle = back;
      ctx.fillRect(0, 0, width, height);
      effectFunc(ctx, frameRef.current, { width, height, block, back, speed });

      frameRef.current += speed;
      animationRef.current = requestAnimationFrame(draw);
    };

    if (isRunning) {
      animationRef.current = requestAnimationFrame(draw);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [effect, width, height, block, speed, back, isRunning]);

  // 🖱 Управление hover / click
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleEnter = () => {
      if (trigger === 'hover') {
        setIsRunning(true);
      }
    };

    const handleLeave = () => {
      if (trigger === 'hover') {
        setIsRunning(false);
      }
    };

    const handleClick = () => {
      if (trigger === 'click') {
        setIsRunning((prev) => !prev);
      }
    };

    canvas.addEventListener('mouseenter', handleEnter);
    canvas.addEventListener('mouseleave', handleLeave);
    canvas.addEventListener('click', handleClick);

    return () => {
      canvas.removeEventListener('mouseenter', handleEnter);
      canvas.removeEventListener('mouseleave', handleLeave);
      canvas.removeEventListener('click', handleClick);
    };
  }, [trigger]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{
        display: 'block',
        cursor: trigger === 'click' ? 'pointer' : 'default',
      }}
    />
  );
}