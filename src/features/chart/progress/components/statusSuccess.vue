<script setup lang="ts">
import type { StatusProps } from "@/features/chart/progress/types";

// Входящие пропсы (StatusProps): position, color.
// Иконка success в центре: галочка относительно центра компонента.
defineProps<StatusProps>();
</script>

<template>
  <g :transform="`translate(${position}, ${position})`">
    <path
      d="M-8 0 L-2 6 L 8 -5"
      fill="none"
      :stroke="color"
      stroke-width="3.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </g>
</template>
