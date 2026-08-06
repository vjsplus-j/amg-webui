import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { h, nextTick } from "vue";
import { LocaleService } from "@amg-webui/locale";
import Affix from "../../../packages/components/base/Affix/index.vue";
import Alert from "../../../packages/components/base/Alert/index.vue";
import CanvasShortcut from "../../../packages/components/base/CanvasShortcut/index.vue";
import Business404 from "../../../packages/components/base/Business404/index.vue";
import CardGrid from "../../../packages/components/base/CardGrid/index.vue";
import CardNav from "../../../packages/components/base/CardNav/index.vue";
import Cartoon404 from "../../../packages/components/base/Cartoon404/index.vue";
import BarChart from "../../../packages/components/base/BarChart/index.vue";
import ConfigProvider from "../../../packages/components/base/ConfigProvider/index.vue";
import Countdown from "../../../packages/components/base/Countdown/index.vue";
import Col from "../../../packages/components/base/Col/index.vue";
import Container from "../../../packages/components/base/Container/index.vue";
import Center from "../../../packages/components/base/Center/index.vue";
import DragVerify from "../../../packages/components/base/DragVerify/index.vue";
import Doodle404 from "../../../packages/components/base/Doodle404/index.vue";
import GaugeChart from "../../../packages/components/base/GaugeChart/index.vue";
import HeatMap from "../../../packages/components/base/HeatMap/index.vue";
import Header from "../../../packages/components/base/Header/index.vue";
import Exception from "../../../packages/components/base/Exception/index.vue";
import FlowLayout from "../../../packages/components/base/FlowLayout/index.vue";
import FreeLayoutDrag from "../../../packages/components/base/FreeLayoutDrag/index.vue";
import Ink404 from "../../../packages/components/base/Ink404/index.vue";
import Layout from "../../../packages/components/base/Layout/index.vue";
import LineChart from "../../../packages/components/base/LineChart/index.vue";
import LoadingTip from "../../../packages/components/base/LoadingTip/index.vue";
import Machine404 from "../../../packages/components/base/Machine404/index.vue";
import Preview from "../../../packages/components/base/Preview/index.vue";
import Print from "../../../packages/components/base/Print/index.vue";
import PropPanel from "../../../packages/components/base/PropPanel/index.vue";
import ProgressTip from "../../../packages/components/base/ProgressTip/index.vue";
import PTZControl from "../../../packages/components/base/PTZControl/index.vue";
import Pixel404 from "../../../packages/components/base/Pixel404/index.vue";
import Plant404 from "../../../packages/components/base/Plant404/index.vue";
import RadarChart from "../../../packages/components/base/RadarChart/index.vue";
import Simple404 from "../../../packages/components/base/Simple404/index.vue";
import Scrollbar from "../../../packages/components/base/Scrollbar/index.vue";
import SearchFilterPanel from "../../../packages/components/base/SearchFilterPanel/index.vue";
import Spacer from "../../../packages/components/base/Spacer/index.vue";
import SplitVideoWall from "../../../packages/components/base/SplitVideoWall/index.vue";
import Space404 from "../../../packages/components/base/Space404/index.vue";
import Tooltip from "../../../packages/components/base/Tooltip/index.vue";
import Tech404 from "../../../packages/components/base/Tech404/index.vue";
import TelemetryProvider from "../../../packages/components/base/TelemetryProvider/index.vue";
import WordCloud from "../../../packages/components/base/WordCloud/index.vue";

beforeAll(() => {
  LocaleService.init();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("lowest maturity group strengthened behavior", () => {
  it("ConfigProvider exposes merged runtime config to descendants and slot", async () => {
    const wrapper = mount(ConfigProvider, {
      props: { density: "compact", direction: "rtl", theme: "dark" },
      slots: {
        default: ({ config }: any) =>
          h("span", { class: "slot-density" }, config.density),
      },
    });
    await nextTick();

    expect(wrapper.attributes("dir")).toBe("rtl");
    expect(wrapper.attributes("data-density")).toBe("compact");
    expect(wrapper.attributes("data-theme")).toBe("dark");
    expect(wrapper.get(".slot-density").text()).toBe("compact");
    expect(wrapper.emitted("change")?.[0]?.[0]).toMatchObject({
      density: "compact",
    });
  });

  it("CanvasShortcut exposes command list and keyboard execution hook", async () => {
    const wrapper = mount(CanvasShortcut, {
      props: {
        commands: [{ key: "copy", label: "Copy", shortcut: "Ctrl+C" }],
      },
    });

    expect(wrapper.findAll(".vp-canvas-shortcut__item")).toHaveLength(1);
    await wrapper.vm.$el.dispatchEvent(
      new KeyboardEvent("keydown", { key: "c", ctrlKey: true }),
    );
    expect(wrapper.emitted("copy")).toBeUndefined();
  });

  it("Col and Container expose semantic layout controls", async () => {
    const col = mount(Col, {
      props: { span: 6, ariaLabel: "Cell" },
      slots: { default: () => "Slot" },
    });
    expect(col.attributes("role")).toBe("group");
    expect(col.attributes("aria-label")).toBe("Cell");

    const container = mount(Container, {
      props: { tag: "section", ariaLabel: "Main region", fullBleed: true },
    });
    expect(container.attributes("data-component")).toBe("Container");
    expect(container.attributes("aria-label")).toBe("Main region");
  });

  it("Doodle404 supports action, home and retry flows", async () => {
    const wrapper = mount(Doodle404, {
      props: {
        retryable: true,
        homeHref: "/home",
        actions: [{ key: "docs", label: "Docs" }],
      },
    });

    await wrapper.findAll(".vp-doodle404__action")[0]!.trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["docs"]);
    expect(wrapper.emitted("action")?.[0]?.[0]).toMatchObject({ key: "docs" });
    await wrapper.findAll(".vp-doodle404__action").at(-1)!.trigger("click");
    expect(wrapper.emitted("retry")).toBeTruthy();
  });

  it("Preview supports controlled zoom, rotation, reset and keyboard shortcuts", async () => {
    const wrapper = mount(Preview, {
      props: { modelValue: 1, zoom: 1, step: 0.25 },
    });

    await wrapper.findAll(".vp-preview__btn")[1]!.trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([1.25]);

    await wrapper.findAll(".vp-preview__btn")[2]!.trigger("click");
    expect(wrapper.emitted("rotate")?.[0]).toEqual([90]);

    await wrapper.trigger("keydown", { key: "0" });
    expect(wrapper.emitted("reset")).toBeTruthy();
  });

  it("PTZControl emits payload commands, speed changes and keyboard navigation", async () => {
    const wrapper = mount(PTZControl, {
      props: { speed: 3, presets: [1] },
    });

    await wrapper.findAll(".vp-ptz-control__btn--pad")[1]!.trigger("click");
    expect(wrapper.emitted("command")?.[0]).toEqual([
      "up",
      { command: "up", speed: 3, source: "button", preset: undefined },
    ]);

    await wrapper.get('input[type="range"]').setValue("5");
    expect(wrapper.emitted("update:speed")?.[0]).toEqual([5]);

    await wrapper.trigger("keydown", { key: "ArrowLeft" });
    expect(wrapper.emitted("command")?.at(-1)?.[0]).toBe("left");
  });

  it("SplitVideoWall updates layout and selected cell with grid keyboard support", async () => {
    const wrapper = mount(SplitVideoWall, {
      props: { layout: 4, modelValue: 0, layouts: [1, 4, 6] },
    });

    await wrapper.findAll(".vp-split-video-wall__btn")[2]!.trigger("click");
    expect(wrapper.emitted("update:layout")?.[0]).toEqual([6]);

    await wrapper.findAll(".vp-split-video-wall__cell")[1]!.trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([1]);

    await wrapper
      .get(".vp-split-video-wall__grid")
      .trigger("keydown", { key: "End" });
    expect(wrapper.emitted("select")?.at(-1)).toEqual([3]);
  });

  it("Countdown exposes pause/resume/reset controls and model ticks", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-04T00:00:00.000Z"));
    const wrapper = mount(Countdown, {
      props: {
        value: Date.now() + 3000,
        showControls: true,
        millisecond: true,
      },
    });
    await nextTick();

    expect(wrapper.emitted("start")).toBeTruthy();
    await wrapper.findAll("button")[0]!.trigger("click");
    expect(wrapper.emitted("pause")).toBeTruthy();
    await wrapper.findAll("button")[1]!.trigger("click");
    expect(wrapper.emitted("reset")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
  });

  it("ProgressTip handles completion, close and action events", async () => {
    const wrapper = mount(ProgressTip, {
      props: {
        percentage: 99,
        title: "Upload",
        closable: true,
        actionText: "More",
      },
    });

    await wrapper.setProps({ percentage: 100 });
    expect(wrapper.emitted("complete")).toBeTruthy();
    await wrapper.get(".vp-progress-tip__btn").trigger("click");
    expect(wrapper.emitted("action")).toBeTruthy();
    await wrapper.get(".vp-progress-tip__close").trigger("click");
    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("Spacer exposes resize-ready semantics without breaking default aria-hidden behavior", async () => {
    const wrapper = mount(Spacer, {
      props: { ariaHidden: false, tabIndex: 0, size: "md" },
    });

    expect(wrapper.attributes("aria-hidden")).toBe("false");
    await wrapper.trigger("focus");
    await wrapper.trigger("blur");
    expect(wrapper.emitted("focus")).toBeTruthy();
    expect(wrapper.emitted("blur")).toBeTruthy();
  });

  it("Affix mirrors focus events and scoped slot state", async () => {
    const wrapper = mount(Affix, {
      props: { modelValue: true, placeholder: false },
      slots: {
        default: ({ affixed }: any) =>
          h("span", { class: "affixed-state" }, String(affixed)),
      },
    });

    expect(wrapper.attributes("data-affixed")).toBe("true");
    expect(wrapper.get(".affixed-state").text()).toBe("true");
    await wrapper.trigger("focusin");
    await wrapper.trigger("focusout");
    expect(wrapper.emitted("focus")).toBeTruthy();
    expect(wrapper.emitted("blur")).toBeTruthy();
  });

  it("Alert exposes description, icon and close action", async () => {
    const wrapper = mount(Alert, {
      props: {
        title: "Notice",
        description: "Body text",
        icon: "i",
        closable: true,
      },
    });

    expect(wrapper.get(".vp-alert__title").text()).toContain("Notice");
    expect(wrapper.get(".vp-alert__description").text()).toContain("Body text");
    await wrapper.get(".vp-alert__close").trigger("click");
    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("DragVerify succeeds from keyboard and can reset through exposed API", async () => {
    const wrapper = mount(DragVerify);
    const track = wrapper.get(".vp-drag-verify__track");
    Object.defineProperty(track.element, "clientWidth", {
      configurable: true,
      value: 244,
    });

    await track.trigger("keydown", { key: "End" });
    expect(wrapper.emitted("success")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([true]);

    (wrapper.vm as any).reset();
    expect(wrapper.emitted("reset")).toBeTruthy();
  });

  it("Print emits error when the print window cannot be opened", async () => {
    vi.spyOn(window, "open").mockReturnValue(null);
    const wrapper = mount(Print, {
      slots: { default: () => h("p", "print body") },
    });

    await wrapper.get(".vp-print__btn").trigger("click");
    expect(wrapper.emitted("before-print")).toBeTruthy();
    expect(wrapper.emitted("error")?.[0]?.[0]).toBeInstanceOf(Error);
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([false]);
  });

  it("Tooltip respects disabled state and optional arrow visibility", async () => {
    const wrapper = mount(Tooltip, {
      props: { content: "Help", disabled: true, showArrow: false },
    });

    await wrapper.trigger("mouseenter");
    expect(wrapper.find('[role="tooltip"]').exists()).toBe(false);
  });

  it("Simple404 exposes default, retry and custom actions", async () => {
    const wrapper = mount(Simple404, {
      props: {
        retryable: true,
        actions: [{ key: "docs", label: "Docs" }],
      },
    });

    await wrapper.findAll(".vp-simple404__action")[0]!.trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["docs"]);
    expect(wrapper.emitted("action")?.[0]?.[0]).toMatchObject({ key: "docs" });

    await wrapper.findAll(".vp-simple404__action").at(-1)!.trigger("click");
    expect(wrapper.emitted("retry")).toBeTruthy();
  });

  it("Exception supports accessible live mode and configurable action", async () => {
    const wrapper = mount(Exception, {
      props: {
        status: "offline",
        actionText: "Reconnect",
        ariaLive: "assertive",
      },
    });

    expect(wrapper.attributes("aria-live")).toBe("assertive");
    expect(wrapper.get("button").text()).toBe("Reconnect");
    await wrapper.get("button").trigger("click");
    expect(wrapper.emitted("action")).toBeTruthy();
  });

  it("LoadingTip can preserve its status container after loading", async () => {
    const wrapper = mount(LoadingTip, {
      props: { loading: false, persistent: true },
      slots: {
        default: ({ loading }: any) =>
          h("span", { class: "state" }, String(loading)),
      },
    });

    expect(wrapper.attributes("aria-busy")).toBe("false");
    expect(wrapper.get(".state").text()).toBe("false");
    expect(wrapper.find(".vp-loading-tip__spinner").exists()).toBe(false);
  });

  it("Layout exposes configurable root landmark semantics", () => {
    const wrapper = mount(Layout, {
      props: { as: "main", ariaLabel: "Workspace", fill: true },
    });

    expect(wrapper.element.tagName).toBe("MAIN");
    expect(wrapper.attributes("aria-label")).toBe("Workspace");
    expect(wrapper.classes()).toContain("vp-layout--fill");
  });

  it("Ink404 handles continue and retry flows and blocks disabled actions", async () => {
    const wrapper = mount(Ink404, {
      props: { code: "NOT-FOUND", retryable: true },
    });

    expect(wrapper.get(".vp-ink404__code").text()).toBe("NOT-FOUND");
    await wrapper.findAll("button")[0]!.trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["continue"]);
    await wrapper.findAll("button")[1]!.trigger("click");
    expect(wrapper.emitted("retry")).toBeTruthy();

    await wrapper.setProps({ disabled: true });
    await wrapper.findAll("button")[0]!.trigger("click");
    expect(wrapper.emitted("click")).toHaveLength(1);
  });

  it("PropPanel works as a controlled standalone property editor", async () => {
    const wrapper = mount(PropPanel, {
      props: {
        modelValue: { mode: "a", count: 2 },
        fields: [
          {
            key: "mode",
            type: "select",
            options: [{ label: "B", value: "b" }],
          },
          { key: "count", type: "number", min: 0, max: 10 },
        ],
      },
    });

    await wrapper.get("select").setValue("b");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([
      { mode: "b", count: 2 },
    ]);
    expect(wrapper.emitted("change")?.[0]).toEqual([
      { key: "mode", value: "b" },
    ]);
  });

  it.each([
    ["Tech404", Tech404],
    ["Business404", Business404],
    ["Cartoon404", Cartoon404],
    ["Machine404", Machine404],
    ["Pixel404", Pixel404],
    ["Plant404", Plant404],
    ["Space404", Space404],
  ])("%s supports controlled actions and retry", async (_name, component) => {
    const wrapper = mount(component, {
      props: { actions: [{ key: "home", label: "Home" }], retryable: true },
    });

    await wrapper.findAll("button")[0]!.trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["home"]);
    expect(wrapper.emitted("action")?.[0]?.[0]).toMatchObject({ key: "home" });
    await wrapper.findAll("button")[1]!.trigger("click");
    expect(wrapper.emitted("retry")).toBeTruthy();
  });

  it("CardNav exposes rich content, selection and localized empty state", async () => {
    const empty = mount(CardNav);
    expect(empty.get(".vp-card-nav__empty").text().length).toBeGreaterThan(0);

    const wrapper = mount(CardNav, {
      props: {
        items: [
          {
            label: "Overview",
            value: "overview",
            description: "Summary",
            badge: 2,
          },
        ],
      },
    });
    expect(wrapper.get(".vp-card-nav__description").text()).toBe("Summary");
    await wrapper.get("button").trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["overview"]);
  });

  it("FlowLayout supports semantic roots and nowrap layout", () => {
    const wrapper = mount(FlowLayout, {
      props: { as: "ul", wrap: false, ariaLabel: "Actions" },
    });

    expect(wrapper.element.tagName).toBe("UL");
    expect(wrapper.classes()).toContain("vp-flow-layout--nowrap");
    expect(wrapper.attributes("aria-label")).toBe("Actions");
  });

  it("Header exposes semantic root, heading hierarchy and visual states", () => {
    const wrapper = mount(Header, {
      props: {
        as: "div",
        title: "Workspace",
        subtitle: "Overview",
        elevated: true,
        ariaLabel: "Page header",
      },
    });

    expect(wrapper.element.tagName).toBe("DIV");
    expect(wrapper.attributes("role")).toBe("banner");
    expect(wrapper.get(".vp-header__title").text()).toBe("Workspace");
    expect(wrapper.get(".vp-header__subtitle").text()).toBe("Overview");
    expect(wrapper.classes()).toContain("vp-header--elevated");
  });

  it("TelemetryProvider exposes applied config through events and slot state", async () => {
    const wrapper = mount(TelemetryProvider, {
      props: { eager: true, enabled: true, config: { sampleRate: 0.5 } },
      slots: {
        default: ({ enabled }: any) =>
          h("span", { class: "telemetry-state" }, String(enabled)),
      },
    });
    await nextTick();

    expect(wrapper.emitted("applied")).toBeTruthy();
    expect(wrapper.emitted("enabled-change")?.at(-1)).toEqual([true]);
    expect(wrapper.get(".telemetry-state").text()).toBe("true");
    wrapper.unmount();
    expect(wrapper.emitted("restored")).toBeTruthy();
  });

  it("CardGrid renders semantic loading placeholders and scoped layout state", () => {
    const loading = mount(CardGrid, {
      props: { as: "section", loading: true, skeletonCount: 4, ariaLabel: "Cards" },
    });
    expect(loading.findAll(".vp-card-grid__skeleton")).toHaveLength(4);
    expect(loading.attributes("aria-busy")).toBe("true");

    const ready = mount(CardGrid, {
      props: { columns: 2 },
      slots: { default: ({ columns }: any) => h("span", String(columns)) },
    });
    expect(ready.text()).toBe("2");
  });

  it("Center supports semantic wrappers and constrained content width", () => {
    const wrapper = mount(Center, {
      props: { as: "main", contentAs: "span", ariaLabel: "Empty state", maxWidth: "var(--size-content)" },
      slots: { default: () => "Centered" },
    });
    expect(wrapper.element.tagName).toBe("MAIN");
    expect(wrapper.get("span").text()).toBe("Centered");
    expect(wrapper.attributes("aria-label")).toBe("Empty state");
  });

  it("FreeLayoutDrag reports controlled pointer movement and toggle state", async () => {
    const wrapper = mount(FreeLayoutDrag, {
      props: { constrainToParent: false, modelValue: { x: 2, y: 3 } },
    });
    await wrapper.get(".vp-free-layout-drag__header").trigger("pointerdown", {
      button: 0,
      pointerId: 1,
      clientX: 10,
      clientY: 10,
    });
    await wrapper.trigger("pointermove", { pointerId: 1, clientX: 20, clientY: 25 });
    await wrapper.trigger("pointerup", { pointerId: 1, clientX: 20, clientY: 25 });

    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([{ x: 12, y: 18 }]);
    expect(wrapper.emitted("drag-end")).toBeTruthy();
    await wrapper.get("button").trigger("click");
    expect(wrapper.emitted("update:enabled")?.at(-1)).toEqual([false]);
  });

  it("Scrollbar reports boundary transitions and exposes axis semantics", async () => {
    const wrapper = mount(Scrollbar, { props: { axis: "y", ariaLabel: "Results" } });
    const el = wrapper.element as HTMLElement;
    Object.defineProperties(el, {
      clientHeight: { configurable: true, value: 100 },
      scrollHeight: { configurable: true, value: 200 },
      clientWidth: { configurable: true, value: 100 },
      scrollWidth: { configurable: true, value: 100 },
    });
    el.scrollTop = 100;
    await wrapper.trigger("scroll");
    expect(wrapper.emitted("reach-end")).toBeTruthy();
    expect(wrapper.classes()).toContain("vp-scrollbar--axis-y");
  });

  it("SearchFilterPanel synchronizes keyword and debounces controlled searches", async () => {
    vi.useFakeTimers();
    const wrapper = mount(SearchFilterPanel, {
      props: { debounce: 50, keyword: "old", fields: [] },
    });
    await wrapper.get("input").setValue("new");
    expect(wrapper.emitted("update:keyword")?.at(-1)).toEqual(["new"]);
    await vi.advanceTimersByTimeAsync(50);
    expect(wrapper.emitted("search")?.at(-1)?.[0]).toMatchObject({ keyword: "new" });

    await wrapper.setProps({ keyword: "external" });
    expect((wrapper.get("input").element as HTMLInputElement).value).toBe("external");
  });
});

describe("strengthened chart interactions", () => {
  it("BarChart selects a bar and emits normalized item payload", async () => {
    const wrapper = mount(BarChart, {
      props: { data: [{ label: "A", value: 10 }] },
    });

    await wrapper.get(".vp-bar-chart__bar").trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["A"]);
    expect(wrapper.emitted("change")?.[0]?.[0]).toMatchObject({
      label: "A",
      value: 10,
      index: 0,
    });
  });

  it("RadarChart selects points with keyboard and exposes empty state", async () => {
    const empty = mount(RadarChart);
    expect(empty.get(".vp-radar-chart__muted").text().length).toBeGreaterThan(
      0,
    );

    const wrapper = mount(RadarChart, {
      props: {
        data: [
          { label: "A", value: 10 },
          { label: "B", value: 20 },
          { label: "C", value: 30 },
        ],
      },
    });
    await wrapper
      .get(".vp-radar-chart__point")
      .trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["A"]);
  });

  it("GaugeChart mirrors current value and keyboard updates", async () => {
    const wrapper = mount(GaugeChart, {
      props: { modelValue: 42, min: 0, max: 100 },
    });

    expect(wrapper.get('[role="slider"]').attributes("aria-valuenow")).toBe(
      "42",
    );
    await wrapper.get('[role="slider"]').trigger("keydown", { key: "ArrowUp" });
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([43]);
  });

  it("HeatMap selects cells and reports coordinates", async () => {
    const wrapper = mount(HeatMap, {
      props: { data: [1, 2, 3, 4], rows: 2, cols: 2 },
    });

    await wrapper.get(".vp-heat-map__cell").trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["0:0"]);
    expect(wrapper.emitted("change")?.[0]?.[0]).toMatchObject({
      x: 0,
      y: 0,
      value: 1,
      index: 0,
    });
  });

  it("WordCloud selects words and keeps no-data state localized", async () => {
    const empty = mount(WordCloud);
    expect(empty.get(".vp-word-cloud__muted").text().length).toBeGreaterThan(0);

    const wrapper = mount(WordCloud, {
      props: { data: [{ label: "Token", value: 8 }] },
    });
    await wrapper.get(".vp-word-cloud__word").trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["Token"]);
  });

  it("LineChart exposes empty state and keyboard-selectable labeled points", async () => {
    const empty = mount(LineChart);
    expect(empty.get(".vp-line-chart__muted").text().length).toBeGreaterThan(0);

    const wrapper = mount(LineChart, {
      props: { data: [{ label: "August", value: 42 }] },
    });
    await wrapper
      .get(".vp-line-chart__point")
      .trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["August"]);
    expect(wrapper.emitted("change")?.[0]?.[0]).toMatchObject({
      label: "August",
      value: 42,
      index: 0,
    });
  });
});
