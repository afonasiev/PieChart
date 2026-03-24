// Поддерживаемые бизнес-статусы индикатора.
export type statusType = "in progress" | "success" | "warning" | "error";

// Доступные геометрические режимы.
export type chartType = "circle" | "dashboard";

// Движок рендера (SVG или Canvas).
export type engineType = "svg" | "canvas";

// Разрешённые значения толщины дуги (дизайн-система).
export type strokeWidth = 4 | 6 | 8 | 10;

// Разрешённые размеры компонента (дизайн-система).
export type svgSize = 80 | 100 | 120 | 140;

export interface Props {
  type?: chartType;
  status?: statusType;
  size?: svgSize;
  strokeWidth?: strokeWidth;
  progress?: number;
  additionalColor?: boolean;
  hsl?: boolean;
  engine?: engineType;
}

// Контракт для базового SVG-примитива дуги.
export interface CircleProps {
  circleSize: number;
  circleRadius: number;
  strokeWidth: strokeWidth;
  dashArray: string;
  rotate: string;
  color: string;
}

// Контракт текста в центре прогресса.
export interface TextProps {
  progress: number;
  color: string;
}

// Контракт иконок статусов в центре прогресса.
export interface StatusProps {
  position: number;
  color: string;
}

// Единый контракт пропсов, который получает любой engine (svg/canvas).
export interface EngineProps {
  size: number;
  viewBox: string;
  ariaLabel: string;
  progress: number;
  circleSize: number;
  strokeWidth: strokeWidth;
  circleRadius: number;
  circleRotate: string;
  circleArc: number;
  circleRound: number;
  colorStatus: string;
  progressLength: number;
  status: statusType;
  chartType: chartType;
}

// Палитра компонента прогресса.
export enum COLORS {
  SUCCESS = "#00c853",
  ERROR = "#ff5252",
  WARNING = "#ffa726",
  BACKGROUND = "#ececec",
  TEXT = "#8e959f",
  PROGRESS = "#2196f3",
}

// Представление цвета в HSL для интерполяции.
export type HSL = Readonly<{
  h: number;
  s: number;
  l: number;
}>;

// Геометрия дуги для canvas-отрисовки.
export type ArcConfig = {
  startAngle: number;
  totalAngle: number;
};
