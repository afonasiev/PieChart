<script setup lang="ts">
import type { CircleProps } from "@/features/chart/progress/types";

// Входящие пропсы (CircleProps):
// circleSize, circleRadius, strokeWidth, dashArray, rotate, color.
// Базовый примитив дуги: используется как для трека, так и для активного прогресса.
defineProps<CircleProps>();
</script>

<template>
  <circle
    :cx="circleSize"
    :cy="circleSize"
    :r="circleRadius"
    fill="none"
    :stroke="color"
    stroke-linecap="round"
    :stroke-width="strokeWidth"
    :stroke-dasharray="dashArray"
    :transform="rotate"
    style="
      transition:
        stroke-dashoffset 0.3s linear,
        stroke 0.3s linear;
    "
  />
</template>
