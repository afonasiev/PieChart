import { describe, expect, it } from "vitest";
import type { chartListElementProps } from "@/features/chart/list/element/types";
import {
  collectPositiveSectors,
  createTargetValueMap,
  easeOutQuart,
  syncRenderOrder,
} from "@/features/chart/circle/helpers/index.ts";

describe("circle engine helpers", () => {
  it("builds target values map only for positive sectors", () => {
    const sectors: chartListElementProps[] = [
      { id: 1, name: "A", value: 10, color: "#111" },
      { id: 2, name: "B", value: 0, color: "#222" },
      { id: 3, name: "C", value: -5, color: "#333" },
    ];

    const map = createTargetValueMap(sectors);

    expect(Array.from(map.entries())).toEqual([[1, 10]]);
  });

  it("keeps render order as target ids plus disappearing ids", () => {
    const order = syncRenderOrder([2, 4, 2], [1, 2, 3]);

    expect(order).toEqual([2, 4, 1, 3]);
  });

  it("collects only sectors with metadata and positive animated values", () => {
    const meta = new Map<number, chartListElementProps>([
      [1, { id: 1, name: "A", value: 100, color: "#111" }],
      [2, { id: 2, name: "B", value: 100, color: "#222" }],
    ]);
    const values = new Map<number, number>([
      [1, 20],
      [2, 0],
      [3, 15],
    ]);

    const result = collectPositiveSectors([1, 2, 3], meta, values);

    expect(result).toEqual([{ id: 1, name: "A", value: 20, color: "#111" }]);
  });

  it("uses quartic easing with fast start and smooth end", () => {
    expect(easeOutQuart(0)).toBe(0);
    expect(easeOutQuart(1)).toBe(1);
    expect(easeOutQuart(0.5)).toBeGreaterThan(0.5);
  });
});
