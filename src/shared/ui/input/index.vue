<script setup lang="ts">
import type { InputProps } from "@/shared/ui/input/types";
import { ColorPicker } from "vue3-colorpicker";
import "vue3-colorpicker/style.css";

const { label, type } = defineProps<InputProps>();
const model = defineModel<string | number>();
</script>

<template>
  <label :class="[$style.body, type === 'color' ? $style.body_color : '']">
    <template v-if="type === 'color'">
      <div :class="$style.color">
        <input :class="$style.input" type="text" placeholder=" " v-model="model" disabled />
        <span :class="$style.label">{{ label }}</span>
      </div>
      <ColorPicker
        is-widget
        format="hex"
        shape="circle"
        disable-alpha
        round-history
        use-type="pure"
        v-model:pureColor="model"
      />
    </template>
    <!--    <template v-else-if="type === 'number'">-->
    <!--      <input :class="$style.input" type="number" placeholder=" " v-model.number="model" />-->
    <!--      <span :class="$style.label">{{ label }}</span>-->
    <!--    </template>-->
    <template v-else>
      <input :class="$style.input" :type="type" placeholder=" " v-model="model" />
      <span :class="$style.label">{{ label }}</span>
    </template>
  </label>
</template>

<style module lang="scss">
.body {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  width: 100%;
  padding: 10px 20px;
  background: #ffffff;
  border: 1px solid #dbdfe9;
  border-radius: 10px;
  position: relative;
  &_color {
    flex-direction: column;
    height: auto;
    padding: 0 0 10px;
  }
}
.color {
  height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 10px 20px;
  &::after {
    content: "";
    width: 20px;
    height: 20px;
    background-color: v-bind(model);
    border-radius: 50%;
    transition: all 0.3s ease-in-out;
  }
}
.label {
  font-weight: 400;
  font-size: 16px;
  line-height: 16px;
  color: #252f4a;
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  transition: all 0.2s ease;
}
.input {
  width: 100%;
  height: 24px;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #252f4a;
  border: none;
  outline: none;
  &:disabled {
    background-color: transparent;
  }
  &[type="number"] {
    -moz-appearance: textfield;
    appearance: textfield;
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      appearance: none;
      margin: 0;
    }
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      appearance: none;
      margin: 0;
    }
  }
}
input:focus + .label,
.input:not(:placeholder-shown) + .label {
  top: 2px;
  transform: none;
  font-size: 12px;
  color: #99a1b7;
}
</style>
