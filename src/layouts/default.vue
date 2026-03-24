<script setup lang="ts">
import AppHeader from "@/widgets/header/index.vue";
</script>
<template>
  <app-header />
  <main :class="$style.main">
    <router-view />
  </main>
  <footer></footer>
</template>

<style module>
.main {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
