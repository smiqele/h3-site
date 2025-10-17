// src/lib/ascii/fonts.ts

/**
 * Подключение кастомных шрифтов для ASCII-рендеринга
 * (ожидается, что OTF/TTF файлы лежат в /public/fonts)
 */
export const asciiFonts = {
  regular: "MyAscii-Regular",
  medium: "MyAscii-Medium",
  bold: "MyAscii-Bold",
  black: "MyAscii-Black",
} as const;

export type AsciiFontWeight = keyof typeof asciiFonts;

/**
 * Получить CSS font string для canvas context
 */
export function getAsciiFont(size: number, weight: AsciiFontWeight = "regular"): string {
  return `${size}px '${asciiFonts[weight]}', monospace`;
}