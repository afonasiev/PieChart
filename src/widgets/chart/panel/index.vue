<script setup lang="ts">
import { computed, ref, watch } from "vue";
import UiModal from "@/features/chart/modal/index.vue";
import UiButton from "@/shared/ui/button/index.vue";
import ListElement from "@/features/chart/list/element/index.vue";
import type { chartModalType } from "@/features/chart/modal/types";
import type {
  chartListElementProps,
  chartListElementPropsExtended,
} from "@/features/chart/list/element/types";

const sectorsList = defineModel<chartListElementProps[]>({ default: [] });

const isOpen = ref(false);
const typeModal = ref<chartModalType>("create");
const sectorEdit = ref<chartListElementProps | null>(null);

// Готовим данные для list-элементов: считаем процент каждого сектора
// относительно общей суммы. При нулевой сумме возвращаем 0%.
const formattedSectors = computed(() => {
  const list = sectorsList.value;
  const total = list.reduce((sum, s) => sum + s.value, 0);
  return list.map((sector) => {
    const calculatedPercent = total > 0 ? (sector.value / total) * 100 : 0;
    return {
      ...sector,
      percent: Number(calculatedPercent.toFixed(1)),
    } as chartListElementPropsExtended;
  });
});

const removeElement = (id: number) => {
  sectorsList.value = sectorsList.value.filter((item) => item.id !== id);
};
const openModal = (type: chartModalType, id?: number) => {
  if (type === "update") {
    sectorEdit.value = sectorsList.value.find((item) => item.id === id) ?? null;
  }
  isOpen.value = true;
  typeModal.value = type;
};
const eventCreateElement = (el: chartListElementProps) => {
  // Новый id формируем как max + 1: устойчиво даже если список был отсортирован/изменён.
  const maxId = sectorsList.value.reduce((max, item) => Math.max(max, item.id), -1);
  const newId = maxId + 1;

  sectorsList.value.push({
    id: newId,
    name: el.name,
    value: el.value,
    color: el.color,
  });
  isOpen.value = false;
};
const eventUpdateElement = (newData: chartListElementProps) => {
  const id = newData.id;
  const index = sectorsList.value.findIndex((item) => item.id === id);
  const oldData = sectorsList.value[index];
  if (index === -1 || !oldData) return;

  const isChanged =
    newData.name !== oldData.name ||
    newData.value !== oldData.value ||
    newData.color !== oldData.color;

  if (isChanged) sectorsList.value[index] = { ...oldData, ...newData };
  isOpen.value = false;
};

watch(
  () => isOpen.value,
  (open) => {
    if (!open && sectorEdit.value) {
      sectorEdit.value = null;
    }
  },
);
</script>

<template>
  <section :class="$style.sectors">
    <TransitionGroup
      tag="ul"
      :class="$style.list"
      :enter-active-class="$style.enterActive"
      :enter-from-class="$style.enterFrom"
      :leave-active-class="$style.leaveActive"
      :leave-to-class="$style.leaveTo"
      :move-class="$style.move"
    >
      <list-element
        v-for="sector in formattedSectors"
        :key="sector.id"
        :data="sector"
        @edit="openModal"
        @remove="removeElement"
      />
    </TransitionGroup>
    <ui-button @click="openModal('create')">Добавить сектор</ui-button>
    <ui-modal
      v-model="isOpen"
      :type="typeModal"
      :data="sectorEdit"
      @create="eventCreateElement"
      @update="eventUpdateElement"
    />
  </section>
</template>

<style module lang="scss">
.sectors {
  display: flex;
  flex-direction: column;
  gap: 30px;
}
.list {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 8px;
  padding: 0;
  list-style-type: none;
  position: relative;
}
.enterActive,
.leaveActive {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
.move {
  transition: transform 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}
.enterFrom,
.leaveTo {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}
.leaveActive {
}
</style>
