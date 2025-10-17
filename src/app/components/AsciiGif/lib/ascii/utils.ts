// src/lib/ascii/utils.ts

/**
 * Рассчитать размер шрифта для ASCII-символов в canvas
 */
export function getAsciiFontSize(blockSize: number, scale: number): number {
  return Math.max(6, blockSize * scale);
}