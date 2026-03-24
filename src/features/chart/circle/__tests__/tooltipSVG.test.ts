import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import TooltipSvg from "@/features/chart/circle/components/tooltipSVG.vue";

describe("TooltipSvg", () => {
  it("does not render tooltip body when data is null", () => {
    const wrapper = mount(TooltipSvg, {
      props: {
        data: null,
        position: { x: 10, y: 20 },
      },
      global: {
        stubs: {
          Transition: false,
        },
      },
    });

    expect(wrapper.find("div").exists()).toBe(false);
  });

  it("renders name, value, percent and position style when data exists", () => {
    const wrapper = mount(TooltipSvg, {
      props: {
        data: {
          id: 1,
          name: "Sector A",
          value: 33,
          color: "#112233",
          d: "M ...",
          fullCircle: false,
          percent: 33.333,
        },
        position: { x: 45, y: 90 },
      },
      global: {
        stubs: {
          Transition: false,
        },
      },
    });

    expect(wrapper.text()).toContain("Sector A");
    expect(wrapper.text()).toContain("33");
    expect(wrapper.text()).toContain("33.3%");
    expect(wrapper.attributes("style")).toContain("left: 45px;");
    expect(wrapper.attributes("style")).toContain("top: 90px;");
  });
});
