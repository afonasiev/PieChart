<template>
  <ui-container :class="$style.container_group">
    <fieldset :class="$style.group">
      <legend :class="$style.group_heading">Прогресс</legend>
      <label :class="$style.label">
        <span :class="$style.label_heading">{{ progress }}</span>
        <input type="range" v-model.number="progress" min="0" max="100" step="1" />
      </label>
    </fieldset>
    <fieldset :class="$style.group">
      <legend :class="$style.group_heading">Размер</legend>
      <label :class="$style.label">
        <span :class="$style.label_heading">{{ size }}</span>
        <input type="range" v-model.number="size" min="80" max="140" step="20" />
      </label>
    </fieldset>
    <fieldset :class="$style.group">
      <legend :class="$style.group_heading">Толщина линий</legend>
      <label :class="$style.label">
        <span :class="$style.label_heading">{{ stroke }}</span>
        <input type="range" v-model.number="stroke" min="4" max="10" step="2" />
      </label>
    </fieldset>
    <fieldset :class="$style.group">
      <legend :class="$style.group_heading">Тип формы</legend>
      <label :class="$style.label">
        <span :class="$style.label_heading">Dashboard</span>
        <input type="radio" name="type" value="dashboard" v-model="chartTypeInput" />
      </label>
      <label :class="$style.label">
        <span :class="$style.label_heading">Circle</span>
        <input type="radio" name="type" value="circle" v-model="chartTypeInput" />
      </label>
    </fieldset>
    <fieldset :class="$style.group">
      <legend :class="$style.group_heading">Количество цветов прогресса(2 или 3)</legend>
      <label :class="$style.label">
        <span :class="$style.label_heading">{{ colorTrios }}</span>
        <input type="checkbox" v-model="colorTrios" />
      </label>
    </fieldset>
    <fieldset :class="$style.group">
      <legend :class="$style.group_heading">HSL цвет прогрессбара</legend>
      <label :class="$style.label">
        <span :class="$style.label_heading">{{ colorHSL }}</span>
        <input type="checkbox" v-model="colorHSL" />
      </label>
    </fieldset>
    <fieldset :class="$style.group">
      <legend :class="$style.group_heading">Svg or Canvas</legend>
      <label :class="$style.label">
        <span :class="$style.label_heading">{{ engine }}</span>
        <input type="checkbox" true-value="svg" false-value="canvas" v-model="engine" />
      </label>
    </fieldset>
    <fieldset :class="$style.group">
      <legend :class="$style.group_heading">Статус</legend>
      <label :class="$style.label">
        <span :class="$style.label_heading">In progress</span>
        <input type="radio" name="status" value="in progress" v-model="status" />
      </label>
      <label :class="$style.label">
        <span :class="$style.label_heading">Success</span>
        <input type="radio" name="status" value="success" v-model="status" />
      </label>
      <label :class="$style.label">
        <span :class="$style.label_heading">Warning</span>
        <input type="radio" name="status" value="warning" v-model="status" />
      </label>
      <label :class="$style.label">
        <span :class="$style.label_heading">Error</span>
        <input type="radio" name="status" value="error" v-model="status" />
      </label>
    </fieldset>
  </ui-container>
  <br />
  <ui-container>
    <h2>Управляемая вариация</h2>
    <pie-progress
      :status="status"
      :progress="progress"
      :additional-color="colorTrios"
      :type="chartTypeInput"
      :hsl="colorHSL"
      :size="size"
      :stroke-width="stroke"
      :engine="engine"
    />
  </ui-container>
  <ui-container>
    <h2>Canvas вариация</h2>
    <pie-progress
      status="in progress"
      :progress="progress"
      :additional-color="colorTrios"
      :type="chartTypeInput"
      :hsl="colorHSL"
      :size="size"
      :stroke-width="stroke"
      engine="canvas"
    />
    <pie-progress
      status="warning"
      :progress="progress"
      :additional-color="colorTrios"
      :type="chartTypeInput"
      :hsl="colorHSL"
      :size="size"
      :stroke-width="stroke"
      engine="canvas"
    />
    <pie-progress
      status="error"
      :progress="progress"
      :additional-color="colorTrios"
      :type="chartTypeInput"
      :hsl="colorHSL"
      :size="size"
      :stroke-width="stroke"
      engine="canvas"
    />
    <pie-progress
      status="success"
      :progress="progress"
      :additional-color="colorTrios"
      :type="chartTypeInput"
      :hsl="colorHSL"
      :size="size"
      :stroke-width="stroke"
      engine="canvas"
    />
  </ui-container>
  <br />
  <ui-container>
    <h2>SVG вариация</h2>
    <pie-progress
      status="in progress"
      :progress="progress"
      :additional-color="colorTrios"
      :type="chartTypeInput"
      :hsl="colorHSL"
      :size="size"
      :stroke-width="stroke"
      engine="svg"
    />
    <pie-progress
      status="warning"
      :progress="progress"
      :additional-color="colorTrios"
      :type="chartTypeInput"
      :hsl="colorHSL"
      :size="size"
      :stroke-width="stroke"
      engine="svg"
    />
    <pie-progress
      status="error"
      :progress="progress"
      :additional-color="colorTrios"
      :type="chartTypeInput"
      :hsl="colorHSL"
      :size="size"
      :stroke-width="stroke"
      engine="svg"
    />
    <pie-progress
      status="success"
      :progress="progress"
      :additional-color="colorTrios"
      :type="chartTypeInput"
      :hsl="colorHSL"
      :size="size"
      :stroke-width="stroke"
      engine="svg"
    />
  </ui-container>
  <!--  <br />-->
  <!--  <div :class="$style.container">-->
  <!--    <pie-progress :type="chartTypeInput" :additional-color="true" :progress="progress" />-->
  <!--    <pie-progress :type="chartTypeInput" :additional-color="true" :progress="25" />-->
  <!--    <pie-progress :type="chartTypeInput" :additional-color="true" :progress="50" />-->
  <!--    <pie-progress :type="chartTypeInput" :additional-color="true" :progress="75" />-->
  <!--    <pie-progress :type="chartTypeInput" :additional-color="true" :progress="100" />-->
  <!--  </div>-->
</template>

<script setup lang="ts">
import PieProgress from "@/features/chart/progress/index.vue";
import { ref } from "vue";
import type {
  chartType,
  engineType,
  statusType,
  strokeWidth,
  svgSize,
} from "@/features/chart/progress/types";
import UiContainer from "@/shared/ui/container/index.vue";

const progress = ref(0);
const chartTypeInput = ref<chartType>("circle");
const colorTrios = ref(false);
const colorHSL = ref(false);
const size = ref<svgSize>(120);
const stroke = ref<strokeWidth>(8);
const engine = ref<engineType>("svg");
const status = ref<statusType>("in progress");
</script>

<style module lang="scss">
.container_group {
}
.group {
  display: flex;
  gap: 1rem;
  justify-content: center;
  input {
    &[type="radio"] {
    }
    &[type="checkbox"] {
    }
    &[type="range"] {
      width: 150px;
    }
  }
}
.group_heading {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}
.label {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}
.label_heading {
  font-weight: bolder;
  font-size: 1rem;
  cursor: pointer;
}
</style>
