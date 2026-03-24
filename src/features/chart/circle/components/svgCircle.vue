<script setup lang="ts">
defineProps<{ center: number; radius: number }>();
</script>

<template>
  <circle
    :cx="center"
    :cy="center"
    :r="radius"
    fill="transparent"
    stroke="#d1d5db"
    stroke-width="0.5"
  />
</template>

<style module lang="scss"></style>
