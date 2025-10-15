import React from 'react';

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

interface MovingLinksProps {
  elements: MapElement[];
  timeRef: React.MutableRefObject<number>;
  canvasWidth: number;
}

export const MovingLinks: React.FC<MovingLinksProps> = ({ elements, timeRef, canvasWidth }) => {
  const scaleFactor = canvasWidth < 1000 ? 0.45 : 1;

  // Ищем узлы AZ
  const az1 = elements.find((el) => el.id === 'az1');
  const az2 = elements.find((el) => el.id === 'az2');
  const az3 = elements.find((el) => el.id === 'az3');
  const az4 = elements.find((el) => el.id === 'az4');

  const renderMovingImage = (
    from: MapElement,
    to: MapElement,
    id: string,
    speed: number,
    phase: number,
    keySuffix: string
  ) => {
    return elements
      .filter((el) => el.id === id)
      .map((el, i) => {
        const progress = 0.5 * (1 + Math.sin(timeRef.current * speed + phase));
        const xPos = (from.x + (to.x - from.x) * progress) * scaleFactor;
        const yPos = from.y + (to.y - from.y) * progress;

        return (
          <image
            key={`${id}-${keySuffix}-${i}`}
            href={el.svgContent}
            x={xPos - el.width / 2}
            y={yPos - el.height / 2}
            width={el.width}
            height={el.height}
          />
        );
      });
  };

  return (
    <>
      {az1 && az2 && renderMovingImage(az1, az2, '400G', 0.8, 0, 'az1-az2')}
      {az4 && az3 && renderMovingImage(az4, az3, '400G', 0.6, Math.PI / 3, 'az4-az3')}
      {az3 && az2 && renderMovingImage(az3, az2, '400G', 0.9, Math.PI / 2, 'az3-az2')}
      {az1 && az4 && renderMovingImage(az1, az4, '400G', 0.7, Math.PI / 1.5, 'az1-az4')}
    </>
  );
};
