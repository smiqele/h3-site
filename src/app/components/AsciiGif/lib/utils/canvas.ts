/**
 * Создаёт временный canvas для работы с изображениями
 */
export function createTempCanvas(width: number, height: number): CanvasRenderingContext2D {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Не удалось создать 2D-контекст для временного canvas");
  return ctx;
}

/**
 * Заполняет фон canvas определённым цветом
 */
export function fillCanvas(ctx: CanvasRenderingContext2D, color: string, width: number, height: number) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Масштабирует координаты
 */
export function scaleCoord(coord: number, original: number, target: number): number {
  return (coord * target) / original;
}