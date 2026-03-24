<script setup lang="ts">
import { computed } from "vue";
import { Pie } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import type { ChartOptions, TooltipItem } from "chart.js";
import type { chartListElementProps } from "@/features/chart/list/element/types";
import legendList from "@/shared/chart/legend/list/index.vue";

ChartJS.register(ArcElement, Tooltip);

const props = defineProps<{ data: chartListElementProps[] }>();

const sectorsList = computed(() => props.data);
const chartData = computed(() => ({
  labels: sectorsList.value.map((i) => i.name),
  datasets: [
    {
      data: sectorsList.value.map((i) => i.value),
      backgroundColor: sectorsList.value.map((i) => i.color),
      borderColor: "#ffffff",
      borderWidth: 4,
      hoverOffset: 8,
    },
  ],
}));

const chartOptions: ChartOptions<"pie"> = {
  responsive: true,
  animation: {
    animateRotate: true,
    duration: 1200,
    easing: "easeOutQuart",
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (ctx: TooltipItem<"pie">) => {
          const dataset = ctx.dataset.data as number[];
          const total = dataset.reduce((a, b) => a + b, 0);
          const value = ctx.raw as number;
          const percent = ((value / total) * 100).toFixed(1);
          return `${ctx.label}: ${value} (${percent}%)`;
        },
      },
    },
  },
};
</script>

<template>
  <div :class="$style.wrapper">
    <Pie :data="chartData" :options="chartOptions" />
    <legend-list :items="sectorsList" />
  </div>
</template>
<style lang="scss" module>
.wrapper {
  width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
