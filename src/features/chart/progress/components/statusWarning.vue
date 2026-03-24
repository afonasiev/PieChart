<script setup lang="ts">
import type { StatusProps } from "@/features/chart/progress/types";

// Входящие пропсы (StatusProps): position, color.
// Иконка warning: круг с восклицательным знаком.
defineProps<StatusProps>();
</script>

<template>
  <g :transform="`translate(${position}, ${position})`">
    <circle cx="0" cy="0" r="10" :fill="color" />
    <text
      y="5"
      font-family="Arial"
      font-weight="bold"
      font-size="16"
      fill="white"
      text-anchor="middle"
    >
      !
    </text>
  </g>
</template>
