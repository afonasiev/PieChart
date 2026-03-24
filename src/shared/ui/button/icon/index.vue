<script setup lang="ts">
import type { Props } from "@/shared/ui/icons/types";

import IconComponent from "@/shared/ui/icons/index.vue";
const { icon } = defineProps<Props>();
</script>

<template>
  <button :class="$style.button">
    <icon-component :icon="icon" />
  </button>
</template>

<style module lang="scss">
.button {
  width: 24px;
  height: 24px;
  border: none;
  padding: 0;
  margin: 0;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease-in;
  will-change: transform;
  &:hover {
    transform: scale(1.2);
  }
  svg {
    max-width: 20px;
    max-height: 20px;
  }
}
</style>
