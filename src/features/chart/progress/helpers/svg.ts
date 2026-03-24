import { COLORS, type HSL, type statusType } from "@/features/chart/progress/types";
import { normalizedNumberProgress } from "./common.ts";

// Возвращает итоговый цвет прогресса:
// - для фиксированных статусов — предопределённый цвет,
// - для in progress — динамический градиент по значению прогресса.
// Параметры: status, progress, additionalColor (включает 3-й цвет), hsl (режим интерполяции).
export function getColorStatus(
  status: statusType,
  progress: number,
  additionalColor: boolean,
  hsl: boolean,
) {
  switch (status) {
    case "warning":
      return COLORS.WARNING;
    case "error":
      return COLORS.ERROR;
    case "success":
      return COLORS.SUCCESS;
    default:
      return getProgressColor(
        progress,
        COLORS.ERROR,
        COLORS.SUCCESS,
        additionalColor ? COLORS.WARNING : undefined,
        hsl,
      );
  }
}

export function hexToRgb(hex: string) {
  // Конвертация #RRGGBB в числовые RGB-каналы.
  // Параметр: hex — цвет в HEX-формате.
  const normalized = hex.replace("#", "");
  const value = parseInt(normalized, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

export function interpolateChannel(start: number, end: number, factor: number) {
  // Линейная интерполяция одного канала.
  // Параметры: start/end — границы канала, factor — коэффициент [0..1].
  return Math.round(start + (end - start) * factor);
}

export function interpolateRGB(from: string, to: string, factor: number) {
  // Интерполяция цвета в RGB-пространстве.
  // Параметры: from/to — HEX-цвета, factor — коэффициент [0..1].
  const start = hexToRgb(from);
  const end = hexToRgb(to);

  const r = interpolateChannel(start.r, end.r, factor);
  const g = interpolateChannel(start.g, end.g, factor);
  const b = interpolateChannel(start.b, end.b, factor);

  return `rgb(${r}, ${g}, ${b})`;
}

export function hexToHsl(hex: string): HSL {
  // Конвертация #RRGGBB в HSL для «мягких» переходов по тону.
  // Параметр: hex — цвет в HEX-формате.
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  const d = max - min;

  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return {
    h: h * 360,
    s: s * 100,
    l: l * 100,
  };
}

export function interpolateHSL(from: string, to: string, factor: number) {
  // Интерполяция по кратчайшему пути оттенка (hue) на цветовом круге.
  // Параметры: from/to — HEX-цвета, factor — коэффициент [0..1].
  const a = hexToHsl(from);
  const b = hexToHsl(to);
  let hueDiff = b.h - a.h;

  if (Math.abs(hueDiff) > 180) {
    hueDiff -= Math.sign(hueDiff) * 360;
  }

  const h = (a.h + hueDiff * factor + 360) % 360;
  const s = a.s + (b.s - a.s) * factor;
  const l = a.l + (b.l - a.l) * factor;

  return `hsl(${h}, ${s}%, ${l}%)`;
}

export function getProgressColor(
  progress: number,
  color1: string,
  color2: string,
  color3?: string,
  hsl: boolean = false,
) {
  // Градиент может быть:
  // - 2-точечным: color1 -> color2
  // - 3-точечным: color1 -> color3 -> color2 (разделение в 50%)
  // Параметры: progress, color1/color2/(color3), hsl (RGB/HSL интерполяция).
  const clamped = normalizedNumberProgress(progress);
  let factor: number;
  let fromColor: string;
  let toColor: string;
  if (color3) {
    if (clamped <= 50) {
      factor = clamped / 50;
      fromColor = color1;
      toColor = color3;
    } else {
      factor = (clamped - 50) / 50;
      fromColor = color3;
      toColor = color2;
    }
  } else {
    factor = clamped / 100;
    fromColor = color1;
    toColor = color2;
  }
  if (hsl) {
    return interpolateHSL(fromColor, toColor, factor);
  } else {
    return interpolateRGB(fromColor, toColor, factor);
  }
}
