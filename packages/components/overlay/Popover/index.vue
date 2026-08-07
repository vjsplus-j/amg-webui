<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  nextTick,
  onUnmounted,
  ref,
  useId,
  watch,
} from "vue";
import { useFloatingPanel, useLocale, useOverlay } from "@amg-webui/hooks";
import { LocaleKeys } from "@amg-webui/locale";
import { trackEmit } from "@amg-webui/telemetry";
import Icon from "@amg-webui/core/Icon/index.vue";
import type { PopoverCloseReason, PopoverEmits, PopoverProps } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<PopoverProps>(), {
  placement: "top",
  trigger: "click",
  dismissible: true,
  disabled: false,
  offset: 8,
  openDelay: 100,
  closeDelay: 120,
  showArrow: true,
  focusOnOpen: false,
  teleportTo: "body",
  telemetry: undefined,
});
const emit = defineEmits<PopoverEmits>();
const { t } = useLocale();
const uid = useId();
const rootRef = ref<HTMLElement | null>(null);
const triggerRef = ref<HTMLElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);
const internalVisible = ref(false);
const instance = getCurrentInstance();
const isControlled = computed(() =>
  Object.prototype.hasOwnProperty.call(instance?.vnode.props ?? {}, "visible"),
);
const isOpen = computed(() =>
  isControlled.value ? Boolean(props.visible) : internalVisible.value,
);
const placementRef = computed(() => props.placement);
const offsetRef = computed(() => props.offset);
const panelId = `${uid}-panel`;

const overlay = useOverlay({
  visible: isOpen,
  kind: "popover",
  container: panelRef,
  modal: false,
  lockScroll: false,
  trapFocus: false,
  closeOnEscape: () => props.dismissible,
  teleportTo: () => props.teleportTo,
  zIndex: () => props.zIndex,
  exclude: () => [rootRef.value, triggerRef.value],
  onEscape: () => close("escape"),
  onClickOutside: () => {
    if (props.dismissible) close("outside");
  },
  autoFocus: false,
});

const zIndexRef = computed(() => overlay.zIndex.value ?? props.zIndex);
let openTimer: ReturnType<typeof setTimeout> | null = null;
let closeTimer: ReturnType<typeof setTimeout> | null = null;

const { panelStyle, actualPlacement } = useFloatingPanel(
  triggerRef,
  panelRef,
  isOpen,
  placementRef,
  { offset: offsetRef, zIndex: zIndexRef },
);

const rootClass = computed(() => [
  "vp-popover",
  { "vp-popover--open": isOpen.value, "vp-popover--disabled": props.disabled },
  props.class,
]);

function clearTimers() {
  if (openTimer) clearTimeout(openTimer);
  if (closeTimer) clearTimeout(closeTimer);
  openTimer = null;
  closeTimer = null;
}

function setOpen(value: boolean, event?: Event, reason?: PopoverCloseReason) {
  if (props.disabled && value) return;
  if (!isControlled.value) internalVisible.value = value;
  emit("update:visible", value);
  emit("openChange", value, reason);
  trackEmit({
    component: "Popover",
    type: value ? "open" : "close",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { placement: actualPlacement.value, reason },
  });
  if (value) emit("open", event);
  else emit("close", reason ?? "programmatic", event);
}

function open(event?: Event, delayed = false) {
  if (props.disabled || props.trigger === "manual") return;
  if (closeTimer) clearTimeout(closeTimer);
  if (isOpen.value) return;
  if (delayed && props.openDelay > 0) {
    openTimer = setTimeout(() => setOpen(true, event), props.openDelay);
  } else setOpen(true, event);
}

function close(
  reason: PopoverCloseReason = "programmatic",
  event?: Event,
  delayed = false,
) {
  if (openTimer) clearTimeout(openTimer);
  if (!isOpen.value) return;
  if (delayed && props.closeDelay > 0) {
    closeTimer = setTimeout(
      () => setOpen(false, event, reason),
      props.closeDelay,
    );
  } else setOpen(false, event, reason);
}

function toggle(event: Event) {
  if (isOpen.value) close("toggle", event);
  else open(event);
}

function onTriggerClick(event: MouseEvent) {
  if (props.trigger === "click") toggle(event);
}

function onTriggerKeydown(event: KeyboardEvent) {
  if (props.trigger === "manual") return;
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    toggle(event);
  } else if (event.key === "ArrowDown" && !isOpen.value) {
    event.preventDefault();
    open(event);
  }
}

watch(isOpen, (value) => {
  if (value && props.focusOnOpen) {
    void nextTick(() => {
      const focusable = panelRef.value?.querySelector<HTMLElement>(
        'button:not([disabled]),a[href],input:not([disabled]),[tabindex]:not([tabindex="-1"])',
      );
      (focusable ?? panelRef.value)?.focus();
    });
  }
});

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled && isOpen.value) close("programmatic");
  },
);

onUnmounted(() => {
  clearTimers();
});
</script>

<template>
  <span ref="rootRef" :class="rootClass" :style="style">
    <span
      ref="triggerRef"
      class="vp-popover__trigger"
      :class="{ 'vp-popover__trigger--disabled': disabled }"
      :tabindex="disabled || trigger === 'manual' ? undefined : 0"
      :aria-expanded="isOpen"
      :aria-controls="isOpen ? panelId : undefined"
      aria-haspopup="dialog"
      @click="onTriggerClick"
      @keydown="onTriggerKeydown"
      @mouseenter="trigger === 'hover' && open($event, true)"
      @mouseleave="trigger === 'hover' && close('blur', $event, true)"
      @focusin="trigger === 'focus' && open($event)"
      @focusout="trigger === 'focus' && close('blur', $event, true)"
    >
      <slot name="trigger" :open="isOpen" />
    </span>
    <Teleport :to="overlay.teleportTo.value ?? 'body'">
      <Transition name="vp-popover">
        <section
          v-if="isOpen"
          :id="panelId"
          ref="panelRef"
          :class="[
            'vp-popover__panel',
            `vp-popover__panel--${actualPlacement}`,
          ]"
          :style="panelStyle"
          role="dialog"
          :aria-label="ariaLabel || title || undefined"
          tabindex="-1"
          data-component="Popover"
          @click.stop
          @mouseenter="trigger === 'hover' && clearTimers()"
          @mouseleave="trigger === 'hover' && close('blur', $event, true)"
        >
          <span v-if="showArrow" class="vp-popover__arrow" aria-hidden="true" />
          <header v-if="title || $slots.title" class="vp-popover__header">
            <slot name="title">{{ title }}</slot>
          </header>
          <div class="vp-popover__content"><slot :close="close" /></div>
          <button
            v-if="dismissible"
            type="button"
            class="vp-popover__close"
            :aria-label="t(LocaleKeys.common.close)"
            @click="close('programmatic', $event)"
          >
            <Icon name="X" size="sm" />
          </button>
        </section>
      </Transition>
    </Teleport>
  </span>
</template>
