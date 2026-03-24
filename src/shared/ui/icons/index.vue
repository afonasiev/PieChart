<script setup lang="ts">
import type { Props } from "@/shared/ui/icons/types";
import { computed, defineAsyncComponent } from "vue";

const { icon } = defineProps<Props>();

const dynamicComponent = computed(() => {
  const _icon = icon;
  return defineAsyncComponent(() => import(`@/shared/ui/icons/svg/${_icon}.vue`));
});
</script>

<template>
  <Suspense>
    <template #default>
      <component :is="dynamicComponent" />
    </template>
  </Suspense>
</template>
