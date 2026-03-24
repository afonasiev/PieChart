import type { chartListElementProps } from "@/features/chart/list/element/types";

// Общие константы геометрии/анимации для кастомных движков круговой диаграммы.
export const START_ANGLE = -Math.PI / 2;
export const FULL_CIRCLE_ANGLE = Math.PI * 2;
export const MIN_ANIMATED_VALUE = 0.0001;
export const DEFAULT_ANIMATION_DURATION = 1200;

// Единая easing-функция для согласованной анимации в SVG и Canvas версиях.
export const easeOutQuart = (value: number) => 1 - (1 - value) ** 4;

// Формируем порядок рендера: сначала актуальные id, затем исчезающие.
// Это позволяет анимировать удаление элементов без «скачков».
export const syncRenderOrder = (targetIds: number[], sourceIds: number[]): number[] => {
  const uniqueTargetIds = [...new Set(targetIds)];
  const disappearingIds = sourceIds.filter((id) => !uniqueTargetIds.includes(id));
  return [...uniqueTargetIds, ...disappearingIds];
};

// Формируем карту целевых значений анимации только для положительных секторов.
export const createTargetValueMap = (sectors: chartListElementProps[]): Map<number, number> => {
  const toMap = new Map<number, number>();

  sectors.forEach((item) => {
    if (item.value > 0) {
      toMap.set(item.id, item.value);
    }
  });

  return toMap;
};

// Преобразуем map + порядок в «плоский» массив только положительных отображаемых секторов.
export const collectPositiveSectors = (
  orderedIds: number[],
  metaMap: Map<number, chartListElementProps>,
  valueMap: Map<number, number>,
): chartListElementProps[] => {
  return orderedIds
    .map((id) => {
      const meta = metaMap.get(id);
      const value = valueMap.get(id) ?? 0;

      if (!meta || value <= 0) {
        return null;
      }

      return {
        ...meta,
        value,
      };
    })
    .filter((item): item is chartListElementProps => Boolean(item));
};
