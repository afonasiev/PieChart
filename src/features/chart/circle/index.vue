<script setup lang="ts">
import type { pieChartProps } from "@/features/chart/circle/types";
import engineChart from "@/features/chart/circle/engines/chartJs.vue";
import engineSvg from "@/features/chart/circle/engines/svgEngine.vue";
import engineCanvas from "@/features/chart/circle/engines/canvasEngine.vue";

defineProps<pieChartProps>();
</script>

<template>
  <template v-if="type === 'chartJs'">
    <engine-chart :data="data" />
  </template>
  <template v-else-if="type === 'svg'">
    <engine-svg :data="data" />
  </template>
  <template v-else>
    <engine-canvas :data="data" />
  </template>
</template>

<style module lang="scss"></style>
