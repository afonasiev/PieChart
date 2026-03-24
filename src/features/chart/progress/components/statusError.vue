<script setup lang="ts">
import type { StatusProps } from "@/features/chart/progress/types";

// Входящие пропсы (StatusProps): position, color.
// Иконка error: крестик относительно центра.
defineProps<StatusProps>();
</script>

<template>
  <g :transform="`translate(${position}, ${position})`">
    <path
      d="M-6 -6 L6 6 M6 -6 L-6 6"
      fill="none"
      :stroke="color"
      stroke-width="2"
      stroke-linecap="round"
    />
  </g>
</template>
