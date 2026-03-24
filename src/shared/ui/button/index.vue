<script setup lang="ts"></script>

<template>
  <button :class="$style.button"><slot /></button>
</template>

<style module>
.button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0;
  margin: 0;
  height: 60px;
  min-height: 60px;
  border: none;
  background: var(--button-color);
  border-radius: 10px;
  font-weight: 400;
  font-size: 16px;
  line-height: 1;
  color: #ffffff;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
