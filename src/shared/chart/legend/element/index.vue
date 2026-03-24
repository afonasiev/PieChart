<script setup lang="ts">
defineProps<{ name: string; color: string }>();
</script>

<template>
  <li :class="$style.element">
    {{ name }}
  </li>
</template>

<style module lang="scss">
.element {
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #555;
  cursor: pointer;
  transition: opacity 0.2s ease;
  &:hover {
    opacity: 0.7;
  }
  &::before {
    content: "";
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
    background-color: v-bind(color);
  }
}
</style>
