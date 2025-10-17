/**
 * Минимальная задержка для браузеров (примерно 60 fps)
 */
const MIN_DELAY = 1000 / 60;

/**
 * Нормализация задержки кадра (учёт того, что браузеры ограничивают gif-задержку)
 */
export function normalizeDelay(delayMs?: number): number {
  if (!delayMs || delayMs < 20) return 100; // минимум 100ms
  if (delayMs > 200) return 100; // браузеры режут слишком большие задержки
  return delayMs;
}

/**
 * Рассчёт итоговой задержки с учётом speed (1..10)
 * 5 = оригинальная скорость
 */
export function calculateDelay(baseDelay: number, speed: number): number {
  let delay = baseDelay;

  if (speed < 5) {
    // замедление
    const t = (5 - speed) / 4; // 0..1
    delay = baseDelay * (1 + t);
  } else if (speed > 5) {
    // ускорение
    const t = (speed - 5) / 5; // 0..1
    delay = baseDelay * (1 - t) + MIN_DELAY * t;
  }

  return delay;
}