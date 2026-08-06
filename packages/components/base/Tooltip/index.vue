<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  ref,
  useId,
  watch,
} from "vue";
import { useFloatingPanel } from "@amg-webui/hooks";
import { trackEmit } from "@amg-webui/telemetry";
import type { TooltipEmits, TooltipProps, TooltipTrigger } from "./types";
import { useTooltipTimers } from "./useTooltip";
import "./style.scss";
const props = withDefaults(defineProps<TooltipProps>(), {
  placement: "top",
  trigger: "hover",
  disabled: false,
  openDelay: 100,
  closeDelay: 100,
  offset: 8,
  showArrow: true,
  enterable: false,
  teleportTo: "body",
  telemetry: undefined,
});
const emit = defineEmits<TooltipEmits>();
const uid = useId();
const panelId = `${uid}-tooltip`;
const instance = getCurrentInstance();
const triggerRef = ref<HTMLElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);
const internalVisible = ref(false);
const controlled = computed(() =>
  Object.prototype.hasOwnProperty.call(instance?.vnode.props ?? {}, "visible"),
);
const isOpen = computed(() =>
  controlled.value ? Boolean(props.visible) : internalVisible.value,
);
const triggers = computed<TooltipTrigger[]>(() =>
  Array.isArray(props.trigger) ? props.trigger : [props.trigger],
);
const placementRef = computed(() => props.placement);
const offsetRef = computed(() => props.offset);
const zIndexRef = computed(() => props.zIndex);
const openDelay = computed(() => props.delay ?? props.openDelay);
const { panelStyle, actualPlacement } = useFloatingPanel(
  triggerRef,
  panelRef,
  isOpen,
  placementRef,
  { offset: offsetRef, zIndex: zIndexRef },
);
const { clear, clearClose, scheduleOpen, scheduleClose } = useTooltipTimers();
function has(trigger: TooltipTrigger) {
  return triggers.value.includes(trigger);
}
function setOpen(
  value: boolean,
  event?: Event,
  reason: Parameters<TooltipEmits>[0] extends never
    ? never
    : | "blur"
      | "outside"
      | "escape"
      | "toggle"
      | "disabled"
      | "manual" = "manual",
) {
  if (value && props.disabled) return;
  if (!controlled.value) internalVisible.value = value;
  emit("update:visible", value);
  emit("visibleChange", value);
  if (value) emit("show", event);
  else emit("hide", reason, event);
  trackEmit({
    component: "Tooltip",
    type: value ? "show" : "hide",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { placement: actualPlacement.value, reason },
  });
}
function open(event?: Event, delayed = true) {
  if (props.disabled || has("manual") || isOpen.value) return;
  scheduleOpen(() => setOpen(true, event), delayed ? openDelay.value : 0);
}
function close(
  reason:
    "blur" | "outside" | "escape" | "toggle" | "disabled" | "manual" = "manual",
  event?: Event,
  delayed = true,
) {
  if (!isOpen.value && !controlled.value) {
    clear();
    return;
  }
  scheduleClose(
    () => setOpen(false, event, reason),
    delayed ? props.closeDelay : 0,
  );
}
function toggle(event: Event) {
  isOpen.value ? close("toggle", event, false) : open(event, false);
}
function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && isOpen.value) {
    event.preventDefault();
    close("escape", event, false);
  } else if ((event.key === "Enter" || event.key === " ") && has("click")) {
    event.preventDefault();
    toggle(event);
  }
}
function onDocumentPointer(event: Event) {
  if (
    isOpen.value &&
    has("click") &&
    !triggerRef.value?.contains(event.target as Node) &&
    !panelRef.value?.contains(event.target as Node)
  )
    close("outside", event, false);
}
watch(
  () => props.disabled,
  (disabled) => {
    if (disabled && isOpen.value) close("disabled", undefined, false);
  },
);
onMounted(() => {
  document.addEventListener("pointerdown", onDocumentPointer, true);
  document.addEventListener("keydown", onKeydown);
});
onUnmounted(() => {
  document.removeEventListener("pointerdown", onDocumentPointer, true);
  document.removeEventListener("keydown", onKeydown);
});
</script>
<template>
  <span :class="['vp-tooltip-trigger', props.class]" :style="style"
    ><span
      ref="triggerRef"
      class="vp-tooltip-trigger__target"
      :tabindex="has('focus') || has('click') ? 0 : undefined"
      :aria-describedby="isOpen ? panelId : undefined"
      :aria-expanded="has('click') ? isOpen : undefined"
      @mouseenter="has('hover') && open($event)"
      @mouseleave="has('hover') && close('blur', $event)"
      @focusin="has('focus') && open($event, false)"
      @focusout="has('focus') && close('blur', $event)"
      @click="has('click') && toggle($event)"
      @keydown="onKeydown"
      ><slot :visible="isOpen"
    /></span>
    <Teleport :to="teleportTo"
      ><Transition name="vp-tooltip-fade"
        ><span
          v-if="isOpen && (content || $slots.content)"
          :id="panelId"
          ref="panelRef"
          :class="[
            'vp-tooltip',
            `vp-tooltip--${actualPlacement}`,
            popperClass,
            { 'vp-tooltip--enterable': enterable },
          ]"
          :style="[panelStyle, maxWidth ? { maxWidth } : undefined]"
          role="tooltip"
          data-component="Tooltip"
          @mouseenter="enterable && clearClose()"
          @mouseleave="enterable && close('blur', $event)"
          ><span class="vp-tooltip__content"
            ><slot name="content">{{ content }}</slot></span
          ><span
            v-if="showArrow"
            class="vp-tooltip__arrow"
            aria-hidden="true" /></span></Transition
    ></Teleport>
  </span>
</template>
