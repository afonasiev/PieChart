import { expectTypeOf, test } from "vitest";
import type {
  Props,
  chartType,
  engineType,
  statusType,
  strokeWidth,
  svgSize,
} from "@/features/chart/progress/types";

test("statusType union is strict", () => {
  expectTypeOf<statusType>().toEqualTypeOf<"in progress" | "success" | "warning" | "error">();
});

test("chart and engine types expose only supported values", () => {
  expectTypeOf<chartType>().toEqualTypeOf<"circle" | "dashboard">();
  expectTypeOf<engineType>().toEqualTypeOf<"svg" | "canvas">();
});

test("size and stroke are restricted to design-system values", () => {
  expectTypeOf<svgSize>().toEqualTypeOf<80 | 100 | 120 | 140>();
  expectTypeOf<strokeWidth>().toEqualTypeOf<4 | 6 | 8 | 10>();
});

test("component props map to strict unions", () => {
  expectTypeOf<Props["status"]>().toEqualTypeOf<statusType | undefined>();
  expectTypeOf<Props["type"]>().toEqualTypeOf<chartType | undefined>();
  expectTypeOf<Props["engine"]>().toEqualTypeOf<engineType | undefined>();
  expectTypeOf<Props["size"]>().toEqualTypeOf<svgSize | undefined>();
  expectTypeOf<Props["strokeWidth"]>().toEqualTypeOf<strokeWidth | undefined>();
});
