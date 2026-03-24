import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PieProgress from "@/features/chart/progress/index.vue";
import SvgEngine from "@/features/chart/progress/engines/svgEngine.vue";
import type { EngineProps } from "@/features/chart/progress/types";

const baseProps: EngineProps = {
  size: 120,
  viewBox: "0 0 120 120",
  ariaLabel: "Progress 50 percent",
  progress: 50,
  circleSize: 60,
  strokeWidth: 8,
  circleRadius: 56,
  circleRotate: "rotate(-90 60 60)",
  circleArc: 351.85837720205683,
  circleRound: 351.85837720205683,
  colorStatus: "rgb(128, 128, 128)",
  progressLength: 175.92918860102841,
  status: "in progress",
  chartType: "circle",
};

describe("PieProgress component", () => {
  beforeEach(() => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      clearRect: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      fillText: vi.fn(),
      scale: vi.fn(),
      setTransform: vi.fn(),
    } as unknown as CanvasRenderingContext2D);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders svg engine by default with computed aria attributes", () => {
    const wrapper = mount(PieProgress);
    const svg = wrapper.find('svg[role="progressbar"]');

    expect(svg.exists()).toBe(true);
    expect(svg.attributes("aria-label")).toBe("Progress 50 percent");
    expect(svg.attributes("aria-valuenow")).toBe("50");
  });

  it("switches to canvas engine when requested", () => {
    const wrapper = mount(PieProgress, {
      props: {
        engine: "canvas",
      },
    });

    expect(wrapper.find("canvas[role='progressbar']").exists()).toBe(true);
    expect(wrapper.find("svg[role='progressbar']").exists()).toBe(false);
  });

  it("renders success state with fixed progress and success aria label", () => {
    const wrapper = mount(PieProgress, {
      props: {
        status: "success",
        progress: 7,
      },
    });

    const svg = wrapper.find('svg[role="progressbar"]');
    const successPath = wrapper.find('path[d="M-8 0 L-2 6 L 8 -5"]');

    expect(svg.attributes("aria-label")).toBe("Progress success");
    expect(svg.attributes("aria-valuenow")).toBe("100");
    expect(successPath.exists()).toBe(true);
  });

  it("forwards all engine props to svg renderer", () => {
    const wrapper = mount(PieProgress, {
      props: {
        type: "dashboard",
        progress: 60,
        strokeWidth: 10,
      },
    });

    const circles = wrapper.findAll("circle");
    expect(circles.length).toBe(2);
    expect(wrapper.attributes("style")).toContain("width: 120px");
    expect(wrapper.attributes("style")).toContain("height: 120px");
  });
});

describe("Engine props contract", () => {
  it("renders svg engine with strongly typed props", () => {
    const wrapper = mount(SvgEngine, {
      props: baseProps,
      global: {
        stubs: {
          Transition: false,
        },
      },
    });

    expect(wrapper.find('svg[role="progressbar"]').exists()).toBe(true);
    expect(wrapper.find("text").text()).toContain("50%");
  });
});
