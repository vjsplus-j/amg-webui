import { nextTick, onUnmounted, ref, watch, type Ref } from "vue";
import {
  getFloatingPanelStyle,
  type FloatingPlacement,
} from "@amg-webui/utils/domPanel";
import { getWindow } from "@amg-webui/utils/env";

export function useFloatingPanel(
  trigger: Ref<HTMLElement | null | undefined>,
  panel: Ref<HTMLElement | null | undefined>,
  visible: Ref<boolean>,
  placement: Ref<FloatingPlacement>,
  options?: {
    offset?: Ref<number>;
    zIndex?: Ref<number | undefined>;
    matchTriggerWidth?: Ref<boolean>;
  },
) {
  const panelStyle = ref<Record<string, string>>({});
  const actualPlacement = ref<FloatingPlacement>(placement.value);
  let observer: ResizeObserver | null = null;

  function update() {
    if (!visible.value || !trigger.value) return;
    const result = getFloatingPanelStyle(trigger.value, panel.value ?? null, {
      placement: placement.value,
      offset: options?.offset?.value,
      zIndex: options?.zIndex?.value,
      matchTriggerWidth: options?.matchTriggerWidth?.value,
    });
    panelStyle.value = result.style;
    actualPlacement.value = result.placement;
  }

  function teardown() {
    const win = getWindow();
    win?.removeEventListener("scroll", update, true);
    win?.removeEventListener("resize", update);
    observer?.disconnect();
    observer = null;
  }

  function setup() {
    teardown();
    const win = getWindow();
    win?.addEventListener("scroll", update, true);
    win?.addEventListener("resize", update);
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(update);
      if (trigger.value) observer.observe(trigger.value);
      if (panel.value) observer.observe(panel.value);
    }
  }

  watch(
    [
      visible,
      placement,
      options?.offset ?? ref(8),
      options?.zIndex ?? ref(undefined),
    ],
    ([open]) => {
      if (!open) {
        teardown();
        return;
      }
      void nextTick(() => {
        update();
        setup();
      });
    },
    { immediate: true },
  );

  onUnmounted(teardown);
  return { panelStyle, actualPlacement, update };
}
