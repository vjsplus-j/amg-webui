import { flushPromises, mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import FixedLayout from "../../../packages/components/base/FixedLayout/index.vue";
import EmbedLayout from "../../../packages/components/base/EmbedLayout/index.vue";
import DragSortNode from "../../../packages/components/base/DragSortNode/index.vue";
import MergeTable from "../../../packages/components/base/MergeTable/index.vue";
import CanvasPreview from "../../../packages/components/base/CanvasPreview/index.vue";
import MonthPicker from "../../../packages/components/base/MonthPicker/index.vue";
import YearPicker from "../../../packages/components/base/YearPicker/index.vue";
import GbsSignMonitor from "../../../packages/components/industry/GbsSignMonitor/index.vue";
import VcrStorageDashboard from "../../../packages/components/base/VcrStorageDashboard/index.vue";

const node = (id: string, locked = false) => ({
  id,
  type: "block",
  label: id.toUpperCase(),
  x: 0,
  y: 0,
  w: 120,
  h: 48,
  props: {},
  locked,
});

describe("lowest beta score 61-63 wave behavior", () => {
  it("reserves the correct FixedLayout axis and supports safe-area teleport contracts", () => {
    const wrapper = mount(FixedLayout, {
      props: {
        as: "header",
        mode: "absolute",
        position: "bottom",
        offset: "md",
        safeArea: true,
        ariaLabel: "Dock",
      },
      slots: { default: "Toolbar" },
    });
    expect(wrapper.find("header").classes()).toContain(
      "vp-fixed-layout--bottom",
    );
    expect(wrapper.find("header").attributes("aria-label")).toBe("Dock");
    expect(wrapper.find(".vp-fixed-layout__placeholder").exists()).toBe(true);
  });

  it("keeps EmbedLayout passive by default and keyboard-activates interactive frames", async () => {
    const passive = mount(EmbedLayout);
    await passive.trigger("click");
    expect(passive.emitted("frame-click")).toBeUndefined();

    const interactive = mount(EmbedLayout, {
      props: { interactive: true, caption: "Preview", aspectRatio: "4/3" },
    });
    await interactive.trigger("keydown", { key: " " });
    expect(interactive.emitted("frame-click")).toHaveLength(1);
    expect(interactive.attributes("style")).toContain("aspect-ratio: 4 / 3");
    expect(interactive.find("figcaption").text()).toBe("Preview");
  });

  it("does not fabricate sortable nodes and supports keyboard reordering", async () => {
    expect(mount(DragSortNode).findAll('[role="option"]')).toHaveLength(0);
    const wrapper = mount(DragSortNode, {
      props: { nodes: [node("a"), node("b"), node("c", true)] },
    });
    await wrapper.findAll('[role="option"]')[0].trigger("keydown", {
      key: "ArrowDown",
    });
    expect(
      wrapper
        .emitted("update:modelValue")?.[0]?.[0]
        .map((item: { id: string }) => item.id),
    ).toEqual(["b", "a", "c"]);
    expect(wrapper.emitted("move")?.[0]?.slice(1)).toEqual([0, 1]);
    expect(wrapper.findAll('[role="option"]')[2].attributes("tabindex")).toBe(
      "-1",
    );
  });

  it("merges hierarchical table groups, sorts, and selects rows", async () => {
    const wrapper = mount(MergeTable, {
      props: {
        rowKey: "id",
        mergeFields: ["region", "team"],
        columns: [
          { field: "region", header: "Region" },
          { field: "team", header: "Team" },
          { field: "score", header: "Score", sortable: true },
        ],
        rows: [
          { id: 1, region: "East", team: "A", score: 2 },
          { id: 2, region: "East", team: "A", score: 1 },
          { id: 3, region: "East", team: "B", score: 3 },
        ],
      },
    });
    expect(wrapper.find('td[rowspan="3"]').text()).toBe("East");
    expect(wrapper.find('td[rowspan="2"]').text()).toBe("A");
    await wrapper.find("th button").trigger("click");
    expect(wrapper.emitted("sortChange")?.[0]).toEqual(["score", "asc"]);
    await wrapper.find("tbody tr").trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([2]);
  });

  it("keeps CanvasPreview empty by default and emits accessible node selection", async () => {
    expect(
      mount(CanvasPreview).findAll(".vp-canvas-preview__node"),
    ).toHaveLength(0);
    const wrapper = mount(CanvasPreview, {
      props: {
        nodes: [node("a"), { ...node("hidden"), hidden: true }],
        scale: 9,
      },
    });
    expect(wrapper.findAll(".vp-canvas-preview__node")).toHaveLength(1);
    await wrapper.find(".vp-canvas-preview__node").trigger("keydown", {
      key: "Enter",
    });
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["a"]);
    expect(wrapper.emitted("scaleChange")?.[0]).toEqual([2]);
  });

  it("enforces MonthPicker range limits and clears explicitly", async () => {
    const wrapper = mount(MonthPicker, {
      props: {
        modelValue: "2026-06-01",
        min: "2026-05-01",
        max: "2026-08-01",
        clearable: true,
      },
      attachTo: document.body,
    });
    await wrapper.find(".vp-monthpicker__trigger").trigger("click");
    const jan = document.body.querySelector<HTMLElement>('[data-month="0"]');
    const jul = document.body.querySelector<HTMLElement>('[data-month="6"]');
    expect(jan?.hasAttribute("disabled")).toBe(true);
    jul?.click();
    await flushPromises();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["2026-07-01"]);
    await wrapper.find(".vp-monthpicker__clear").trigger("click");
    expect(wrapper.emitted("clear")).toHaveLength(1);
    wrapper.unmount();
  });

  it("enforces YearPicker limits and keyboard selection", async () => {
    const wrapper = mount(YearPicker, {
      props: { modelValue: 2026, min: 2025, max: 2027, yearRange: 6 },
      attachTo: document.body,
    });
    await wrapper.find(".vp-yearpicker__trigger").trigger("click");
    const y2024 = document.body.querySelector<HTMLElement>('[data-year="2024"]');
    const y2027 = document.body.querySelector<HTMLElement>('[data-year="2027"]');
    expect(y2024?.hasAttribute("disabled")).toBe(true);
    y2027?.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );
    await flushPromises();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([2027]);
    wrapper.unmount();
  });

  it("filters and actually clears GBS signaling entries", async () => {
    expect(mount(GbsSignMonitor).findAll('[role="button"]')).toHaveLength(0);
    const wrapper = mount(GbsSignMonitor, {
      props: {
        logs: [
          { id: "1", type: "REGISTER", message: "200 OK", time: "10:00" },
          { id: "2", type: "KEEPALIVE", message: "MESSAGE", time: "10:01" },
        ],
      },
    });
    await wrapper.find('input[type="search"]').setValue("register");
    expect(wrapper.findAll(".vp-gbs-sign-monitor__entry")).toHaveLength(1);
    await wrapper.findAll("header button")[1].trigger("click");
    expect(wrapper.findAll(".vp-gbs-sign-monitor__entry")).toHaveLength(0);
    expect(wrapper.emitted("update:logs")?.[0]).toEqual([[]]);
  });

  it("clamps VCR capacity and exports a real aggregate summary", async () => {
    const wrapper = mount(VcrStorageDashboard, {
      props: {
        volumes: [
          { id: "a", name: "A", used: 120, total: 100 },
          { id: "b", name: "B", used: 25, total: 100 },
        ],
      },
    });
    expect(
      wrapper.findAll('[role="progressbar"]')[1].attributes("aria-valuenow"),
    ).toBe("100");
    await wrapper.findAll("header button")[1].trigger("click");
    expect(wrapper.emitted("export")?.[0]?.[1]).toMatchObject({
      used: 145,
      total: 200,
      available: 55,
      percent: 73,
    });
    await wrapper.find('[role="option"]').trigger("click");
    expect(wrapper.emitted("update:selectedId")?.[0]).toEqual(["a"]);
  });
});
