<script setup lang="ts">
import UiContainer from "@/shared/ui/container/index.vue";
import ChartPanel from "@/widgets/chart/panel/index.vue";
import ChartCircles from "@/widgets/chart/circle/index.vue";
import { ref } from "vue";
import type { chartListElementProps } from "@/features/chart/list/element/types";

const sectorsList = ref<chartListElementProps[]>([
  {
    id: 0,
    name: "Сектор 1",
    value: 10,
    color: "#fcc02e",
  },
  {
    id: 1,
    name: "Сектор 2",
    value: 20,
    color: "#d81b43",
  },
  {
    id: 2,
    name: "Сектор 3",
    value: 30,
    color: "#8e24aa",
  },
  {
    id: 3,
    name: "Сектор 4",
    value: 40,
    color: "#1f87e8",
  },
  {
    id: 4,
    name: "Сектор 5",
    value: 15,
    color: "#05a045",
  },
]);
</script>
<template>
  <ui-container>
    <h1>Круговая диаграмма</h1>
    <div :class="$style.container">
      <chart-panel v-model="sectorsList" :class="$style.panel" />
      <chart-circles v-model="sectorsList" :class="$style.charts" />
    </div>
  </ui-container>
</template>
<style lang="scss" module>
.container {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: flex-start;
  width: 100%;
  height: auto;
}
.panel {
  flex-basis: 45%;
}
.charts {
  flex-basis: 45%;
}
</style>
