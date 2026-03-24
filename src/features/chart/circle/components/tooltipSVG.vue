<script setup lang="ts">
import type {
  canvasSector,
  circleSector,
  tooltipPositionType,
} from "@/features/chart/circle/types";
import { computed } from "vue";

const props = defineProps<{
  data: circleSector | null | canvasSector;
  position: tooltipPositionType;
}>();
const color = computed(() => (props.data ? props.data.color : "rgba(0,0,0,0)"));
</script>

<template>
  <Transition name="tooltip-fade">
    <div
      v-if="data"
      :class="$style.tooltip"
      :style="{ left: `${position.x}px`, top: `${position.y}px` }"
    >
      <p :class="$style.title">{{ data.name }}</p>
      <span :class="$style.value">{{ data.value }} ({{ data.percent.toFixed(1) }}%)</span>
    </div>
  </Transition>
</template>

<style module lang="scss">
.tooltip {
  position: absolute;
  transform: translate(-50%, -100%);
  pointer-events: none;
  background: rgba(17, 24, 39, 0.92);
  color: #fff;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 12px;
  line-height: 1.35;
  white-space: nowrap;
  z-index: 2;
}
.title {
  font-weight: 600;
  margin: 0;
}
.value {
  opacity: 0.9;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  &::before {
    display: block;
    content: "";
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1px solid #fff;
    background-color: v-bind(color);
  }
}
:global(.tooltip-fade-enter-active),
:global(.tooltip-fade-leave-active) {
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}
:global(.tooltip-fade-enter-from),
:global(.tooltip-fade-leave-to) {
  opacity: 0;
  transform: translate(-50%, -92%);
}
</style>
