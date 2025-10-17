import { config } from '../config';

/**
 * Эффект "штормовой прибой" — многослойные волны, шум, всплески и пена.
 * Использует символы и цвета из config.map.
 */
export function shoreWaveEffect(ctx: CanvasRenderingContext2D, frame: number) {
  const { width, height, block, speed, map } = config;
  const cols = Math.floor(width / block);
  const rows = Math.floor(height / block);

  const t = frame * speed * 0.08;
  const shoreline = rows * 0.7;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * block + block / 2;
      const y = r * block + block / 2;

      // --- МНОГОСЛОЙНЫЙ ВОЛНОВОЙ СИГНАЛ ---
      const layers = 6; // количество волн/слоев
      let totalWave = 0;
      for (let i = 1; i <= layers; i++) {
        const scale = 1 + i * 0.3;
        const speedFactor = t * (0.5 + i * 0.3);
        const phase = (c / cols + r / rows) * Math.PI * (1 + i * 0.7);
        totalWave += Math.sin(phase + speedFactor) * scale;
      }

      // шум и случайные всплески
      const noise = Math.sin(c * 0.7 + r * 1.3 + t * 5) * 1.2;
      const randomSplash = Math.random() * 0.5 * Math.sin(t * 10 + c * 0.3 + r * 0.7);

      const waveFront = shoreline + totalWave * 0.5 + noise + randomSplash;

      // --- ИНТЕНСИВНОСТЬ ---
      const dist = Math.abs(r - waveFront);
      let intensity = Math.max(0, 1 - dist / 2.8);

      // усиливаем пену ближе к берегу и всплески
      if (r > shoreline && intensity > 0.2) {
        intensity += ((r - shoreline) / (rows * 0.25)) * (0.3 + Math.random() * 0.2);
      }

      // колебания "дышания" прибоя
      const retreat = Math.sin(t * 2 + c * 0.5) * 0.4;
      intensity = Math.max(0, intensity - Math.abs(retreat));

      // добавляем случайные всплески пены
      if (Math.random() < 0.02) intensity = Math.max(intensity, 0.9);

      // --- ВЫБОР СИМВОЛА ---
      let id: keyof typeof map = '0';
      if (intensity > 0.75) id = '2'; // белая пена
      else if (intensity > 0.55) id = '3'; // переход
      else if (intensity > 0.25) id = '1'; // глубина
      else id = '0'; // пусто

      const cell = map[id];
      if (!cell) continue;

      // --- РИСОВАНИЕ ---
      if (cell.bg !== 'transparent') {
        ctx.fillStyle = cell.bg;
        ctx.fillRect(c * block, r * block, block, block);
      }

      // текст для контраста
      ctx.fillStyle = cell.bg === '#ffffff' ? '#000' : '#fff';
      ctx.fillText(cell.char, x, y);
    }
  }
}
