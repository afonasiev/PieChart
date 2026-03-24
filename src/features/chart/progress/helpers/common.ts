import { type ArcConfig, type chartType, type statusType } from "@/features/chart/progress/types";

export function getProgressType(status: statusType, progress: number) {
  // В «терминальных» статусах значение прогресса фиксированное.
  // Параметры: status — текущий статус, progress — входной процент.
  switch (status) {
    case "warning":
      return 75;
    case "error":
      return 50;
    case "success":
      return 100;
    default:
      return progress;
  }
}

export function getProgressAriaLabel(status: statusType, progress: number) {
  // Отдельные aria-label для понятной озвучки скринридерами.
  // Параметры: status — тип состояния, progress — число для in-progress.
  switch (status) {
    case "warning":
      return "Progress warning";
    case "error":
      return "Progress error";
    case "success":
      return "Progress success";
    default:
      return `Progress ${progress} percent`;
  }
}

export function normalizedNumberProgress(progress: number) {
  // Защита от выхода за допустимый диапазон.
  // Параметр: progress — произвольное число прогресса.
  return Math.max(0, Math.min(100, progress));
}

export function getArcConfig(type: chartType): ArcConfig {
  // Для dashboard оставляем разрыв (gap) в нижней части дуги.
  // Параметр: type — circle | dashboard.
  if (type === "dashboard") {
    const gap = Math.PI / 2;
    const start = Math.PI / 2 + gap / 2;
    return {
      startAngle: start,
      totalAngle: Math.PI * 2 - gap,
    };
  }

  return {
    startAngle: -Math.PI / 2,
    totalAngle: Math.PI * 2,
  };
}
