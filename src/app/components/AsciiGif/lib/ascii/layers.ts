// src/lib/ascii/layers.ts
import type { Layer } from "../types";
import { hexToRgb } from "../utils/colors";

/**
 * Добавляет поле rgb ко всем слоям
 */
export function prepareLayers(layers: Layer[]) {
  return layers.map((l) => ({
    ...l,
    rgb: hexToRgb(l.target) as [number, number, number],
  }));
}

/**
 * Отбирает только активные ASCII-слои (без оригинального gif-слоя)
 */
export function getAsciiLayers(layers: Layer[]) {
  return prepareLayers(layers).filter((l) => l.visible && l.id !== -1);
}

/**
 * Проверяет, включен ли оригинальный слой
 */
export function hasOriginalLayer(layers: Layer[]): boolean {
  return !!layers.find((l) => l.id === -1 && l.visible);
}