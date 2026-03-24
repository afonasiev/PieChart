<script setup lang="ts">
import type { TextProps } from "@/features/chart/progress/types";

// Входящие пропсы (TextProps): progress, color.
// Текст в центре круга для статуса "in progress".
defineProps<TextProps>();
</script>

<template>
  <text
    x="50%"
    y="50%"
    text-anchor="middle"
    dominant-baseline="middle"
    font-size="16"
    font-weight="600"
    font-family="arial"
    :stroke="color"
  >
    {{ progress }}%
  </text>
</template>
