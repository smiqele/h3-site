// src/lib/utils/colors.ts

/**
 * Преобразует hex-строку (#rrggbb или #rgb) в массив [r, g, b]
 */
export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const fullHex = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
  const bigint = parseInt(fullHex, 16);

  return [
    (bigint >> 16) & 255, // R
    (bigint >> 8) & 255,  // G
    bigint & 255          // B
  ];
}

/**
 * Вычисляет расстояние между двумя цветами RGB
 * Чем меньше число, тем ближе цвета
 */
export function colorDistance(a: [number, number, number], b: [number, number, number]): number {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}