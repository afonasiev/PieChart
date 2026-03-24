import { describe, expect, it } from "vitest";
import {
  getArcConfig,
  getProgressAriaLabel,
  getProgressColor,
  getProgressType,
  normalizedNumberProgress,
} from "@/features/chart/progress/helpers";

describe("progress helpers", () => {
  it("clamps progress to 0..100", () => {
    expect(normalizedNumberProgress(-1)).toBe(0);
    expect(normalizedNumberProgress(45)).toBe(45);
    expect(normalizedNumberProgress(101)).toBe(100);
  });

  it("maps predefined statuses to fixed progress", () => {
    expect(getProgressType("warning", 10)).toBe(75);
    expect(getProgressType("error", 10)).toBe(50);
    expect(getProgressType("success", 10)).toBe(100);
    expect(getProgressType("in progress", 42)).toBe(42);
  });

  it("builds aria labels based on status", () => {
    expect(getProgressAriaLabel("warning", 10)).toBe("Progress warning");
    expect(getProgressAriaLabel("error", 10)).toBe("Progress error");
    expect(getProgressAriaLabel("success", 10)).toBe("Progress success");
    expect(getProgressAriaLabel("in progress", 42)).toBe("Progress 42 percent");
  });

  it("interpolates 2-color gradients in rgb", () => {
    expect(getProgressColor(0, "#ff0000", "#00ff00")).toBe("rgb(255, 0, 0)");
    expect(getProgressColor(100, "#ff0000", "#00ff00")).toBe("rgb(0, 255, 0)");
  });

  it("interpolates 3-color gradients with the middle color split", () => {
    expect(getProgressColor(25, "#ff0000", "#00ff00", "#ffff00", false)).toBe("rgb(255, 128, 0)");
    expect(getProgressColor(75, "#ff0000", "#00ff00", "#ffff00", false)).toBe("rgb(128, 255, 0)");
  });

  it("supports hsl interpolation mode", () => {
    const color = getProgressColor(50, "#ff0000", "#00ff00", undefined, true);

    expect(color.startsWith("hsl(")).toBe(true);
  });

  it("returns arc config for circle and dashboard", () => {
    const circle = getArcConfig("circle");
    const dashboard = getArcConfig("dashboard");

    expect(circle.startAngle).toBe(-Math.PI / 2);
    expect(circle.totalAngle).toBe(Math.PI * 2);
    expect(dashboard.totalAngle).toBe(Math.PI * 1.5);
  });

  it("clamps out-of-range values before color interpolation", () => {
    const belowZero = getProgressColor(-100, "#ff0000", "#00ff00");
    const aboveHundred = getProgressColor(500, "#ff0000", "#00ff00");

    expect(belowZero).toBe("rgb(255, 0, 0)");
    expect(aboveHundred).toBe("rgb(0, 255, 0)");
  });

  it("calculates color transitions fast enough for high-volume updates", () => {
    const startedAt = performance.now();
    let lastColor = "";

    for (let index = 0; index < 100_000; index += 1) {
      lastColor = getProgressColor(index % 101, "#ff5252", "#00c853", "#ffa726", false);
    }

    const elapsed = performance.now() - startedAt;

    expect(lastColor.length).toBeGreaterThan(0);
    expect(elapsed).toBeLessThan(750);
  });
});
