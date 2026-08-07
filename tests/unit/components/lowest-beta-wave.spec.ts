import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import GbsDeviceTree from "../../../packages/components/gb28181/GbsDeviceTree/index.vue";
import OnvifGroupTree from "../../../packages/components/onvif/OnvifGroupTree/index.vue";
import TemplateDrag from "../../../packages/lowcode/ui/TemplateDrag/index.vue";
import TopNav from "../../../packages/components/core/TopNav/index.vue";
import ScrollNotice from "../../../packages/components/core/ScrollNotice/index.vue";
import TablePrint from "../../../packages/components/data/TablePrint/index.vue";
import ColumnLayout from "../../../packages/components/core/ColumnLayout/index.vue";
import RangeInput from "../../../packages/components/form/RangeInput/index.vue";
import InputNumber from "../../../packages/components/form/InputNumber/index.vue";
import BrowserDetect from "../../../packages/components/core/BrowserDetect/index.vue";
import Main from "../../../packages/components/core/Main/index.vue";
import DescriptionsItem from "../../../packages/components/data/DescriptionsItem/index.vue";
import ScaleLayout from "../../../packages/components/core/ScaleLayout/index.vue";
import FlowLayout from "../../../packages/components/core/FlowLayout/index.vue";
import MenuBar from "../../../packages/components/core/MenuBar/index.vue";
import Row from "../../../packages/components/core/Row/index.vue";
import CanvasIo from "../../../packages/lowcode/ui/CanvasIo/index.vue";
import CardNav from "../../../packages/components/core/CardNav/index.vue";
import Center from "../../../packages/components/core/Center/index.vue";
import Col from "../../../packages/components/core/Col/index.vue";
import FormLayout from "../../../packages/components/core/FormLayout/index.vue";

describe("lowest beta wave behavior", () => {
  it("does not fabricate GBS devices and cascades leaf selection", async () => {
    const empty = mount(GbsDeviceTree);
    expect(empty.findAll('[role="treeitem"]')).toHaveLength(0);
    const wrapper = mount(GbsDeviceTree, {
      props: {
        expandedKeys: ["region"],
        options: [
          {
            label: "Region",
            value: "region",
            children: [{ label: "Camera", value: "camera" }],
          },
        ],
      },
    });
    await wrapper.find('input[type="checkbox"]').setValue(true);
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([["camera"]]);
  });

  it("filters recursive ONVIF groups and supports all-node checking", async () => {
    const wrapper = mount(OnvifGroupTree, {
      props: {
        filter: "gate",
        expandedKeys: ["building"],
        options: [
          {
            label: "Building",
            value: "building",
            children: [
              { label: "Gate", value: "gate" },
              { label: "Lobby", value: "lobby" },
            ],
          },
        ],
      },
    });
    expect(wrapper.text()).toContain("Gate");
    expect(wrapper.text()).not.toContain("Lobby");
    await wrapper.find('input[type="checkbox"]').setValue(true);
    expect(wrapper.emitted("update:modelValue")?.[0]?.[0]).toEqual([
      "building",
      "gate",
    ]);
  });

  it("keeps TemplateDrag empty by default and keyboard-applies enabled templates", async () => {
    expect(mount(TemplateDrag).findAll('[role="option"]')).toHaveLength(0);
    const wrapper = mount(TemplateDrag, {
      props: {
        templates: [
          { id: "a", name: "Form", description: "Reusable" },
          { id: "b", name: "Locked", disabled: true },
        ],
      },
    });
    await wrapper
      .findAll('[role="option"]')[0]
      .trigger("keydown", { key: "Enter" });
    await wrapper.findAll('[role="option"]')[1].trigger("click");
    expect(wrapper.emitted("apply")).toHaveLength(1);
  });

  it("moves TopNav focus by orientation and exposes current page", async () => {
    const wrapper = mount(TopNav, {
      attachTo: document.body,
      props: {
        modelValue: "a",
        items: [
          { label: "A", value: "a" },
          { label: "Disabled", value: "x", disabled: true },
          { label: "B", value: "b" },
        ],
      },
    });
    const buttons = wrapper.findAll("button");
    buttons[0].element.focus();
    await buttons[0].trigger("keydown", { key: "ArrowRight" });
    expect(document.activeElement).toBe(buttons[2].element);
    expect(buttons[0].attributes("aria-current")).toBe("page");
    wrapper.unmount();
  });

  it("pauses ScrollNotice on hover and keeps absent content absent", async () => {
    const empty = mount(ScrollNotice);
    expect(empty.text()).toBe("");
    const wrapper = mount(ScrollNotice, { props: { text: "Notice" } });
    await wrapper.trigger("mouseenter");
    await wrapper.trigger("mouseleave");
    expect(wrapper.emitted("pause")).toHaveLength(1);
    expect(wrapper.emitted("resume")).toHaveLength(1);
  });

  it("reports a blocked print window without emitting print lifecycle", async () => {
    const open = vi.spyOn(window, "open").mockReturnValue(null);
    const wrapper = mount(TablePrint, {
      props: { data: [{ name: "<unsafe>" }] },
    });
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("error")).toHaveLength(1);
    expect(wrapper.emitted("before-print")).toBeUndefined();
    open.mockRestore();
  });

  it("clamps structural columns and reports the effective count", () => {
    const wrapper = mount(ColumnLayout, { props: { columns: 99 } });
    expect(wrapper.attributes("style")).toContain("repeat(12");
    expect(wrapper.emitted("columns-change")?.[0]).toEqual([12]);
  });

  it("normalizes crossed ranges when crossing is disabled", async () => {
    const wrapper = mount(RangeInput, {
      props: { modelValue: { min: 8, max: 10 }, allowCross: false },
    });
    wrapper.findAllComponents(InputNumber)[0].vm.$emit("update:modelValue", 12);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([
      { min: 10, max: 12 },
    ]);
  });

  it("detects an injected browser user agent and refreshes explicitly", async () => {
    const wrapper = mount(BrowserDetect, {
      props: { userAgent: "Mozilla/5.0 Chrome/126.0.0.0 Safari/537.36" },
    });
    expect(wrapper.text()).toContain("Chrome 126");
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("refresh")?.length).toBeGreaterThanOrEqual(2);
  });

  it("honors layout primitive token contracts and semantic hosts", () => {
    expect(
      mount(Main, { props: { padding: "none", overflow: "hidden" } }).classes(),
    ).toContain("vp-main--flush");
    expect(
      mount(DescriptionsItem, { props: { label: "Name", span: 3 } }).attributes(
        "style",
      ),
    ).toContain("span 3");
    expect(
      mount(ScaleLayout, { props: { scale: 2, fit: "manual" } }).attributes(
        "style",
      ),
    ).toContain("--vp-scale: 2");
    expect(
      mount(FlowLayout, { props: { gap: "lg", reverse: true } }).classes(),
    ).toContain("vp-flow-layout--reverse");
    expect(
      mount(Row, { props: { gutter: "lg", wrap: false } }).classes(),
    ).toContain("vp-row--nowrap");
    expect(
      mount(Center, { props: { as: "section", axis: "horizontal" } }).element
        .tagName,
    ).toBe("SECTION");
    expect(mount(Col, { props: { span: 30 } }).attributes("style")).toContain(
      "24 / 24",
    );
    expect(
      mount(FormLayout, { props: { layout: "inline", columns: 2 } }).classes(),
    ).toContain("vp-form-layout--layout-inline");
  });

  it("delegates navigation selection through public events", async () => {
    mount(MenuBar, { props: { items: [{ label: "File", command: "file" }] } });
    const cards = mount(CardNav, {
      props: { items: [{ label: "Overview", value: "overview" }] },
    });
    await cards.find("button").trigger("click");
    expect(cards.emitted("update:modelValue")?.[0]).toEqual(["overview"]);
  });

  it("keeps CanvasIo import and export controls disabled as a pair", () => {
    const wrapper = mount(CanvasIo, { props: { disabled: true } });
    expect(
      wrapper
        .findAll("button")
        .every((button) => button.attributes("disabled") !== undefined),
    ).toBe(true);
  });
});
