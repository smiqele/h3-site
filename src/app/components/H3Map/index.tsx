'use client';

import React, { useState, useRef, useEffect } from 'react';
import { initialElements, limitRadius, computeLagTarget } from './elementsData';
import { ConnectionLines } from './lines';
import { MovingLinks } from './MovingLinks';

interface H3MapProps {
  title?: string;
  subtitle?: string;
}

export interface MapElement {
  id: string;
  x: number;
  y: number;
  initX: number;
  initY: number;
  targetX: number;
  targetY: number;
  type: 'svg' | 'rect' | 'dot';
  width: number;
  height: number;
  svgContent?: string;
}

const H3Map: React.FC<H3MapProps> = ({ title, subtitle }) => {
  const canvasHeight = 1000; // фиксированная высота
  const [canvasWidth, setCanvasWidth] = useState<number | null>(null); // null для SSR

  const [elements, setElements] = useState<MapElement[]>(
    initialElements.map((el) => ({
      ...el,
      initX: el.x,
      initY: el.y,
      targetX: el.x,
      targetY: el.y,
      type: el.type || 'svg',
      svgContent: el.svgContent || '',
    }))
  );

  const draggingRef = useRef<string | null>(null);
  const isDraggingRef = useRef(false);
  const offsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const timeRef = useRef(0);

  // Инициализация canvasWidth на клиенте
  useEffect(() => {
    const updateSize = () => setCanvasWidth(window.innerWidth);
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Drag логика (mouse и touch объединены)
  const handleDragStart = (
    clientX: number,
    clientY: number,
    id: string,
    verticalOffset: number
  ) => {
    draggingRef.current = id;
    isDraggingRef.current = false;
    const el = elements.find((el) => el.id === id);
    if (el) {
      offsetRef.current = {
        x: clientX - (canvasWidth! / 2 + el.x),
        y: clientY - (verticalOffset + el.y),
      };
    }
  };

  const handleDragMove = (clientX: number, clientY: number, verticalOffset: number) => {
    if (!draggingRef.current) return;
    isDraggingRef.current = true;
    const id = draggingRef.current;

    setElements((prev) =>
      prev.map((el) => {
        if (el.id === id) {
          const newX = clientX - canvasWidth! / 2 - offsetRef.current.x;
          const newY = clientY - verticalOffset - offsetRef.current.y;

          const maxRadius =
            el.id.startsWith('az') || el.id.includes('up') || el.id.includes('down') ? 40 : 25;
          const limited = limitRadius(newX, newY, el.initX, el.initY, maxRadius);

          return { ...el, targetX: limited.x, targetY: limited.y };
        }
        return el;
      })
    );
  };

  const handleDragEnd = () => {
    draggingRef.current = null;
    isDraggingRef.current = false;
    setElements((prev) => prev.map((el) => ({ ...el, targetX: el.initX, targetY: el.initY })));
  };

  // Анимация и лаг
  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      timeRef.current += 0.01;

      setElements((prev) =>
        prev.map((el) => {
          let { targetX, targetY } = el;

          if (draggingRef.current && isDraggingRef.current && el.id !== draggingRef.current) {
            const dragged = prev.find((d) => d.id === draggingRef.current);
            if (dragged) {
              const maxOffset =
                el.id.startsWith('az') || el.id.includes('up') || el.id.includes('down') ? 20 : 10;
              const lag = computeLagTarget(el, dragged, maxOffset);
              targetX = lag.x;
              targetY = lag.y;
            }
          }

          let x = el.x + (targetX - el.x) * 0.15;
          const y = el.y + (targetY - el.y) * 0.15;

          // Горизонтальная анимация isp-up/isp-down
          if (!draggingRef.current && !isDraggingRef.current) {
            if (el.id === 'isp-up') x += Math.sin(timeRef.current) * 2;
            if (el.id === 'isp-down') x += Math.sin(timeRef.current + Math.PI / 3) * 2;
          }

          return { ...el, x, y, targetX, targetY };
        })
      );

      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // Масштаб для мобильных
  const scaleFactor = canvasWidth && canvasWidth < 1000 ? 0.45 : 1;

  // Вертикальный оффсет <g>
  const verticalOffset = canvasHeight / 2 + 100;

  // Не рендерим SVG на сервере (чтобы избежать hydration mismatch)
  if (canvasWidth === null) return null;

  return (
    <div className="relative w-full h-[1000px] bg-white overflow-hidden">
      <svg
        width="100%"
        height="1000"
        onMouseMove={(e) => handleDragMove(e.clientX, e.clientY, verticalOffset)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchMove={(e) =>
          handleDragMove(e.touches[0].clientX, e.touches[0].clientY, verticalOffset)
        }
        onTouchEnd={handleDragEnd}
      >
        <g transform={`translate(${canvasWidth / 2}, ${verticalOffset})`}>
          <ConnectionLines elements={elements} canvasWidth={canvasWidth} />
          <MovingLinks elements={elements} canvasWidth={canvasWidth} timeRef={timeRef} />

          {elements
            .filter((el) => !['100G', '400G', '4x100G'].includes(el.id))
            .map((el) => (
              <g
                key={el.id}
                onMouseDown={(e) => handleDragStart(e.clientX, e.clientY, el.id, verticalOffset)}
                onTouchStart={(e) =>
                  handleDragStart(e.touches[0].clientX, e.touches[0].clientY, el.id, verticalOffset)
                }
                style={{ cursor: 'grab', touchAction: 'none' }}
              >
                {el.type === 'svg' && el.svgContent && (
                  <image
                    href={el.svgContent}
                    x={el.x * scaleFactor - el.width / 2}
                    y={el.y - el.height / 2}
                    width={el.width}
                    height={el.height}
                    style={{ userSelect: 'none', pointerEvents: 'auto' }}
                  />
                )}
              </g>
            ))}
        </g>
      </svg>

      {(title || subtitle) && (
        <div className="w-full flex flex-col gap-5 p-4 sm:p-6 items-center z-10 transform -translate-y-[890px] sm:-translate-y-[875px]">
          {title && <h2 className="headline-xl-text">{title}</h2>}
          {subtitle && (
            <h3 className="body-mono-xl text-pretty max-w-3xl text-center">{subtitle}</h3>
          )}
        </div>
      )}
    </div>
  );
};

export default H3Map;
