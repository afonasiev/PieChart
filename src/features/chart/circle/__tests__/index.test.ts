import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import PieChart from "@/features/chart/circle/index.vue";
import type { chartListElementProps } from "@/features/chart/list/element/types";

const sampleData: chartListElementProps[] = [
  { id: 1, name: "One", value: 10, color: "#ff0000" },
  { id: 2, name: "Two", value: 20, color: "#00ff00" },
];

describe("PieChart engine switch", () => {
  it("renders chartJs engine when type=chartJs", () => {
    const wrapper = mount(PieChart, {
      props: {
        type: "chartJs",
        data: sampleData,
      },
      global: {
        stubs: {
          EngineChart: {
            template: '<div data-test="chartjs" />',
            props: ["data"],
          },
          EngineSvg: { template: '<div data-test="svg" />', props: ["data"] },
          EngineCanvas: { template: '<div data-test="canvas" />', props: ["data"] },
        },
      },
    });

    expect(wrapper.find('[data-test="chartjs"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="svg"]').exists()).toBe(false);
    expect(wrapper.find('[data-test="canvas"]').exists()).toBe(false);
  });

  it("renders svg engine when type=svg", () => {
    const wrapper = mount(PieChart, {
      props: {
        type: "svg",
        data: sampleData,
      },
      global: {
        stubs: {
          EngineChart: { template: '<div data-test="chartjs" />', props: ["data"] },
          EngineSvg: { template: '<div data-test="svg" />', props: ["data"] },
          EngineCanvas: { template: '<div data-test="canvas" />', props: ["data"] },
        },
      },
    });

    expect(wrapper.find('[data-test="chartjs"]').exists()).toBe(false);
    expect(wrapper.find('[data-test="svg"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="canvas"]').exists()).toBe(false);
  });

  it("renders canvas engine for fallback branch", () => {
    const wrapper = mount(PieChart, {
      props: {
        type: "canvas",
        data: sampleData,
      },
      global: {
        stubs: {
          EngineChart: { template: '<div data-test="chartjs" />', props: ["data"] },
          EngineSvg: { template: '<div data-test="svg" />', props: ["data"] },
          EngineCanvas: { template: '<div data-test="canvas" />', props: ["data"] },
        },
      },
    });

    expect(wrapper.find('[data-test="chartjs"]').exists()).toBe(false);
    expect(wrapper.find('[data-test="svg"]').exists()).toBe(false);
    expect(wrapper.find('[data-test="canvas"]').exists()).toBe(true);
  });
});
