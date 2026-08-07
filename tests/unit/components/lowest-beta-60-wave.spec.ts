import { nextTick } from "vue";
import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import DragMaterial from "../../../packages/lowcode/ui/DragMaterial/index.vue";
import Loading from "../../../packages/components/core/Loading/index.vue";
import OcrScan from "../../../packages/components/core/OcrScan/index.vue";
import Rate from "../../../packages/components/form/Rate/index.vue";
import StackLayout from "../../../packages/components/core/StackLayout/index.vue";
import Waterfall from "../../../packages/components/data/Waterfall/index.vue";

describe("lowest beta score-60 wave behavior", () => {
  afterEach(() => {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
    document.body.innerHTML = "";
  });

  it("keeps DragMaterial empty by default and supports search and keyboard pick", async () => {
    expect(mount(DragMaterial).findAll('[role="option"]')).toHaveLength(0);
    const wrapper = mount(DragMaterial, {
      props: {
        materials: [
          { type: "button", label: "Button", group: "base" },
          { type: "card", label: "Card", group: "layout" },
        ],
      },
    });

    await wrapper.find('input[type="search"]').setValue("card");
    expect(wrapper.emitted("update:filter")?.at(-1)).toEqual(["card"]);
    expect(wrapper.findAll('[role="option"]')).toHaveLength(1);
    await wrapper.find('[role="option"]').trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("pick")?.[0]?.[0]).toMatchObject({ type: "card" });
  });

  it("locks fullscreen loading, reports progress and exposes cancellation", async () => {
    const wrapper = mount(Loading, {
      attachTo: document.body,
      props: { fullscreen: true, progress: 125, cancellable: true },
    });
    await nextTick();

    expect(document.documentElement.style.overflow).toBe("hidden");
    expect(
      document
        .querySelector('[role="progressbar"]')
        ?.getAttribute("aria-valuenow"),
    ).toBe("100");
    (
      document.querySelector(".vp-loading__cancel") as HTMLButtonElement
    ).click();
    await nextTick();
    expect(wrapper.emitted("cancel")).toHaveLength(1);
    expect(wrapper.emitted("update:visible")?.[0]).toEqual([false]);

    wrapper.unmount();
    expect(document.documentElement.style.overflow).toBe("");
  });

  it("rejects invalid OCR files instead of fabricating recognition text", async () => {
    const wrapper = mount(OcrScan, { props: { maxFileSize: 1 } });
    const input = wrapper.find('input[type="file"]');
    const oversized = new File(["too large"], "scan.png", {
      type: "image/png",
    });
    Object.defineProperty(input.element, "files", {
      configurable: true,
      value: [oversized],
    });
    await input.trigger("change");

    expect((wrapper.emitted("error")?.[0]?.[0] as Error).message).toContain(
      "maxFileSize",
    );
    expect(wrapper.emitted("scan")).toBeUndefined();
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("supports Rate keyboard steps while readonly mode stays inert", async () => {
    const wrapper = mount(Rate, {
      props: {
        modelValue: 2,
        allowHalf: true,
        clearable: true,
        showScore: true,
      },
    });
    await wrapper.trigger("keydown", { key: "ArrowRight" });
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([2.5]);

    const readonly = mount(Rate, { props: { modelValue: 2, readonly: true } });
    await readonly.trigger("keydown", { key: "ArrowRight" });
    await readonly.find("button").trigger("click");
    expect(readonly.emitted("update:modelValue")).toBeUndefined();
    expect(readonly.find("button").attributes("disabled")).toBeDefined();
  });

  it("uses semantic StackLayout hosts with reverse and divider contracts", () => {
    const wrapper = mount(StackLayout, {
      props: {
        as: "section",
        direction: "horizontal",
        gap: "lg",
        reverse: true,
        divider: true,
        ariaLabel: "Actions",
      },
      slots: { default: "<span>A</span><span>B</span>" },
    });

    expect(wrapper.element.tagName).toBe("SECTION");
    expect(wrapper.classes()).toContain("vp-stack-layout--reverse");
    expect(wrapper.classes()).toContain("vp-stack-layout--divider");
    expect(wrapper.attributes("style")).toContain("var(--spacing-lg)");
    expect(wrapper.attributes("aria-label")).toBe("Actions");
  });

  it("balances Waterfall by real height hints and emits keyboard selection", async () => {
    const wrapper = mount(Waterfall, {
      props: {
        columns: 2,
        items: [
          { id: "a", title: "A", height: 100 },
          { id: "b", title: "B", height: 20 },
          { id: "c", title: "C", height: 80 },
        ],
      },
    });
    const columns = wrapper.findAll(".vp-waterfall__column");
    expect(columns[0].findAll(".vp-waterfall__card")).toHaveLength(1);
    expect(columns[1].findAll(".vp-waterfall__card")).toHaveLength(2);

    await columns[1].find(".vp-waterfall__card").trigger("keydown", {
      key: " ",
    });
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["b"]);
    expect(wrapper.emitted("itemClick")?.[0]?.[0]).toMatchObject({ id: "b" });
  });
});
