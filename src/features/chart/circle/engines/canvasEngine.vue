<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import legendList from "@/shared/chart/legend/list/index.vue";
import TooltipSvg from "@/features/chart/circle/components/tooltipSVG.vue";
import type { chartListElementProps } from "@/features/chart/list/element/types";
import type { canvasSector } from "@/features/chart/circle/types";
import {
  collectPositiveSectors,
  createTargetValueMap,
  DEFAULT_ANIMATION_DURATION,
  easeOutQuart,
  FULL_CIRCLE_ANGLE,
  MIN_ANIMATED_VALUE,
  START_ANGLE,
  syncRenderOrder,
} from "@/features/chart/circle/helpers";

const props = defineProps<{ data: chartListElementProps[] }>();

const TOOLTIP_OFFSET = -8;
const HOVER_OFFSET = 4;

const wrapperRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const hoveredSectorId = ref<number | null>(null);
const tooltipPosition = ref({ x: 0, y: 0 });
const animatedValues = ref<Map<number, number>>(new Map());
const sectorsMeta = ref<Map<number, chartListElementProps>>(new Map());
const sectorOrder = ref<number[]>([]);

let animationFrameId: number | null = null;
let resizeObserver: ResizeObserver | null = null;

const sectorsList = computed(() => props.data);
// Отображаемые секторы собираем из состояния анимации + метаданных.
// Такой подход сохраняет корректные подписи/цвета при fade-out удаляемых сегментов.
const positiveSectors = computed(() =>
  collectPositiveSectors(sectorOrder.value, sectorsMeta.value, animatedValues.value),
);
const total = computed(() => positiveSectors.value.reduce((sum, item) => sum + item.value, 0));
const sectors = computed<canvasSector[]>(() => {
  if (!positiveSectors.value.length || total.value <= 0) return [];
  if (positiveSectors.value.length === 1) {
    const singleSector = positiveSectors.value[0];
    if (!singleSector) return [];
    return [
      {
        ...singleSector,
        startAngle: START_ANGLE,
        endAngle: START_ANGLE + FULL_CIRCLE_ANGLE,
        percent: 100,
        fullCircle: true,
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
    const nextSector: canvasSector = {
      ...item,
      startAngle: currentAngle,
      endAngle: nextAngle,
      percent,
      fullCircle: false,
    };
    currentAngle = nextAngle;
    return nextSector;
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

const normalizeAngle = (angle: number) => {
  const normalized = angle % FULL_CIRCLE_ANGLE;
  return normalized < 0 ? normalized + FULL_CIRCLE_ANGLE : normalized;
};
const stopAnimation = () => {
  if (animationFrameId === null) return;
  cancelAnimationFrame(animationFrameId);
  animationFrameId = null;
};
const getChartGeometry = () => {
  if (!canvasRef.value) return null;
  const canvas = canvasRef.value;
  const rect = canvas.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return null;
  const size = Math.min(rect.width, rect.height);
  const offsetX = (rect.width - size) / 2;
  const offsetY = (rect.height - size) / 2;
  return {
    width: rect.width,
    height: rect.height,
    centerX: offsetX + size / 2,
    centerY: offsetY + size / 2,
    radius: Math.max(size / 2 - 1, 0),
  };
};
const resizeCanvasForDpr = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  if (!canvasRef.value) return;
  const dpr = window.devicePixelRatio || 1;
  const nextWidth = Math.round(width * dpr);
  const nextHeight = Math.round(height * dpr);

  if (canvasRef.value.width !== nextWidth || canvasRef.value.height !== nextHeight) {
    canvasRef.value.width = nextWidth;
    canvasRef.value.height = nextHeight;
  }

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
};
const isAngleWithinSector = (angle: number, startAngle: number, endAngle: number) => {
  if (Math.abs(endAngle - startAngle) >= FULL_CIRCLE_ANGLE - Number.EPSILON) return true;
  const normalizedAngle = normalizeAngle(angle);
  const normalizedStart = normalizeAngle(startAngle);
  const normalizedEnd = normalizeAngle(endAngle);

  if (normalizedStart <= normalizedEnd) {
    return normalizedAngle >= normalizedStart && normalizedAngle <= normalizedEnd;
  }
  return normalizedAngle >= normalizedStart || normalizedAngle <= normalizedEnd;
};
const drawSector = (
  ctx: CanvasRenderingContext2D,
  sector: canvasSector,
  centerX: number,
  centerY: number,
  radius: number,
  isHovered: boolean,
) => {
  const midAngle = (sector.startAngle + sector.endAngle) / 2;
  const shiftX = isHovered ? Math.cos(midAngle) * HOVER_OFFSET : 0;
  const shiftY = isHovered ? Math.sin(midAngle) * HOVER_OFFSET : 0;
  const currentCenterX = centerX + shiftX;
  const currentCenterY = centerY + shiftY;

  ctx.beginPath();
  if (sector.fullCircle) {
    ctx.arc(currentCenterX, currentCenterY, radius, 0, FULL_CIRCLE_ANGLE);
  } else {
    ctx.moveTo(currentCenterX, currentCenterY);
    ctx.arc(currentCenterX, currentCenterY, radius, sector.startAngle, sector.endAngle, false);
    ctx.closePath();
  }
  if (isHovered) {
    ctx.filter = "brightness(0.85) saturate(1.08)";
  }
  ctx.fillStyle = sector.color;
  ctx.fill();
  ctx.filter = "none";
  ctx.lineWidth = isHovered ? 1.1 : 0.7;
  ctx.strokeStyle = "#ffffff";
  ctx.lineJoin = "round";
  ctx.stroke();
};
const drawEmptyState = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
) => {
  ctx.beginPath();
  ctx.setLineDash([5, 4]);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#d1d5db";
  ctx.arc(centerX, centerY, radius, 0, FULL_CIRCLE_ANGLE);
  ctx.stroke();
  ctx.setLineDash([]);
};
const drawChart = () => {
  if (!canvasRef.value) return;
  const ctx = canvasRef.value.getContext("2d");
  if (!ctx) return;
  const geometry = getChartGeometry();
  if (!geometry) return;
  resizeCanvasForDpr(ctx, geometry.width, geometry.height);
  ctx.clearRect(0, 0, geometry.width, geometry.height);
  if (!hasData.value) {
    drawEmptyState(ctx, geometry.centerX, geometry.centerY, geometry.radius);
    return;
  }
  renderedSectors.value.forEach((sector) => {
    drawSector(
      ctx,
      sector,
      geometry.centerX,
      geometry.centerY,
      geometry.radius,
      hoveredSectorId.value === sector.id,
    );
  });
};
const getSectorByCursor = (event: MouseEvent) => {
  const geometry = getChartGeometry();
  if (!geometry || !canvasRef.value) return null;
  const canvasRect = canvasRef.value.getBoundingClientRect();
  const x = event.clientX - canvasRect.left;
  const y = event.clientY - canvasRect.top;
  const dx = x - geometry.centerX;
  const dy = y - geometry.centerY;
  const distance = Math.sqrt(dx ** 2 + dy ** 2);

  if (distance > geometry.radius) return null;

  const angle = Math.atan2(dy, dx);
  return (
    sectors.value.find((sector) =>
      isAngleWithinSector(angle, sector.startAngle, sector.endAngle),
    ) ?? null
  );
};
const updateTooltipPosition = (event: MouseEvent) => {
  if (!wrapperRef.value) return;
  const wrapperRect = wrapperRef.value.getBoundingClientRect();
  tooltipPosition.value = {
    x: event.clientX - wrapperRect.left + TOOLTIP_OFFSET,
    y: event.clientY - wrapperRect.top + TOOLTIP_OFFSET,
  };
};
const startAnimation = (fromMap: Map<number, number>, toMap: Map<number, number>) => {
  stopAnimation();
  const fromIds = Array.from(fromMap.keys());
  const toIds = Array.from(toMap.keys());
  const allIds = Array.from(new Set([...fromIds, ...toIds]));
  if (!allIds.length) {
    animatedValues.value = new Map();
    sectorOrder.value = [];
    drawChart();
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
    drawChart();
    if (progress < 1) {
      animationFrameId = requestAnimationFrame(frame);
      return;
    }
    animatedValues.value = new Map(
      Array.from(toMap.entries()).filter(([, value]) => value > MIN_ANIMATED_VALUE),
    );
    sectorOrder.value = toIds;
    animationFrameId = null;
    drawChart();
  };
  animationFrameId = requestAnimationFrame(frame);
};
const onCanvasMove = (event: MouseEvent) => {
  updateTooltipPosition(event);
  const hovered = getSectorByCursor(event);
  hoveredSectorId.value = hovered?.id ?? null;
  drawChart();
};
const onCanvasLeave = () => {
  hoveredSectorId.value = null;
  drawChart();
};

watch(
  sectorsList,
  (nextSectors) => {
    // Метаданные держим отдельно, чтобы при анимации удаления
    // не терять title/color для сегментов до завершения tween.
    nextSectors.forEach((item) => {
      sectorsMeta.value.set(item.id, item);
    });

    const fromMap = new Map(animatedValues.value);
    const toMap = createTargetValueMap(nextSectors);
    startAnimation(fromMap, toMap);
  },
  { immediate: true, deep: true },
);

watch(hoveredSectorId, () => {
  drawChart();
});

onMounted(() => {
  if (wrapperRef.value) {
    resizeObserver = new ResizeObserver(() => {
      drawChart();
    });
    resizeObserver.observe(wrapperRef.value);
  }
  drawChart();
});

onBeforeUnmount(() => {
  stopAnimation();
  resizeObserver?.disconnect();
  resizeObserver = null;
});
</script>

<template>
  <div ref="wrapperRef" :class="$style.wrapper">
    <div :class="$style.container">
      <canvas
        ref="canvasRef"
        :class="$style.chart"
        role="img"
        aria-label="Круговая диаграмма на canvas"
        @mousemove="onCanvasMove"
        @mouseleave="onCanvasLeave"
      />
      <tooltip-svg :data="hoveredSector" :position="tooltipPosition" />
    </div>

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

.container {
  position: relative;
  width: 100%;
}

.chart {
  width: 100%;
  aspect-ratio: 1;
  display: block;
  cursor: pointer;
}
</style>
