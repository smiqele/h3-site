export interface Element {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  initX: number;
  initY: number;
  targetX: number;
  targetY: number;
  type: "rect" | "svg" | "dot";
  svgContent?: string;
}

// Начальные позиции элементов
export const initialElements: Element[] = [
  { id: "az1", x: -200, y: -70, initX: -200, initY: -70, targetX: -200, targetY: -70, type: "svg", svgContent: "/h3mapsvg/az1.svg", width: 56, height: 36 },
  { id: "az2", x: 200, y: -70, initX: 200, initY: -70, targetX: 200, targetY: -70, type: "svg", svgContent: "/h3mapsvg/az2.svg", width: 56, height: 36 },
  { id: "az3", x: -200, y: 70, initX: -200, initY: 70, targetX: -200, targetY: 70, type: "svg", svgContent: "/h3mapsvg/az3.svg", width: 56, height: 36 },
  { id: "az4", x: 200, y: 70, initX: 200, initY: 70, targetX: 200, targetY: 70, type: "svg", svgContent: "/h3mapsvg/az4.svg", width: 56, height: 36 },
  
  { id: "up", x: 0, y: -150, initX: 0, initY: -150, targetX: 0, targetY: -150, type: "svg", svgContent: "/h3mapsvg/router.svg", width: 72, height: 72},
  { id: "down", x: 0, y: 150, initX: 0, initY: 150, targetX: 0, targetY: 150, type: "svg", svgContent: "/h3mapsvg/router.svg", width: 72, height: 72},
  
  { id: "isp-down", x: 0, y: 330, initX: 0, initY: 330, targetX: 0, targetY: 330, type: "svg", svgContent: "/h3mapsvg/isp.svg", width: 93, height: 56},
  { id: "isp-up", x: 0, y: -550, initX: 0, initY: -550, targetX: 0, targetY: -550, type: "svg", svgContent: "/h3mapsvg/isp.svg", width: 93, height: 56},
  
  { id: "pop-m9", x: 350, y: 0, initX: 350, initY: 0, targetX: 350, targetY: 0, type: "svg", svgContent: "/h3mapsvg/pop-3data.svg", width: 100, height: 100},
  { id: "pop-3data", x: -350, y: 0, initX: -350, initY: 0, targetX: -350, targetY: 0, type: "svg", svgContent: "/h3mapsvg/pop-m9.svg", width: 100, height: 100},
  
  { id: "dot-12", x: -350, y: 150, initX: -350, initY: 150, targetX: -350, targetY: 150, type: "dot", width: 0, height: 1 },
  { id: "dot-11", x: -350, y: -150, initX: -350, initY: -150, targetX: -350, targetY: -150, type: "dot",  width: 0, height: 1},
  { id: "dot-22", x: 350, y: 150, initX: 350, initY: 150, targetX: 350, targetY: 150, type: "dot",  width: 0, height: 1},
  { id: "dot-21", x: 350, y: -150, initX: 350, initY: -150, targetX: 350, targetY: -150, type: "dot",  width: 0, height: 1},
  
  { id: "dot-5az-1", x: -500, y: 0, initX: -500, initY: 0, targetX: -500, targetY: 0, type: "dot",  width: 0, height: 1},
  { id: "dot-5az-2", x: -500, y: 250, initX: -500, initY: 250, targetX: -500, targetY: 250, type: "dot",  width: 0, height: 1},
  { id: "5az", x: -200, y: 250, initX: -200, initY: 250, targetX: -200, targetY: 250, type: "svg", svgContent: "/h3mapsvg/az5.svg", width: 56, height: 36 },

  { id: "100G", x: 0, y: 0, initX: 0, initY: 0, targetX: 0, targetY: 0, type: "svg", svgContent: "/h3mapsvg/100G.svg", width: 42, height: 18 },
  { id: "400G", x: 0, y: 0, initX: 0, initY: 0, targetX: 0, targetY: 0, type: "svg", svgContent: "/h3mapsvg/400G.svg", width: 42, height: 18 },
  { id: "4x100G", x: 0, y: 0, initX: 0, initY: 0, targetX: 0, targetY: 0, type: "svg", svgContent: "/h3mapsvg/4x100G.svg", width: 55, height: 18 },
];

// Ограничение радиуса перетаскивания
export const limitRadius = (x: number, y: number, initX: number, initY: number, maxRadius: number) => {
  const dx = x - initX;
  const dy = y - initY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  if (distance > maxRadius) {
    const ratio = maxRadius / distance;
    return { x: initX + dx * ratio, y: initY + dy * ratio };
  }
  return { x, y };
};

// Lag-effect для остальных элементов
export const computeLagTarget = (el: Element, draggedEl: Element, maxOffset = 20) => {
  const dx = draggedEl.targetX - el.initX;
  const dy = draggedEl.targetY - el.initY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const ratio = Math.min(distance / 40, 1) * maxOffset / distance || 0;
  return { x: el.initX + dx * ratio, y: el.initY + dy * ratio };
};