import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import DataCard from "../../../packages/components/data/DataCard/index.vue";
import Calendar from "../../../packages/components/data/Calendar/index.vue";
import PivotTable from "../../../packages/components/data/PivotTable/index.vue";
import Timeline from "../../../packages/components/data/Timeline/index.vue";
import TimelineItem from "../../../packages/components/data/TimelineItem/index.vue";
import NoticeBar from "../../../packages/components/core/NoticeBar/index.vue";
import LoadingTip from "../../../packages/components/core/LoadingTip/index.vue";
import Result from "../../../packages/components/core/Result/index.vue";
import StatusTip from "../../../packages/components/core/StatusTip/index.vue";
import Tooltip from "../../../packages/components/core/Tooltip/index.vue";

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = "";
});

describe("priority beta component strengthening", () => {
  it("formats and keyboard-selects a DataCard without fabricating a zero value", async () => {
    const wrapper = mount(DataCard, {
      props: {
        title: "Revenue",
        clickable: true,
        value: null,
        formatter: (value) => (value == null ? "N/A" : String(value)),
      },
    });
    expect(wrapper.text()).toContain("N/A");
    await wrapper.trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("update:selected")?.[0]).toEqual([true]);
    expect(wrapper.attributes("role")).toBe("button");
  });

  it("renders a six-week Calendar grid and enforces disabled dates", async () => {
    const wrapper = mount(Calendar, {
      props: { modelValue: "2026-08-04", min: "2026-08-03", max: "2026-08-10" },
    });
    expect(wrapper.findAll('[role="gridcell"]')).toHaveLength(42);
    expect(
      wrapper.find('[data-date="2026-08-02"]').attributes("disabled"),
    ).toBeDefined();
    await wrapper.find('[data-date="2026-08-05"]').trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["2026-08-05"]);
  });

  it("aggregates PivotTable cells and emits rich cell and row events", async () => {
    const rows = [
      { region: "East", product: "A", amount: 2 },
      { region: "East", product: "A", amount: 3 },
      { region: "West", product: "A", amount: 4 },
    ];
    const wrapper = mount(PivotTable, {
      props: {
        rows,
        rowField: "region",
        columnField: "product",
        valueField: "amount",
      },
    });
    expect(wrapper.text()).toContain("5");
    await wrapper.find("tbody td").trigger("click");
    expect(wrapper.emitted("cellClick")?.[0]?.[0]).toMatchObject({
      rowKey: "East",
      columnKey: "A",
      value: 5,
    });
    await wrapper.find("tbody tr").trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["East"]);
  });

  it("supports both data-driven and composed selectable timelines", async () => {
    const wrapper = mount(Timeline, {
      props: {
        selectable: true,
        items: [
          { itemKey: "start", title: "Started" },
          { itemKey: "done", title: "Done", disabled: true },
        ],
      },
    });
    await wrapper
      .findAll(".vp-timeline-item")[0]
      .trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["start"]);
    await wrapper.findAll(".vp-timeline-item")[1].trigger("click");
    expect(wrapper.emitted("update:modelValue")).toHaveLength(1);

    const composed = mount(Timeline, {
      props: { selectable: true },
      slots: {
        default: {
          components: { TimelineItem },
          template: '<TimelineItem item-key="slot">Slot item</TimelineItem>',
        },
      },
    });
    await composed.find(".vp-timeline-item").trigger("click");
    expect(composed.emitted("update:modelValue")?.[0]).toEqual(["slot"]);
  });

  it("keeps NoticeBar visibility controllable and separates action from body clicks", async () => {
    const wrapper = mount(NoticeBar, {
      props: {
        modelValue: true,
        message: "Maintenance",
        actionText: "Details",
      },
    });
    await wrapper.find(".vp-notice-bar__action").trigger("click");
    expect(wrapper.emitted("action")).toHaveLength(1);
    expect(wrapper.emitted("click")).toBeUndefined();
    await wrapper.find(".vp-notice-bar__close").trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([false]);
    expect(wrapper.find(".vp-notice-bar").exists()).toBe(true);
  });

  it("delays LoadingTip, exposes progress and emits cancellation", async () => {
    vi.useFakeTimers();
    const wrapper = mount(LoadingTip, {
      props: { loading: true, delay: 200, progress: 35, cancellable: true },
    });
    expect(wrapper.find('[role="status"]').exists()).toBe(false);
    vi.advanceTimersByTime(200);
    await flushPromises();
    expect(
      wrapper.find('[role="progressbar"]').attributes("aria-valuenow"),
    ).toBe("35");
    await wrapper.find(".vp-loading-tip__cancel").trigger("click");
    expect(wrapper.emitted("cancel")).toHaveLength(1);
  });

  it("emits explicit Result and StatusTip actions", async () => {
    const result = mount(Result, {
      props: {
        status: "404",
        title: "Not found",
        actions: [{ key: "home", label: "Home", primary: true }],
      },
    });
    await result.find(".vp-result__action").trigger("click");
    expect(result.emitted("action")?.[0]?.[0]).toBe("home");
    expect(result.find(".vp-result__title").attributes("id")).toBeTruthy();
    const status = mount(StatusTip, {
      props: {
        title: "Heads up",
        message: "Check this",
        actionText: "Review",
        closable: true,
      },
    });
    await status.find(".vp-status-tip__action").trigger("click");
    await status.find(".vp-status-tip__close").trigger("click");
    expect(status.emitted("action")).toHaveLength(1);
    expect(status.emitted("close")).toHaveLength(1);
  });

  it("teleports Tooltip, computes fixed position and closes on Escape", async () => {
    const wrapper = mount(Tooltip, {
      props: { content: "Helpful", trigger: "click" },
      slots: { default: "<button>Target</button>" },
      attachTo: document.body,
    });
    await wrapper.find(".vp-tooltip-trigger__target").trigger("click");
    await flushPromises();
    const panel = document.body.querySelector<HTMLElement>(".vp-tooltip");
    expect(panel?.style.position).toBe("fixed");
    expect(panel?.getAttribute("role")).toBe("tooltip");
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await flushPromises();
    expect(wrapper.emitted("hide")?.[0]?.[0]).toBe("escape");
    wrapper.unmount();
  });
});
