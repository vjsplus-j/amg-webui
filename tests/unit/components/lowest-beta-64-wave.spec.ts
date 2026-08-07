import { nextTick } from "vue";
import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import GbsAlarmModal from "../../../packages/components/industry/GbsAlarmModal/index.vue";
import PieChart from "../../../packages/components/base/PieChart/index.vue";
import TableDrag from "../../../packages/components/base/TableDrag/index.vue";
import TimelineList from "../../../packages/components/base/TimelineList/index.vue";
import VideoSnapshot from "../../../packages/components/industry/VideoSnapshot/index.vue";
import Watermark from "../../../packages/components/base/Watermark/index.vue";

describe("lowest beta score-64 wave behavior", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  });

  it("traps a GBS alarm in an accessible dialog and reports close reasons", async () => {
    const wrapper = mount(GbsAlarmModal, {
      attachTo: document.body,
      props: {
        open: true,
        alarm: {
          id: "alarm-1",
          deviceName: "IPC-01",
          channelName: "CH-01",
          severity: "critical",
          time: "2026-08-05 10:00:00",
        },
      },
    });
    await nextTick();
    const dialog = document.querySelector('[role="alertdialog"]');
    expect(dialog?.textContent).toContain("IPC-01");
    dialog?.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await nextTick();
    expect(wrapper.emitted("close")?.[0]).toEqual(["escape"]);
    expect(wrapper.emitted("update:open")?.[0]).toEqual([false]);
    wrapper.unmount();
  });

  it("renders real pie geometry and selects slices from the keyboard", async () => {
    expect(mount(PieChart).findAll("path")).toHaveLength(0);
    const wrapper = mount(PieChart, {
      props: {
        innerRadius: 28,
        data: [
          { key: "a", label: "A", value: 30 },
          { key: "b", label: "B", value: 70 },
        ],
      },
    });
    const slices = wrapper.findAll("path");
    expect(slices).toHaveLength(2);
    expect(slices[0].attributes("d")).toContain("A 64 64");
    await slices[0].trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["a"]);
    expect(wrapper.emitted("sliceClick")?.[0]?.[0]).toMatchObject({
      value: 30,
    });
  });

  it("keeps TableDrag controlled and supports accessible keyboard reordering", async () => {
    const wrapper = mount(TableDrag, {
      props: {
        rowKey: "id",
        columns: [{ field: "name", header: "Name" }],
        rows: [
          { id: 1, name: "One" },
          { id: 2, name: "Two" },
          { id: 3, name: "Locked" },
        ],
        rowDisabled: (_row, index) => index === 2,
      },
    });
    await wrapper
      .findAll(".vp-table-drag__handle")[0]
      .trigger("keydown", { key: "ArrowDown" });
    expect(wrapper.emitted("update:modelValue")?.[0]?.[0]).toEqual([
      { id: 2, name: "Two" },
      { id: 1, name: "One" },
      { id: 3, name: "Locked" },
    ]);
    expect(wrapper.emitted("reorder")?.[0]?.slice(2)).toEqual([0, 1]);
    expect(
      wrapper.findAll(".vp-table-drag__handle")[2].attributes("disabled"),
    ).toBeDefined();
  });

  it("selects, groups and collapses TimelineList entries", async () => {
    const wrapper = mount(TimelineList, {
      props: {
        collapsible: true,
        items: [
          {
            id: "a",
            title: "Created",
            time: "2026-08-05 09:00",
            status: "success",
          },
          {
            id: "b",
            title: "Reviewed",
            time: "2026-08-05 10:00",
            status: "warning",
          },
        ],
      },
    });
    const item = wrapper.find(".vp-timeline-list__item");
    await item.trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["a"]);
    await wrapper.find(".vp-timeline-list__group-toggle").trigger("click");
    expect(wrapper.emitted("groupToggle")?.[0]).toEqual(["2026-08-05", false]);
    expect(
      wrapper.find(".vp-timeline-list__items").attributes("style"),
    ).toContain("display: none");
  });

  it("emits an explicit VideoSnapshot error and returns capture metadata", async () => {
    const missing = mount(VideoSnapshot);
    await missing.find(".vp-video-snapshot__button").trigger("click");
    expect(missing.emitted("error")?.[0]?.[0]).toMatchObject({
      code: "VIDEO_NOT_READY",
    });

    const context = { drawImage: vi.fn() };
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      context as unknown as CanvasRenderingContext2D,
    );
    vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue(
      "data:image/png;base64,AA==",
    );
    const video = document.createElement("video");
    Object.defineProperties(video, {
      readyState: { configurable: true, value: 2 },
      videoWidth: { configurable: true, value: 640 },
      videoHeight: { configurable: true, value: 360 },
    });
    const wrapper = mount(VideoSnapshot, {
      props: { videoRef: video, maxWidth: 320 },
    });
    await wrapper.find(".vp-video-snapshot__button").trigger("click");
    const result = wrapper.emitted("capture")?.[0]?.[1] as {
      width: number;
      height: number;
      blob: Blob;
    };
    expect(result).toMatchObject({ width: 320, height: 180 });
    expect(result.blob).toBeInstanceOf(Blob);
  });

  it("renders Watermark patterns only from supplied content", async () => {
    const context = {
      font: "",
      globalAlpha: 1,
      fillStyle: "",
      textAlign: "start",
      textBaseline: "alphabetic",
      measureText: vi.fn(() => ({ width: 64 })),
      scale: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      fillText: vi.fn(),
      drawImage: vi.fn(),
    };
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      context as unknown as CanvasRenderingContext2D,
    );
    vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue(
      "data:image/png;base64,AA==",
    );

    const empty = mount(Watermark);
    await nextTick();
    expect(empty.emitted("render")).toBeUndefined();

    const wrapper = mount(Watermark, {
      props: { content: ["AMG", "Internal"], gap: [24, 20] },
    });
    await nextTick();
    await nextTick();
    expect(wrapper.emitted("render")?.[0]?.[0]).toBe(
      "data:image/png;base64,AA==",
    );
    expect(context.fillText).toHaveBeenCalledTimes(2);
  });
});
