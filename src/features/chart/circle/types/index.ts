import type { chartListElementProps } from "@/features/chart/list/element/types";

export type engineType = "svg" | "canvas" | "chartJs";

export interface pieChartProps {
  type: engineType;
  data: chartListElementProps[];
}

export type circleSector = chartListElementProps & {
  d: string;
  fullCircle: boolean;
  percent: number;
};

export type tooltipPositionType = { x: number; y: number };

export type canvasSector = chartListElementProps & {
  startAngle: number;
  endAngle: number;
  percent: number;
  fullCircle: boolean;
};
