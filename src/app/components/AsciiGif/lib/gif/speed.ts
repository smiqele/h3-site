/**
 * Унифицированная функция расчёта задержки между кадрами GIF.
 * 
 * speed: 1–10
 *   1 → очень медленно (~4× медленнее)
 *   5 → оригинал (~60 мс ≈ 16 fps)
 *   10 → очень быстро (~0.25×, ~60 fps)
 */
export function calcDelay(base = 60, speed = 5): number {
  const min = 15;  // не быстрее 60 fps
  const max = 240; // не медленнее 4 fps
  let delay = base;

  if (speed < 5) {
    // 1..5 — замедление (до 4×)
    const t = (5 - speed) / 4;
    delay = base * (1 + 3 * t);
  } else if (speed > 5) {
    // 5..10 — ускорение (до 0.25×)
    const t = (speed - 5) / 5;
    delay = base * (1 - 0.75 * t);
  }

  return Math.min(Math.max(delay, min), max);
}