import React from "react";
import { Element } from "./elementsData";

interface LinesProps {
  elements: Element[];
  canvasWidth: number; // для адаптива
}

const LINE_COLOR = "#d9d9d9";
const LINE_WIDTH = 1;
const OFFSET = 10; // общий отступ

// Элементы, для которых не нужно учитывать отступ
const noOffsetIds = ["dot-11", "dot-12", "dot-21", "dot-22", "dot-5az-1", "dot-5az-2"];

const adjustLine = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  size1: { width: number; height: number },
  size2: { width: number; height: number },
  ignoreOffset1 = false,
  ignoreOffset2 = false,
  canvasWidth: number
) => {
  const scaleFactor = canvasWidth < 1000 ? 0.45 : 1; // адаптив по X
  x1 *= scaleFactor;
  x2 *= scaleFactor;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.sqrt(dx * dx + dy * dy);
  if (distance === 0) return { x1, y1, x2, y2 };

  const offsetX1 = ignoreOffset1 ? 0 : (size1.width / 2) + OFFSET;
  const offsetY1 = ignoreOffset1 ? 0 : (size1.height / 2) + OFFSET;
  const offsetX2 = ignoreOffset2 ? 0 : (size2.width / 2) + OFFSET;
  const offsetY2 = ignoreOffset2 ? 0 : (size2.height / 2) + OFFSET;

  const angle = Math.atan2(dy, dx);

  return {
    x1: x1 + Math.cos(angle) * offsetX1,
    y1: y1 + Math.sin(angle) * offsetY1,
    x2: x2 - Math.cos(angle) * offsetX2,
    y2: y2 - Math.sin(angle) * offsetY2,
  };
};

export const ConnectionLines: React.FC<LinesProps> = ({ elements, canvasWidth }) => {
  const lines: React.ReactNode[] = [];

  const connectTo = (
    el: Element,
    targetIds: string[],
    options?: { noArrow?: boolean; dashArray?: string }
  ) => {
    targetIds.forEach((targetId) => {
      const t = elements.find((x) => x.id === targetId);
      if (!t) return;

      const { x1, y1, x2, y2 } = adjustLine(
        el.x,
        el.y,
        t.x,
        t.y,
        { width: el.width ?? 36, height: el.height ?? 36 },
        { width: t.width ?? 36, height: t.height ?? 36 },
        noOffsetIds.includes(el.id),
        noOffsetIds.includes(t.id),
        canvasWidth
      );

      lines.push(
        <line
          key={`${el.id}-${t.id}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={LINE_COLOR}
          strokeWidth={LINE_WIDTH}
          markerEnd={options?.noArrow ? undefined : "url(#arrowhead)"}
          strokeDasharray={options?.dashArray}
        />
      );
    });
  };

  elements.forEach((el) => {
    // Основные соединения
    if (el.id === "up") connectTo(el, ["az1", "az2", "isp-up"]);
    if (el.id === "down") connectTo(el, ["az3", "az4", "isp-down"]);

    if (el.id === "dot-11") connectTo(el, ["up", "pop-3data"]);
    if (el.id === "dot-12") connectTo(el, ["down", "pop-3data"]);
    if (el.id === "dot-21") connectTo(el, ["up", "pop-m9"]);
    if (el.id === "dot-22") connectTo(el, ["down", "pop-m9"]);

    if (el.id === "isp-up") connectTo(el, ["up"]);
    if (el.id === "isp-down") connectTo(el, ["down"]);

    // Соединяем az между собой
    if (el.id.startsWith("az")) {
      const otherAz = elements.filter((t) => t.id.startsWith("az") && t.id !== el.id);
      connectTo(el, otherAz.map((t) => t.id));
    }

    // Дополнительные соединения az к up/down
    if (el.id === "az1" || el.id === "az2") connectTo(el, ["up"]);
    if (el.id === "az3" || el.id === "az4") connectTo(el, ["down"]);

    // Пунктирные линии dot-5az
    if (el.id === "dot-5az-2") connectTo(el, ["dot-5az-1"], { noArrow: true, dashArray: "4,4" });
    if (el.id === "dot-5az-2") connectTo(el, ["5az"], { dashArray: "4,4" });
    if (el.id === "dot-5az-1") connectTo(el, ["pop-3data"], { dashArray: "4,4" });
  });

  return (
    <>
      <defs>
        <marker
          id="arrowhead"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L6,3 z" fill={LINE_COLOR} />
        </marker>
      </defs>
      {lines}
    </>
  );
};