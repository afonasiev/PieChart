<script setup lang="ts">
import { COLORS, type EngineProps } from "@/features/chart/progress/types";
import StatusSuccess from "@/features/chart/progress/components/statusSuccess.vue";
import InnerCircle from "@/features/chart/progress/components/innerCircle.vue";
import InnerText from "@/features/chart/progress/components/innerText.vue";
import StatusWarning from "@/features/chart/progress/components/statusWarning.vue";
import StatusError from "@/features/chart/progress/components/statusError.vue";

// Входящие пропсы (EngineProps):
// size, viewBox, ariaLabel, progress, circleSize, strokeWidth,
// circleRadius, circleRotate, circleArc, circleRound,
// colorStatus, progressLength, status, chartType.
// SVG-движок получает уже рассчитанную геометрию и только рендерит её.
defineProps<EngineProps>();
</script>

<template>
  <svg
    :width="size"
    :height="size"
    :viewBox="viewBox"
    role="progressbar"
    :aria-valuenow="progress"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-label="ariaLabel"
  >
    <!-- Фоновая дуга (всегда 100% доступного сегмента) -->
    <inner-circle
      :circle-size="circleSize"
      :circle-radius="circleRadius"
      :stroke-width="strokeWidth"
      :rotate="circleRotate"
      :color="COLORS.BACKGROUND"
      :dash-array="`${circleArc} ${circleRound}`"
    />
    <!-- Активная дуга прогресса (длина зависит от progressLength) -->
    <inner-circle
      :circle-size="circleSize"
      :circle-radius="circleRadius"
      :stroke-width="strokeWidth"
      :rotate="circleRotate"
      :color="colorStatus"
      :dash-array="`${progressLength} ${circleRound}`"
    />

    <!-- Центральный контент: либо число, либо иконка статуса -->
    <Transition name="status-fade" mode="out-in">
      <g :key="status">
        <!-- in-progress -->
        <template v-if="status === 'in progress'">
          <inner-text :progress="progress" :color="COLORS.TEXT" />
        </template>
        <!-- success -->
        <template v-else-if="status === 'success'">
          <status-success :position="circleSize" :color="COLORS.SUCCESS" />
        </template>
        <!-- warning -->
        <template v-else-if="status === 'warning'">
          <status-warning :position="circleSize" :color="COLORS.WARNING" />
        </template>
        <!-- error -->
        <template v-else-if="status === 'error'">
          <status-error :position="circleSize" :color="COLORS.ERROR" />
        </template>
      </g>
    </Transition>
  </svg>
</template>

<style scoped>
/* Status icon transition */
.status-fade-enter-active,
.status-fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.status-fade-enter-from,
.status-fade-leave-to {
  opacity: 0;
  transform: scale(0.7);
}
</style>
