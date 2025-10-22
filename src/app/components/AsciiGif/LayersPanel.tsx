// LayersPanel.tsx
'use client';
import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { Layer } from './lib/types/layer';
import { svgBlocks } from './lib/ascii';

type Props = {
  layers: Layer[];
  updateLayer: (id: number, patch: Partial<Layer>) => void;
  gifUrl?: string | null;
};

export function LayersPanel({ layers, updateLayer, gifUrl }: Props) {
  return (
    <aside className="flex flex-col justify-between h-full overflow-hidden">
      <div className="">
        {layers.slice(1).map((l) => {
          const SelectedSvg = svgBlocks[l.symbol] || svgBlocks['null'];
          return (
            <div key={l.id} className="flex flex-col border-b border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="font-bold text-sm">#{l.id + 1}</div>
                <button
                  className={`ml-auto text-sm ${l.visible ? 'text-gray-700' : 'text-gray-300'}`}
                  onClick={() => updateLayer(l.id, { visible: !l.visible })}
                >
                  {l.visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>

              {/* Выбор SVG блока */}
              <div className="flex items-center gap-2 mb-4">
                <label className="block text-sm pr-2 w-16">Symbol</label>
                <select
                  value={l.symbol}
                  onChange={(e) => updateLayer(l.id, { symbol: e.target.value })}
                  className="border border-gray-400 rounded px-1 py-1 text-sm"
                >
                  {Object.keys(svgBlocks).map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>

                {/* Превью выбранного SVG */}
                <div className="w-8 h-8 ml-2">
                  <SelectedSvg fg={l.fg} bg={l.bg} width={32} height={32} />
                </div>

                {/* Цвет path (символ) */}
                <div className="w-8 h-8 border relative border-gray-400 rounded-full overflow-hidden flex items-center justify-center z-20">
                  <input
                    type="color"
                    className="w-16 h-16 absolute"
                    value={l.fg}
                    onChange={(e) => updateLayer(l.id, { fg: e.target.value })}
                  />
                </div>

                {/* Цвет rect (фон) */}
                <div className="w-8 h-8 border relative border-gray-400 rounded-full overflow-hidden flex items-center justify-center z-10">
                  <input
                    type="color"
                    className="w-16 h-16 absolute"
                    value={l.bg}
                    onChange={(e) => updateLayer(l.id, { bg: e.target.value })}
                  />
                </div>
              </div>

              {/* Настройки таргета и spread */}
              <div className="flex items-center gap-2">
                <label className="block text-sm pr-2 w-16">Target</label>
                <div className="w-8 h-8 border relative border-gray-400 rounded-full overflow-hidden flex items-center justify-center z-20">
                  <input
                    type="color"
                    className="w-16 h-16 absolute"
                    value={l.target}
                    onChange={(e) => updateLayer(l.id, { target: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    className="w-20"
                    min={0}
                    max={500}
                    value={l.spread}
                    onChange={(e) => updateLayer(l.id, { spread: Number(e.target.value) })}
                  />
                  <div className="ml-2 text-xs text-gray-500">Spread: {l.spread.toFixed(0)}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Оригинальный GIF */}
      {gifUrl && (
        <div className="p-4 flex flex-col items-center">
          <div className="w-full flex items-center gap-2 mb-2">
            <div className="font-bold text-sm">Original GIF</div>
            <button
              className={`ml-auto text-sm ${
                layers.find((l) => l.id === -1)?.visible ? 'text-gray-700' : 'text-gray-300'
              }`}
              onClick={() =>
                updateLayer(-1, { visible: !layers.find((l) => l.id === -1)?.visible })
              }
            >
              {layers.find((l) => l.id === -1)?.visible ? (
                <Eye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </button>
          </div>
          <img src={gifUrl} alt="original gif" className="max-w-full rounded" />
        </div>
      )}
    </aside>
  );
}
