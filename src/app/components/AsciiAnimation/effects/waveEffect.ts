import { config } from '../config';

export function waveEffect(ctx: CanvasRenderingContext2D, frame: number) {
  const { width, height, block, map, speed } = config; // добавили speed
  const cols = Math.floor(width / block);
  const rows = Math.floor(height / block);

  // применяем speed к frame
  const f = frame * speed;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * block + block / 2;
      const y = r * block + block / 2;

      // многослойная волна
      const wave1 = Math.sin((c / cols) * Math.PI * 2 + f * 0.15);
      const wave2 = Math.sin((r / rows) * Math.PI * 3 + f * 0.2);
      const wave3 = Math.sin((c / cols + r / rows) * Math.PI * 1.5 + f * 0.1);

      const val = wave1 + wave2 + wave3;
      const normalized = (val + 3) / 6;

      let id: keyof typeof map = '0';
      if (normalized > 0.6) id = '2';
      else if (normalized > 0.45) id = '3';
      else if (normalized > 0.3) id = '1';

      const cell = map[id];
      if (!cell) continue;

      if (cell.bg !== 'transparent') {
        ctx.fillStyle = cell.bg;
        ctx.fillRect(c * block, r * block, block, block);
      }

      ctx.fillStyle = cell.bg === '#ffffff' ? '#000' : '#fff';
      ctx.fillText(cell.char, x, y);
    }
  }
}
