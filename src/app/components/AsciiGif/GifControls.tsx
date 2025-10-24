import React from 'react';

type Props = {
  blockSize: number;
  speed: number;
  canvasBg: string;
  canvasW: number;
  canvasH: number;
  setBlockSize: (v: number) => void;
  setSpeed: (v: number) => void;
  setCanvasBg: (v: string) => void;
  setCanvasW: (v: number) => void;
  setCanvasH: (v: number) => void;
};

export function GifControls({
  blockSize,
  speed,
  canvasBg,
  canvasW,
  canvasH,
  setBlockSize,
  setSpeed,
  setCanvasBg,
  setCanvasW,
  setCanvasH,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-6 p-3 bg-stone-50 border-b border-stone-200 text-stone-700">
      {/* Размер блока */}
      <div className="flex items-center gap-2">
        <label className="text-sm w-24">Block size</label>
        <input
          type="range"
          min={4}
          max={40}
          step={4}
          value={blockSize}
          onChange={(e) => setBlockSize(Number(e.target.value))}
        />
        <span className="text-xs text-gray-500">{blockSize}</span>
      </div>

      {/* Скорость */}
      <div className="flex items-center gap-2">
        <label className="text-sm w-12">Speed</label>
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
        <span className="text-xs text-gray-500">{speed}</span>
      </div>

      {/* Цвет фона */}
      <div className="flex items-center gap-2">
        <label className="text-sm w-12">BG</label>
        <input
          type="color"
          value={canvasBg}
          onChange={(e) => setCanvasBg(e.target.value)}
          className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
        />
      </div>

      {/* Размер холста */}
      <div className="flex items-center gap-3">
        <label className="text-sm w-16">Canvas</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={64}
            max={1920}
            value={canvasW}
            onChange={(e) => setCanvasW(Number(e.target.value))}
            className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
          />
          <span className="text-xs text-gray-500">×</span>
          <input
            type="number"
            min={64}
            max={1080}
            value={canvasH}
            onChange={(e) => setCanvasH(Number(e.target.value))}
            className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
