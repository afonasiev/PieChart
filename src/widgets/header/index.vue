<script setup lang="ts">
import NavRoutes from "@/features/nav/index.vue";
</script>

<template>
  <header :class="$style.header">
    <nav-routes />
  </header>
</template>

<style module>
.header {
  padding: 1rem;
}
</style>
