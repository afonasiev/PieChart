<script setup lang="ts">
import { COLORS, type EngineProps } from "@/features/chart/progress/types";
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import {
  drawErrorIcon,
  drawSuccessIcon,
  drawTextCenter,
  drawWarningIcon,
  getArcConfig,
  normalizedNumberProgress,
} from "@/features/chart/progress/helpers";

// Входящие пропсы (EngineProps):
// size, viewBox, ariaLabel, progress, circleSize, strokeWidth,
// circleRadius, circleRotate, circleArc, circleRound,
// colorStatus, progressLength, status, chartType.
const props = defineProps<EngineProps>();

// Ссылки на canvas и контекст храним отдельно,
// чтобы переиспользовать их в watch/animation цикле.
const canvasRef = ref<HTMLCanvasElement | null>(null);
const ctxRef = ref<CanvasRenderingContext2D | null>(null);
const dprRef = ref(1);
let animationFrameId: number | null = null;

// Прогресс всегда нормализован, чтобы отрисовка не выходила за дугу.
const animatedProgress = computed(() => normalizedNumberProgress(props.progress));
// Конфиг дуги зависит от режима circle/dashboard.
const arcConfig = computed(() => getArcConfig(props.chartType));
// Геометрические параметры, от которых строится вся отрисовка.
const geometry = computed(() => ({
  center: props.circleSize,
  safeRadius: props.circleRadius,
}));

function initCanvas(): void {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctxRef.value = ctx;
  dprRef.value = window.devicePixelRatio || 1;

  resizeCanvas();
}
function resizeCanvas(): void {
  const canvas = canvasRef.value;
  const ctx = ctxRef.value;
  if (!canvas || !ctx) return;

  const dpr = dprRef.value;

  canvas.width = props.size * dpr;
  canvas.height = props.size * dpr;
  canvas.style.width = `${props.size}px`;
  canvas.style.height = `${props.size}px`;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
}
function draw(progress: number): void {
  // Единая точка перерисовки: трек, прогресс, центральный контент.
  const ctx = ctxRef.value;
  if (!ctx) return;

  const { center, safeRadius } = geometry.value;
  const { startAngle, totalAngle } = arcConfig.value;

  ctx.clearRect(0, 0, props.size, props.size);

  drawTrack(ctx, center, safeRadius, startAngle, totalAngle);
  drawProgressArc(ctx, center, safeRadius, progress, startAngle, totalAngle);
  drawCenterContent(ctx, center);
}
function drawTrack(
  ctx: CanvasRenderingContext2D,
  center: number,
  radius: number,
  startAngle: number,
  totalAngle: number,
): void {
  // Параметры:
  // ctx — 2D-контекст canvas,
  // center/radius — геометрия окружности,
  // startAngle/totalAngle — диапазон дуги трека.
  ctx.beginPath();
  ctx.strokeStyle = COLORS.BACKGROUND;
  ctx.lineWidth = props.strokeWidth;
  // ctx.lineCap = "round" | "butt";
  ctx.lineCap = "round";
  ctx.arc(center, center, radius, startAngle, startAngle + totalAngle, false);
  ctx.stroke();
}

function drawProgressArc(
  ctx: CanvasRenderingContext2D,
  center: number,
  radius: number,
  progress: number,
  startAngle: number,
  totalAngle: number,
): void {
  // Параметры аналогичны drawTrack + progress (0..100).
  if (progress <= 0) return;

  const endAngle = startAngle + totalAngle * (progress / 100);

  ctx.beginPath();
  ctx.strokeStyle = props.colorStatus;
  ctx.lineWidth = props.strokeWidth;
  ctx.lineCap = props.circleRound ? "round" : "butt";
  ctx.arc(center, center, radius, startAngle, endAngle, false);
  ctx.stroke();
}

function drawCenterContent(ctx: CanvasRenderingContext2D, center: number): void {
  // Логика отображения в центре синхронизирована со статусами SVG-движка.
  if (props.status === "in progress") {
    drawTextCenter(ctx, center, animatedProgress.value);
  } else if (props.status === "success") {
    drawSuccessIcon(ctx, center, center);
  } else if (props.status === "warning") {
    drawWarningIcon(ctx, center, center);
  } else {
    drawErrorIcon(ctx, center, center);
  }
}

function animateTo(newValue: number, oldValue: number, duration = 300): void {
  // Плавная анимация смены прогресса с easing-функцией.
  // Параметры: newValue/oldValue — значения прогресса,
  // duration — длительность анимации в миллисекундах.
  const target = normalizedNumberProgress(newValue);
  const start = oldValue;
  const delta = target - start;

  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }

  if (delta === 0) {
    draw(target);
    return;
  }

  const startTime = performance.now();

  const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

  const frame = (now: number): void => {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(t);
    const next = start + delta * eased;

    draw(next);

    if (t < 1) {
      animationFrameId = requestAnimationFrame(frame);
    } else {
      animationFrameId = null;
      draw(target);
    }
  };

  animationFrameId = requestAnimationFrame(frame);
}

watch(
  () => props.size,
  async () => {
    // При изменении размера пересоздаём pixel buffer и перерисовываем.
    await nextTick();
    resizeCanvas();
    draw(animatedProgress.value);
  },
);

watch(
  () => props.progress,
  (newValue, oldValue) => {
    // Анимируем только изменение численного значения прогресса.
    animateTo(newValue, oldValue);
  },
);

watch(
  () => [props.strokeWidth, props.colorStatus, props.status, props.chartType],
  () => {
    // Для нечисловых изменений достаточно мгновенной перерисовки.
    draw(animatedProgress.value);
  },
);

onMounted(() => {
  initCanvas();
  draw(animatedProgress.value);
});

onBeforeUnmount(() => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
});
</script>

<template>
  <canvas
    ref="canvasRef"
    role="progressbar"
    :aria-valuenow="progress"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-label="ariaLabel"
  />
</template>
