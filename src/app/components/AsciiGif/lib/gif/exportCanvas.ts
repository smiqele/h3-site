import { saveAs } from 'file-saver';
import type { Layer, FrameObject } from '../types';
import { hexToRgb, colorDistance } from '../utils';

export function saveAsciiAnimationToFile(
  frames: FrameObject[],
  layers: Layer[],
  options: {
    blockSize: number;
    gifDims: { w: number; h: number };
    canvasBg: string;
    speed: number;
    filename?: string;
  }
) {
  const { blockSize, gifDims, canvasBg, speed, filename = 'ascii_animation.html' } = options;

  const cols = Math.ceil(gifDims.w / blockSize);
  const rows = Math.ceil(gifDims.h / blockSize);

  const layersRGB = layers.map((l) => ({
    ...l,
    rgb: hexToRgb(l.target) as [number, number, number],
  }));
  const showOriginal = layers.find((l) => l.id === -1 && l.visible);
  const asciiLayers = layersRGB.filter((l) => l.visible && l.id !== -1);

  // Начало SVG
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${gifDims.w}" height="${gifDims.h}" style="background:${canvasBg}">`;

  // Кадры как группы <g>
  frames.forEach((frame, fi) => {
    svg += `<g id="frame${fi}" style="display:${fi === 0 ? 'inline' : 'none'}">`;

    for (let by = 0; by < rows; by++) {
      for (let bx = 0; bx < cols; bx++) {
        const sxPix = Math.min(frame.width - 1, Math.floor(bx * blockSize + blockSize / 2));
        const syPix = Math.min(frame.height - 1, Math.floor(by * blockSize + blockSize / 2));
        const idx = (syPix * frame.width + sxPix) * 4;
        const pr = frame.imageData.data[idx],
          pg = frame.imageData.data[idx + 1],
          pb = frame.imageData.data[idx + 2],
          pa = frame.imageData.data[idx + 3];
        if (pa === 0) continue;

        let chosen: Layer | null = null;
        for (let li = asciiLayers.length - 1; li >= 0; li--) {
          const lay = asciiLayers[li];
          const dist = colorDistance([pr, pg, pb], lay.rgb as [number, number, number]);
          if (dist <= lay.spread) {
            chosen = lay;
            break;
          }
        }

        if (chosen) {
          const x = bx * blockSize + blockSize / 2;
          const y = by * blockSize + blockSize / 2;
          svg += `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" fill="${chosen.fg}" font-family="monospace" font-size="${blockSize}">${chosen.symbol}</text>`;
        }
      }
    }

    svg += `</g>`;
  });

  // Скрипт для анимации кадров
  svg += `<script><![CDATA[
    const frames = ${JSON.stringify(frames.map((_, i) => `frame${i}`))};
    let idx = 0;
    const delay = ${1000 / speed};
    function showNext() {
      frames.forEach((id, i) => {
        document.getElementById(id).style.display = (i === idx) ? 'inline' : 'none';
      });
      idx = (idx + 1) % frames.length;
      setTimeout(showNext, delay);
    }
    showNext();
  ]]></script>`;

  svg += `</svg>`;

  // Сохраняем на компьютер
  const blob = new Blob([svg], { type: 'text/html;charset=utf-8' });
  saveAs(blob, filename);
}
