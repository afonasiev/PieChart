<script setup lang="ts">
import type { chartListElementProps } from "@/features/chart/list/element/types";
import legendItem from "@/shared/chart/legend/element/index.vue";

defineProps<{ items: chartListElementProps[] }>();
</script>

<template>
  <ul :class="$style.list">
    <legend-item v-for="item in items" :key="item.id" :name="item.name" :color="item.color" />
  </ul>
</template>

<style module lang="scss">
.list {
  display: flex;
  align-items: center;
  list-style-type: none;
  padding: 0;
  justify-content: center;
  gap: 24px;
  margin-top: 20px;
  flex-wrap: wrap;
}
</style>
