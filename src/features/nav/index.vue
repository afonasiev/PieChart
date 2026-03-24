<script setup lang="ts">
interface NavRoute {
  path: string;
  name: string;
}
const routes: NavRoute[] = [
  {
    path: "/",
    name: "PieProgress",
  },
  {
    path: "/circle",
    name: "PieChart",
  },
];
</script>

<template>
  <nav :class="$style.nav">
    <RouterLink
      v-for="(route, index) in routes"
      :key="index"
      :to="route.path"
      :class="$style.link"
      :active-class="$style.active"
    >
      {{ route.name }}
    </RouterLink>
  </nav>
</template>

<style module>
.nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: fit-content;
}
.link {
}
.active {
  background-color: hsla(160, 100%, 37%, 0.2);
}
</style>
