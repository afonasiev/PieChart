<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import legendList from "@/shared/chart/legend/list/index.vue";
import type { chartListElementProps } from "@/features/chart/list/element/types";
import type { circleSector, tooltipPositionType } from "@/features/chart/circle/types";
import TooltipSvg from "@/features/chart/circle/components/tooltipSVG.vue";
import {
  collectPositiveSectors,
  createTargetValueMap,
  DEFAULT_ANIMATION_DURATION,
  easeOutQuart,
  FULL_CIRCLE_ANGLE,
  MIN_ANIMATED_VALUE,
  START_ANGLE,
  syncRenderOrder,
} from "@/features/chart/circle/helpers/index.ts";

const props = defineProps<{ data: chartListElementProps[] }>();

const SIZE = 100;
const CENTER = SIZE / 2;
const RADIUS = 49;
const TOOLTIP_OFFSET = -5;

const wrapperRef = ref<HTMLDivElement | null>(null);
const hoveredSectorId = ref<number | null>(null);
const tooltipPosition = ref<tooltipPositionType>({ x: 0, y: 0 });
const animatedValues = ref<Map<number, number>>(new Map());
const sectorsMeta = ref<Map<number, chartListElementProps>>(new Map());
const sectorOrder = ref<number[]>([]);

let animationFrameId: number | null = null;

const sectorsList = computed(() => props.data);
// Набор реально отображаемых секторов собираем из:
// - map метаданных (name/color/id),
// - map анимированных значений,
// - порядка рендера (чтобы hovered сектор рисовался последним при необходимости).
const positiveSectors = computed(() =>
  collectPositiveSectors(sectorOrder.value, sectorsMeta.value, animatedValues.value),
);
const total = computed(() => positiveSectors.value.reduce((sum, item) => sum + item.value, 0));
const sectors = computed<circleSector[]>(() => {
  if (!positiveSectors.value.length || total.value <= 0) return [];
  if (positiveSectors.value.length === 1) {
    const singleSector = positiveSectors.value[0];
    if (!singleSector) return [];
    return [
      {
        ...singleSector,
        d: "",
        fullCircle: true,
        percent: 100,
      },
    ];
  }
  let currentAngle = START_ANGLE;
  return positiveSectors.value.map((item, index) => {
    const anglePart = (item.value / total.value) * FULL_CIRCLE_ANGLE;
    const nextAngle =
      index === positiveSectors.value.length - 1
        ? START_ANGLE + FULL_CIRCLE_ANGLE
        : currentAngle + anglePart;
    const percent = (item.value / total.value) * 100;

    const start = polarToCartesian(currentAngle);
    const end = polarToCartesian(nextAngle);
    const largeArcFlag = nextAngle - currentAngle > Math.PI ? 1 : 0;
    const d = [
      `M ${CENTER} ${CENTER}`,
      `L ${start.x} ${start.y}`,
      `A ${RADIUS} ${RADIUS} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
      "Z",
    ].join(" ");
    currentAngle = nextAngle;
    return {
      ...item,
      d,
      fullCircle: false,
      percent,
    };
  });
});
const hasData = computed(() => sectors.value.length > 0);
const hoveredSector = computed(
  () => sectors.value.find((item) => item.id === hoveredSectorId.value) ?? null,
);
const renderedSectors = computed(() => {
  const hoveredId = hoveredSectorId.value;
  if (hoveredId === null) return sectors.value;

  const hoveredIndex = sectors.value.findIndex((item) => item.id === hoveredId);
  if (hoveredIndex === -1) return sectors.value;

  const next = [...sectors.value];
  const [hoveredItem] = next.splice(hoveredIndex, 1);
  if (hoveredItem) {
    next.push(hoveredItem);
  }
  return next;
});

const stopAnimation = () => {
  if (animationFrameId === null) return;
  cancelAnimationFrame(animationFrameId);
  animationFrameId = null;
};

// Полный цикл tween-анимации между предыдущим и целевым состоянием.
// Используется при любом обновлении входных данных, чтобы секторные переходы
// были визуально плавными (включая появление/удаление секторов).
const startAnimation = (fromMap: Map<number, number>, toMap: Map<number, number>) => {
  stopAnimation();
  const fromIds = Array.from(fromMap.keys());
  const toIds = Array.from(toMap.keys());
  const allIds = Array.from(new Set([...fromIds, ...toIds]));
  if (!allIds.length) {
    animatedValues.value = new Map();
    sectorOrder.value = [];
    return;
  }

  sectorOrder.value = syncRenderOrder(toIds, fromIds);
  const startedAt = performance.now();

  const frame = (now: number) => {
    const progress = Math.min((now - startedAt) / DEFAULT_ANIMATION_DURATION, 1);
    const eased = easeOutQuart(progress);
    const nextValues = new Map<number, number>();

    allIds.forEach((id) => {
      const fromValue = fromMap.get(id) ?? 0;
      const toValue = toMap.get(id) ?? 0;
      const value = fromValue + (toValue - fromValue) * eased;
      if (value > MIN_ANIMATED_VALUE) {
        nextValues.set(id, value);
      }
    });

    animatedValues.value = nextValues;

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(frame);
      return;
    }

    animatedValues.value = new Map(
      Array.from(toMap.entries()).filter(([, value]) => value > MIN_ANIMATED_VALUE),
    );
    sectorOrder.value = toIds;
    animationFrameId = null;
  };

  animationFrameId = requestAnimationFrame(frame);
};
const polarToCartesian = (angle: number) => ({
  x: CENTER + RADIUS * Math.cos(angle),
  y: CENTER + RADIUS * Math.sin(angle),
});
const updateTooltipPosition = (event: MouseEvent) => {
  if (!wrapperRef.value) return;
  const wrapperRect = wrapperRef.value.getBoundingClientRect();
  tooltipPosition.value = {
    x: event.clientX - wrapperRect.left + TOOLTIP_OFFSET,
    y: event.clientY - wrapperRect.top + TOOLTIP_OFFSET,
  };
};
const onSectorEnter = (id: number | undefined, event: MouseEvent) => {
  if (id === undefined) return;
  hoveredSectorId.value = id;
  updateTooltipPosition(event);
};
const onSectorMove = (event: MouseEvent) => {
  updateTooltipPosition(event);
};
const onSectorLeave = () => {
  hoveredSectorId.value = null;
};

watch(
  sectorsList,
  (nextSectors) => {
    // Метаданные сохраняем отдельно: при анимации удаления они ещё нужны,
    // даже если исходный сектор уже пропал из props.data.
    nextSectors.forEach((item) => {
      sectorsMeta.value.set(item.id, item);
    });

    const fromMap = new Map(animatedValues.value);
    const toMap = createTargetValueMap(nextSectors);

    startAnimation(fromMap, toMap);
  },
  { immediate: true, deep: true },
);

onBeforeUnmount(() => {
  stopAnimation();
});
</script>

<template>
  <div ref="wrapperRef" :class="$style.wrapper">
    <svg
      :class="$style.chart"
      :viewBox="`0 0 ${SIZE} ${SIZE}`"
      role="img"
      aria-labelledby="chart-title chart-desc"
    >
      <title id="chart-title">Круговая диаграмма</title>
      <desc id="chart-desc">
        Круговая диаграмма, отображающая распределение данных между несколькими секторами.
      </desc>
      <template v-if="hasData">
        <g v-for="item in renderedSectors" :key="item.id">
          <circle
            v-if="item.fullCircle"
            :class="[$style.sector, { [$style.active]: hoveredSectorId === item.id }]"
            :cx="CENTER"
            :cy="CENTER"
            :r="RADIUS"
            :fill="item.color"
            stroke="#ffffff"
            stroke-width="0.5"
            @mouseenter="onSectorEnter(item.id, $event)"
            @mousemove="onSectorMove"
            @mouseleave="onSectorLeave"
            :aria-label="`${item.name}: ${item.percent.toFixed(1)}%`"
          />
          <path
            v-else
            :class="[$style.sector, { [$style.active]: hoveredSectorId === item.id }]"
            :d="item.d"
            :fill="item.color"
            stroke="#ffffff"
            stroke-width="0.5"
            stroke-linejoin="round"
            @mouseenter="onSectorEnter(item.id, $event)"
            @mousemove="onSectorMove"
            @mouseleave="onSectorLeave"
            :aria-label="`${item.name}: ${item.percent.toFixed(1)}%`"
          />
        </g>
      </template>
      <circle
        v-else
        :cx="CENTER"
        :cy="CENTER"
        :r="RADIUS"
        fill="transparent"
        stroke="#d1d5db"
        stroke-width="0.5"
        stroke-dasharray="2 2"
        aria-label="Пустой сектор"
      />
    </svg>
    <tooltip-svg :data="hoveredSector" :position="tooltipPosition" />
    <legend-list :items="sectorsList" />
  </div>
</template>

<style module lang="scss">
.wrapper {
  width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.chart {
  width: 100%;
  height: auto;
  display: block;
}

.sector {
  transition:
    filter 0.2s ease,
    stroke-width 0.2s ease;
  cursor: pointer;
}

.active {
  filter: brightness(0.85) saturate(1.08);
  stroke-width: 1;
}
</style>
