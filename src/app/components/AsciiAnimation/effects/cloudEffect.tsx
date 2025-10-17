import { config } from '../config';

/**
 * Эффект "облако" — плавно движущиеся ASCII-облака в верхней части холста.
 * Использует символы из config.map.
 */
export function cloudEffect(ctx: CanvasRenderingContext2D, frame: number) {
  const { width, height, block, speed, map } = config;
  const cols = Math.floor(width / block);
  const rows = Math.floor(height / block);

  // верхняя треть холста — облака
  const cloudHeight = Math.floor(rows * 0.3);

  // горизонтальное дрейфование
  const drift = Math.sin(frame * speed * 0.05) * 2; // плавное движение

  for (let r = 0; r < cloudHeight; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * block + block / 2;
      const y = r * block + block / 2;

      // плотность облака: средняя с шумом
      const noise = Math.sin((c + frame * 0.1) * 0.5) * 0.3 + Math.random() * 0.2;
      const density = Math.max(0, 0.5 + noise);

      // эффект дрейфа
      const driftedCol = (c + drift + frame * 0.01) % cols;

      // выбор символа по плотности
      let id: keyof typeof map = '0';
      if (density > 0.7) id = '2'; // яркая часть облака
      else if (density > 0.45) id = '3'; // средняя плотность
      else if (density > 0.25) id = '1'; // тень облака
      else id = '0'; // пустота

      const cell = map[id];
      if (!cell) continue;

      // фон
      if (cell.bg !== 'transparent') {
        ctx.fillStyle = cell.bg;
        ctx.fillRect(c * block, r * block, block, block);
      }

      // символ
      ctx.fillStyle = cell.bg === '#ffffff' ? '#000' : '#fff';
      ctx.fillText(cell.char, x, y);
    }
  }

  // остальная часть холста — фон
  for (let r = cloudHeight; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (map['0'].bg !== 'transparent') {
        ctx.fillStyle = map['0'].bg;
        ctx.fillRect(c * block, r * block, block, block);
      }
    }
  }
}
