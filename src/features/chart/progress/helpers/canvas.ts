import { COLORS } from "@/features/chart/progress/types";

export function drawStatusCircle(
  ctx: CanvasRenderingContext2D,
  center: number,
  radius: number,
  fillColor: string,
): void {
  // Общая подложка для иконок статуса в центре.
  // Параметры: ctx, center, radius, fillColor.
  ctx.beginPath();
  ctx.fillStyle = fillColor;
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.fill();
}

export function drawWarningIcon(ctx: CanvasRenderingContext2D, center: number, size: number): void {
  // Иконка warning: круглый бейдж + восклицательный знак.
  // Параметры: ctx, center (центр), size (базовый масштаб иконки).
  const bgRadius = size * 0.16;

  drawStatusCircle(ctx, center, bgRadius, COLORS.WARNING);

  ctx.beginPath();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = Math.max(2, size * 0.028);
  ctx.lineCap = "round";

  ctx.moveTo(center, center - size * 0.07);
  ctx.lineTo(center, center + size * 0.015);
  ctx.stroke();

  ctx.beginPath();
  ctx.fillStyle = "#ffffff";
  ctx.arc(center, center + size * 0.075, size * 0.014, 0, Math.PI * 2);
  ctx.fill();
}

export function drawSuccessIcon(ctx: CanvasRenderingContext2D, center: number, size: number): void {
  // Иконка success: круглый бейдж + галочка.
  // Параметры: ctx, center (центр), size (базовый масштаб иконки).
  const bgRadius = size * 0.16;

  drawStatusCircle(ctx, center, bgRadius, COLORS.SUCCESS);

  ctx.beginPath();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = Math.max(2, size * 0.03);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.moveTo(center - size * 0.065, center + size * 0.005);
  ctx.lineTo(center - size * 0.02, center + size * 0.055);
  ctx.lineTo(center + size * 0.075, center - size * 0.05);
  ctx.stroke();
}

export function drawErrorIcon(ctx: CanvasRenderingContext2D, center: number, size: number): void {
  // Иконка error: круглый бейдж + крестик.
  // Параметры: ctx, center (центр), size (базовый масштаб иконки).
  const bgRadius = size * 0.16;

  drawStatusCircle(ctx, center, bgRadius, COLORS.ERROR);

  ctx.beginPath();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = Math.max(2, size * 0.03);
  ctx.lineCap = "round";

  ctx.moveTo(center - size * 0.055, center - size * 0.055);
  ctx.lineTo(center + size * 0.055, center + size * 0.055);

  ctx.moveTo(center + size * 0.055, center - size * 0.055);
  ctx.lineTo(center - size * 0.055, center + size * 0.055);

  ctx.stroke();
}

export function drawTextCenter(
  ctx: CanvasRenderingContext2D,
  center: number,
  progress: number,
): void {
  // Текстовый индикатор процента для режима in progress.
  // Параметры: ctx, center (центр), progress (число для отображения).
  ctx.fillStyle = COLORS.TEXT;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `600 ${Math.round(center * 2 * 0.14)}px Arial`;
  ctx.fillText(`${progress}%`, center, center);
}
