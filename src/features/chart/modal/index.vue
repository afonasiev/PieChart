<script setup lang="ts">
import { computed, ref, watch } from "vue";
import UiModal from "@/shared/ui/modal/index.vue";
import UiInput from "@/shared/ui/input/index.vue";
import UiButton from "@/shared/ui/button/index.vue";
import type { chartModalEmits, chartModalProps } from "@/features/chart/modal/types";
import type { chartListElementProps } from "@/features/chart/list/element/types";

const { type, data } = defineProps<chartModalProps>();
const model = defineModel<boolean>({ default: false });
const emits = defineEmits<chartModalEmits>();

const id = ref<number>(0);
const name = ref<string>();
const color = ref<string>();
const number = ref<number>();

const text = computed(() => (type === "create" ? "Добавить сектор" : "Сохранить сектор"));
const title = computed(() => (type === "create" ? "Добавление сектора" : "Редактирование сектора"));
const disabledButton = computed(() => name.value && number.value && color.value);

const clearData = () => {
  id.value = 0;
  color.value = undefined;
  number.value = undefined;
  name.value = undefined;
};
const submitForm = () => {
  if (name.value && number.value && color.value) {
    const formData: chartListElementProps = {
      id: id.value,
      name: name.value,
      value: number.value,
      color: color.value,
    };
    if (type === "create") {
      emits("create", formData);
      clearData();
    } else {
      emits("update", formData);
      clearData();
    }
  }
};

watch(
  () => model.value,
  (isOpen) => {
    if (isOpen && type === "update" && data) {
      id.value = data.id;
      name.value = data.name;
      number.value = data.value;
      color.value = data.color;
    }
    if (!isOpen) {
      clearData();
    }
  },
);
</script>

<template>
  <ui-modal :title="title" v-model="model">
    <form :class="$style.form">
      <ui-input label="Наименование" type="text" v-model="name" />
      <ui-input label="Значение" type="number" v-model="number" />
      <ui-input label="Цвет" type="color" v-model="color" />
      <ui-button @click.prevent="submitForm" :disabled="!disabledButton">{{ text }}</ui-button>
    </form>
  </ui-modal>
</template>

<style module lang="scss">
.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
