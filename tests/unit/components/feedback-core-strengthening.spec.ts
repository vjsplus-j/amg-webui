import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import Drawer from "../../../packages/components/overlay/Drawer/index.vue";
import ErrorModal from "../../../packages/components/overlay/ErrorModal/index.vue";
import Exception from "../../../packages/components/core/Exception/index.vue";
import Message from "../../../packages/components/overlay/Message/index.vue";
import Popconfirm from "../../../packages/components/core/Popconfirm/index.vue";
import Popover from "../../../packages/components/overlay/Popover/index.vue";
import Toast from "../../../packages/components/overlay/Toast/index.vue";
import Button from "../../../packages/components/core/Button/index.vue";

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = "";
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
});

describe("feedback overlay core", () => {
  it("keeps a status modal open when its async confirm guard rejects the close", async () => {
    const beforeConfirm = vi.fn(async () => false);
    const wrapper = mount(ErrorModal, {
      props: { visible: true, title: "Failure", beforeConfirm },
      attachTo: document.body,
    });

    await document.body
      .querySelector<HTMLButtonElement>(".vp-button--solid")
      ?.click();
    await flushPromises();

    expect(beforeConfirm).toHaveBeenCalledOnce();
    expect(wrapper.emitted("confirm")).toBeUndefined();
    expect(wrapper.emitted("update:visible")).toBeUndefined();
    wrapper.unmount();
  });

  it("locks scroll for a drawer and reports escape as its close reason", async () => {
    const wrapper = mount(Drawer, {
      props: { visible: true, title: "Details" },
      attachTo: document.body,
    });
    await flushPromises();
    expect(document.documentElement.style.overflow).toBe("hidden");

    document.body
      .querySelector<HTMLElement>(".vp-drawer")
      ?.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
    await flushPromises();
    expect(wrapper.emitted("close")?.[0]?.[1]).toBe("escape");
    wrapper.unmount();
    expect(document.documentElement.style.overflow).toBe("");
  });

  it("opens an uncontrolled popover and computes a fixed panel position", async () => {
    mount(Popover, {
      slots: { trigger: "<button>More</button>", default: "Content" },
      attachTo: document.body,
    });
    document.body.querySelector<HTMLElement>(".vp-popover__trigger")?.click();
    await flushPromises();

    const panel =
      document.body.querySelector<HTMLElement>(".vp-popover__panel");
    expect(panel).not.toBeNull();
    expect(panel?.style.position).toBe("fixed");
    expect(panel?.getAttribute("role")).toBe("dialog");
  });

  it("waits for popconfirm beforeConfirm before emitting confirm", async () => {
    const beforeConfirm = vi.fn(async () => false);
    const wrapper = mount(Popconfirm, {
      props: { title: "Delete?", beforeConfirm },
      slots: { trigger: "<button>Delete</button>" },
      attachTo: document.body,
    });
    document.body
      .querySelector<HTMLElement>(".vp-popconfirm__trigger")
      ?.click();
    await flushPromises();
    const buttons = wrapper.findAllComponents(Button);
    buttons[buttons.length - 1].vm.$emit("click", new MouseEvent("click"));
    await flushPromises();
    expect(beforeConfirm).toHaveBeenCalledOnce();
    expect(wrapper.emitted("confirm")).toBeUndefined();
    wrapper.unmount();
  });

  it("pauses an auto-hide message while hovered", async () => {
    vi.useFakeTimers();
    const wrapper = mount(Message, {
      props: { autoHide: true, hideDelay: 1000, text: "Saved" },
    });
    await wrapper.find(".vp-message").trigger("mouseenter");
    vi.advanceTimersByTime(1500);
    expect(wrapper.emitted("close")).toBeUndefined();
    await wrapper.find(".vp-message").trigger("mouseleave");
    vi.advanceTimersByTime(1000);
    expect(wrapper.emitted("close")?.[0]?.[0]).toBe("timeout");
  });

  it("emits a timeout reason from toast and exposes exception secondary actions", async () => {
    vi.useFakeTimers();
    const toast = mount(Toast, {
      props: { duration: 100, message: "Done", teleport: false },
    });
    vi.advanceTimersByTime(100);
    expect(toast.emitted("close")?.[0]?.[0]).toBe("timeout");

    const exception = mount(Exception, {
      props: { secondaryActionText: "Back" },
    });
    await exception.findAll("button")[1].trigger("click");
    expect(exception.emitted("secondaryAction")).toHaveLength(1);
  });
});
