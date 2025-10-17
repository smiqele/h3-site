'use client';

import { useEffect, useRef, useState } from 'react';
import { config } from './config';
import * as effects from './effects';

// создаем тип всех эффектов
type EffectKey = keyof typeof effects;

export default function AsciiAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const effectKeys = Object.keys(effects) as EffectKey[];
  const [effect, setEffect] = useState<EffectKey>(effectKeys[0]); // первый эффект по умолчанию

  useEffect(() => {
    const { width, height, block } = config;
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
      ctx.fillStyle = config.back;
      ctx.fillRect(0, 0, width, height);

      // 🔹 вызываем выбранный эффект
      const effectFunc = effects[effect];
      if (effectFunc) effectFunc(ctx, frame);

      frame += config.speed;
      animationId = requestAnimationFrame(draw);
    }

    draw();

    return () => cancelAnimationFrame(animationId);
  }, [effect]);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: 12 }}>
        <label style={{ color: '#ccc', marginRight: 8 }}>Effect:</label>
        <select
          value={effect}
          onChange={(e) => setEffect(e.target.value as EffectKey)}
          style={{
            background: '#222',
            color: '#fff',
            border: '1px solid #555',
            padding: '6px 10px',
            borderRadius: 4,
          }}
        >
          {effectKeys.map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>

      <canvas
        ref={canvasRef}
        width={config.width}
        height={config.height}
        style={{
          display: 'block',
          margin: '0 auto',
          background: config.back,
          fontFamily: 'monospace',
        }}
      />
    </div>
  );
}
