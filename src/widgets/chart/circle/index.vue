<script setup lang="ts">
import type { chartListElementProps } from "@/features/chart/list/element/types";
import PieChart from "@/features/chart/circle/index.vue";

const sectorsList = defineModel<chartListElementProps[]>({ default: [] });
</script>

<template>
  <section :class="$style.chart">
    <div :class="$style.group">
      <h3>ChartJs</h3>
      <pie-chart type="chartJs" :data="sectorsList" />
    </div>
    <div :class="$style.group">
      <h3>Custom SVG</h3>
      <pie-chart type="svg" :data="sectorsList" />
    </div>
    <div :class="$style.group">
      <h3>Custom Canvas</h3>
      <pie-chart type="canvas" :data="sectorsList" />
    </div>
  </section>
</template>

<style module lang="scss">
.chart {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.group {
  display: flex;
  flex-direction: column;
  gap: 16px;
  h3 {
    text-align: center;
    font-weight: 600;
  }
}
</style>
