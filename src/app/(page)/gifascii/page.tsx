'use client';
import React, { useState, useEffect } from 'react';
import { Layer, FrameObject } from '../../components/AsciiGif/lib/types';
import { parseFileToFrames } from '../../components/AsciiGif/lib/gif';
import { GifPreview } from '../../components/AsciiGif/GifPreview';
import { GifControls } from '../../components/AsciiGif/GifControls';
import { LayersPanel } from '../../components/AsciiGif/LayersPanel';
import { Plus } from 'lucide-react';

export default function Page() {
  const [frames, setFrames] = useState<FrameObject[] | null>(null);
  const [canvasW, setCanvasW] = useState(640);
  const [canvasH, setCanvasH] = useState(480);
  const [blockSize, setBlockSize] = useState(8);
  const [speed, setSpeed] = useState(5);
  const [canvasBg, setCanvasBg] = useState('#ffffff');
  const [layers, setLayers] = useState<Layer[]>(() => [
    {
      id: -1,
      symbol: '',
      fg: '#000000',
      bg: '#ffffff',
      target: '#000000',
      spread: 100,
      visible: true,
    },
    {
      id: 0,
      symbol: '@',
      fg: '#000000',
      bg: '#ffffff',
      target: '#000000',
      spread: 100,
      visible: true,
    },
    {
      id: 1,
      symbol: '#',
      fg: '#ffffff',
      bg: '#000000',
      target: '#ff0000',
      spread: 100,
      visible: true,
    },
    {
      id: 2,
      symbol: '*',
      fg: '#000000',
      bg: '#ffffff',
      target: '#00ff00',
      spread: 100,
      visible: true,
    },
    {
      id: 3,
      symbol: '%',
      fg: '#0000ff',
      bg: '#ffffff',
      target: '#0000ff',
      spread: 100,
      visible: false,
    },
  ]);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [gifFiles, setGifFiles] = useState<string[]>([]);

  // ------------------------- Загрузка GIFs с API -------------------------
  useEffect(() => {
    fetch('/api/gifs')
      .then((res) => res.json())
      .then((urls: string[]) => {
        setGifFiles(urls);
        if (urls.length > 0) loadGifFromUrl(urls[0]);
      });
  }, []);

  async function loadGifFromUrl(url: string) {
    const res = await fetch(url);
    const blob = await res.blob();
    const parsed = await parseFileToFrames(new File([blob], 'gif'));
    if (!parsed || parsed.length === 0) return;

    setFrames(parsed);
    setCanvasW(parsed[0].width);
    setCanvasH(parsed[0].height);
    setGifUrl(url);
  }

  // ------------------------- Загрузка локального файла -------------------------
  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setGifUrl(URL.createObjectURL(file));

    const parsed = await parseFileToFrames(file);
    if (!parsed || parsed.length === 0) return;

    setFrames(parsed);
    setCanvasW(parsed[0].width);
    setCanvasH(parsed[0].height);
  }

  function updateLayer(id: number, patch: Partial<Layer>) {
    setLayers((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  return (
    <div className="h-screen bg-stone-100 overflow-hidden flex">
      {/* Панель превью GIF + загрузка */}
      <div className="h-screen min-w-18 w-fit p-1 border-r border-stone-200 overflow-scroll flex flex-col items-center">
        <div className="sticky top-1 w-12 h-12 text-sm text-stone-500 hover:text-stone-900 rounded bg-stone-100 hover:bg-stone-300 mb-4">
          <label className="w-12 h-12 flex flex-col items-center justify-center cursor-pointer">
            <Plus className="w-5 h-5" />
            <input type="file" accept="image/gif" className="hidden" onChange={handleFile} />
          </label>
        </div>

        {gifFiles.length > 0 && (
          <div className="flex flex-col gap-1">
            {gifFiles.map((file) => (
              <div key={file} className="w-16 h-16">
                <img
                  src={file}
                  className={`w-16 h-16 object-cover border-1 rounded cursor-pointer overflow-hidden ${
                    file === gifUrl ? 'border-stone-900' : 'border-stone-100'
                  }`}
                  onClick={() => loadGifFromUrl(file)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Основной блок */}
      <div className="flex-1 flex flex-col">
        <GifControls
          blockSize={blockSize}
          speed={speed}
          canvasBg={canvasBg}
          canvasW={canvasW}
          canvasH={canvasH}
          setBlockSize={setBlockSize}
          setSpeed={setSpeed}
          setCanvasBg={setCanvasBg}
          setCanvasW={setCanvasW}
          setCanvasH={setCanvasH}
        />

        <div className="flex-1">
          <GifPreview
            frames={frames}
            layers={layers}
            blockSize={blockSize}
            speed={speed}
            canvasBg={canvasBg}
            canvasW={canvasW}
            canvasH={canvasH}
          />
        </div>
      </div>

      {/* Панель слоёв */}
      <div className="h-screen w-80 border-l border-stone-200">
        <LayersPanel layers={layers} updateLayer={updateLayer} gifUrl={gifUrl} />
      </div>
    </div>
  );
}
