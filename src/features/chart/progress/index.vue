<script setup lang="ts">
import { type EngineProps, type Props } from "@/features/chart/progress/types";
import { computed } from "vue";
import {
  getColorStatus,
  getProgressAriaLabel,
  getProgressType,
  normalizedNumberProgress,
} from "@/features/chart/progress/helpers";
import CanvasEngine from "@/features/chart/progress/engines/canvasEngine.vue";
import SvgEngine from "@/features/chart/progress/engines/svgEngine.vue";

const props = withDefaults(defineProps<Props>(), {
  type: "circle",
  status: "in progress",
  size: 120,
  strokeWidth: 8,
  progress: 50,
  additionalColor: true,
  hsl: false,
  engine: "svg",
});

// Входящие пропсы компонента (Props):
// - type, status, size, strokeWidth, progress, additionalColor, hsl, engine.
// Ниже все вычисления строятся только на этих входных параметрах.

// Цвет выбирается либо из фиксированного статуса (success/error/warning),
// либо вычисляется как градиент в режиме in progress.
const colorStatus = computed(() =>
  getColorStatus(props.status, props.progress, props.additionalColor, props.hsl),
);
// Для фиксированных статусов прогресс принудительно выравнивается
// (warning=75, error=50, success=100), иначе берётся входное значение.
const progress = computed(() => getProgressType(props.status, props.progress));
// Любое значение приводим к безопасному диапазону [0..100].
const normalizedProgress = computed(() => normalizedNumberProgress(progress.value));
const viewBox = computed(() => `0 0 ${props.size} ${props.size}`);

// Геометрия круга/дашборда.
const circleDegree = computed(() => (props.type === "circle" ? 360 : 270));
const circleSize = computed(() => props.size / 2);
const circleRadius = computed(() => circleSize.value - props.strokeWidth / 2);
const circleRound = computed(() => 2 * Math.PI * circleRadius.value);
const circleArc = computed(() => circleRound.value * (circleDegree.value / 360));
const rotateDegree = computed(() => (props.type === "circle" ? -90 : 135));
const circleRotate = computed(
  () => `rotate(${rotateDegree.value} ${circleSize.value} ${circleSize.value})`,
);
// Длина закрашенного сегмента дуги пропорциональна прогрессу.
const progressLength = computed(() => circleArc.value * (normalizedProgress.value / 100));
const ariaLabel = computed(() => getProgressAriaLabel(props.status, props.progress));
const styleBody = computed(() => ({ width: `${props.size}px`, height: `${props.size}px` }));

// Унифицированный контракт пропсов для обоих движков отрисовки (svg/canvas).
// Выходной объект содержит: size, viewBox, ariaLabel, progress, circleSize,
// strokeWidth, circleRadius, circleRotate, circleArc, circleRound,
// colorStatus, progressLength, status, chartType.
const objectProps = computed<EngineProps>(() => ({
  size: props.size,
  viewBox: viewBox.value,
  ariaLabel: ariaLabel.value,
  progress: progress.value,
  circleSize: circleSize.value,
  strokeWidth: props.strokeWidth,
  circleRadius: circleRadius.value,
  circleRotate: circleRotate.value,
  circleArc: circleArc.value,
  circleRound: circleRound.value,
  colorStatus: colorStatus.value,
  progressLength: progressLength.value,
  status: props.status,
  chartType: props.type,
}));
</script>

<template>
  <div :class="$style.body" :style="styleBody">
    <template v-if="props.engine === 'svg'">
      <svg-engine v-bind="objectProps" />
    </template>
    <template v-else>
      <canvas-engine v-bind="objectProps" />
    </template>
  </div>
</template>

<style module>
.body {
  display: block;
}
</style>
