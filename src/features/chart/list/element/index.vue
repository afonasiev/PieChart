<script setup lang="ts">
import type {
  chartListElementEmits,
  chartListElementPropsExtended,
} from "@/features/chart/list/element/types";
import buttonIcon from "@/shared/ui/button/icon/index.vue";
import animateNumber from "@/entities/animate/number/index.vue";

defineProps<{ data: chartListElementPropsExtended }>();
defineEmits<chartListElementEmits>();
</script>

<template>
  <li :class="$style.element">
    <div :class="$style.group">
      <div :class="$style.group_element">
        <p :class="$style.text">{{ data.name }}</p>
      </div>
      <div :class="$style.group_element">
        <p :class="$style.text">
          <animate-number :value="data.value" />
          (<animate-number :value="data.percent" />%)
        </p>
      </div>
      <div :class="$style.group_element">
        <i :class="$style.color" :style="{ backgroundColor: data.color }" />
      </div>
    </div>
    <div :class="$style.buttons">
      <button-icon icon="edit" @click="$emit('edit', 'update', data.id)" />
      <button-icon icon="remove" @click="$emit('remove', data.id)" />
    </div>
  </li>
</template>

<style module lang="scss">
.element {
  width: 100%;
  height: fit-content;
  min-height: 60px;
  background-color: #dbdfe933;
  border-radius: 10px;
  align-items: center;
  justify-content: space-between;
  display: flex;
  padding-inline: 20px;
  padding-block: 18px;
}
.group {
  display: flex;
  max-width: 75%;
  &_element {
    padding-inline: 25px;
    display: flex;
    align-items: center;
    position: relative;
    &:first-child {
      padding-left: 0;
      padding-right: 50px;
    }
    &:last-child {
      padding-right: 0;
    }
    &:not(:first-child):not(:last-child) {
      &::before {
        content: "";
        width: 2px;
        height: 16px;
        border-radius: 2px;
        background-color: #dbdfe9;
        display: block;
        position: absolute;
        left: -1px;
        top: 0;
        bottom: 0;
        margin: auto 0;
      }
      &::after {
        content: "";
        width: 2px;
        height: 16px;
        border-radius: 2px;
        background-color: #dbdfe9;
        display: block;
        position: absolute;
        right: -1px;
        top: 0;
        bottom: 0;
        margin: auto 0;
      }
    }
  }
}
.color {
  display: block;
  width: 20px;
  height: 20px;
  background-color: #fff;
  border-radius: 50%;
}
.text {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #252f4a;
}
.buttons {
  display: flex;
  align-items: center;
  gap: 20px;
}
</style>
