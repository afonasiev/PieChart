<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

const props = defineProps<{
  value: number;
  duration?: number;
}>();

const displayNumber = ref(0);

const animate = (newValue: number) => {
  const start = displayNumber.value;
  const end = newValue;
  const duration = props.duration || 500; // мс
  const startTime = performance.now();
  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOutQuad = (t: number) => t * (2 - t);
    displayNumber.value = start + (end - start) * easeOutQuad(progress);
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      displayNumber.value = end;
    }
  };
  requestAnimationFrame(step);
};

watch(
  () => props.value,
  (newVal) => {
    animate(newVal);
  },
);

onMounted(() => animate(props.value));
</script>

<template>
  <span>{{ displayNumber.toFixed(1) }}</span>
</template>
