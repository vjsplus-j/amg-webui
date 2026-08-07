<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  nextTick,
  ref,
  useId,
  watch,
} from "vue";
import { useFloatingPanel, useLocale, useOverlay } from "@amg-webui/hooks";
import { LocaleKeys } from "@amg-webui/locale";
import { trackEmit } from "@amg-webui/telemetry";
import Button from '@amg-webui/core/Button/index.vue';
import Icon from '@amg-webui/core/Icon/index.vue';
import type {
  PopconfirmCloseReason,
  PopconfirmEmits,
  PopconfirmProps,
} from "./types";
import "./style.scss";

const props = withDefaults(defineProps<PopconfirmProps>(), {
  placement: "top",
  dismissible: true,
  disabled: false,
  confirmLabel: "",
  cancelLabel: "",
  severity: "warning",
  loading: false,
  showIcon: true,
  offset: 8,
  teleportTo: "body",
  telemetry: undefined,
});
const emit = defineEmits<PopconfirmEmits>();
const { t } = useLocale();
const uid = useId();
const rootRef = ref<HTMLElement | null>(null);
const triggerRef = ref<HTMLElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);
const confirmRef = ref<{ $el?: HTMLElement } | null>(null);
const internalVisible = ref(false);
const pending = ref<"confirm" | "cancel" | null>(null);
const instance = getCurrentInstance();
const isControlled = computed(() =>
  Object.prototype.hasOwnProperty.call(instance?.vnode.props ?? {}, "visible"),
);
const isOpen = computed(() =>
  isControlled.value ? Boolean(props.visible) : internalVisible.value,
);
const placementRef = computed(() => props.placement);
const offsetRef = computed(() => props.offset);
const descriptionId = `${uid}-description`;

const overlay = useOverlay({
  visible: isOpen,
  kind: "popover",
  container: panelRef,
  modal: false,
  lockScroll: false,
  trapFocus: true,
  restoreFocus: true,
  closeOnEscape: () => props.dismissible,
  teleportTo: () => props.teleportTo,
  zIndex: () => props.zIndex,
  exclude: () => [rootRef.value, triggerRef.value],
  onEscape: () => {
    if (props.dismissible) void cancel("escape");
  },
  onClickOutside: () => {
    if (props.dismissible) void cancel("outside");
  },
  autoFocus: false,
});

const zIndexRef = computed(() => overlay.zIndex.value ?? props.zIndex);
const { panelStyle, actualPlacement } = useFloatingPanel(
  triggerRef,
  panelRef,
  isOpen,
  placementRef,
  { offset: offsetRef, zIndex: zIndexRef },
);

const confirmText = computed(
  () => props.confirmLabel || t(LocaleKeys.button.confirm),
);
const cancelText = computed(
  () => props.cancelLabel || t(LocaleKeys.button.cancel),
);
const busy = computed(() => props.loading || pending.value !== null);
const rootClass = computed(() => [
  "vp-popconfirm",
  {
    "vp-popconfirm--open": isOpen.value,
    "vp-popconfirm--disabled": props.disabled,
  },
  props.class,
]);

const iconName = computed(() => {
  if (props.severity === "danger") return "CircleAlert";
  if (props.severity === "success") return "CircleCheck";
  if (props.severity === "info") return "Info";
  return "TriangleAlert";
});

function setOpen(value: boolean, reason?: PopconfirmCloseReason) {
  if (!isControlled.value) internalVisible.value = value;
  emit("update:visible", value);
  emit("openChange", value, reason);
}

function open(event?: Event) {
  if (props.disabled || isOpen.value) return;
  setOpen(true);
  trackEmit({
    component: "Popconfirm",
    type: "open",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { placement: actualPlacement.value, trigger: event?.type },
  });
}

async function canRun(
  action: "confirm" | "cancel",
  task: (() => boolean | Promise<boolean>) | undefined,
) {
  if (!task) return true;
  try {
    return (await task()) !== false;
  } catch (error) {
    emit("error", error, action);
    return false;
  }
}

async function cancel(reason: PopconfirmCloseReason = "cancel", event?: Event) {
  if (!isOpen.value || busy.value) return;
  pending.value = "cancel";
  try {
    if (
      !(await canRun("cancel", () =>
        props.beforeCancel ? props.beforeCancel(reason, event) : true,
      ))
    )
      return;
    setOpen(false, reason);
    trackEmit({
      component: "Popconfirm",
      type: "cancel",
      trackId: props.trackId,
      telemetry: props.telemetry,
      payload: { reason },
    });
    emit("cancel", event ?? new Event(reason), reason);
  } finally {
    pending.value = null;
  }
}

async function confirm(event: MouseEvent) {
  if (busy.value) return;
  pending.value = "confirm";
  try {
    if (
      !(await canRun("confirm", () =>
        props.beforeConfirm ? props.beforeConfirm(event) : true,
      ))
    )
      return;
    setOpen(false);
    trackEmit({
      component: "Popconfirm",
      type: "confirm",
      trackId: props.trackId,
      telemetry: props.telemetry,
    });
    emit("confirm", event);
  } finally {
    pending.value = null;
  }
}

function onTriggerKeydown(event: KeyboardEvent) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    open(event);
  }
}

watch(isOpen, (value) => {
  if (!value) return;
  void nextTick(() => {
    const element = confirmRef.value?.$el;
    if (element instanceof HTMLElement) element.focus();
    else panelRef.value?.focus();
  });
});

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled && isOpen.value) void cancel("programmatic");
  },
);
</script>

<template>
  <span ref="rootRef" :class="rootClass" :style="style">
    <span
      ref="triggerRef"
      class="vp-popconfirm__trigger"
      role="button"
      :tabindex="disabled ? undefined : 0"
      :aria-expanded="isOpen"
      :aria-controls="isOpen ? overlay.titleId : undefined"
      :aria-label="title || t(LocaleKeys.component.popconfirm.aria)"
      aria-haspopup="dialog"
      @click="open"
      @keydown="onTriggerKeydown"
    >
      <slot name="trigger" :open="isOpen" />
    </span>
    <Teleport :to="overlay.teleportTo.value ?? 'body'">
      <Transition name="vp-popconfirm">
        <section
          v-if="isOpen"
          ref="panelRef"
          :class="[
            'vp-popconfirm__panel',
            `vp-popconfirm__panel--${actualPlacement}`,
            `vp-popconfirm__panel--${severity}`,
          ]"
          :style="panelStyle"
          role="alertdialog"
          :aria-labelledby="overlay.titleId"
          :aria-describedby="description ? descriptionId : undefined"
          :aria-busy="busy || undefined"
          tabindex="-1"
          data-component="Popconfirm"
          @click.stop
        >
          <div class="vp-popconfirm__content">
            <span
              v-if="showIcon"
              class="vp-popconfirm__icon"
              aria-hidden="true"
            >
              <Icon :name="iconName" size="md" />
            </span>
            <div class="vp-popconfirm__copy">
              <p :id="overlay.titleId" class="vp-popconfirm__title">
                <slot>{{ title }}</slot>
              </p>
              <p
                v-if="description"
                :id="descriptionId"
                class="vp-popconfirm__description"
              >
                {{ description }}
              </p>
            </div>
          </div>
          <div class="vp-popconfirm__actions">
            <Button
              variant="outline"
              severity="secondary"
              size="sm"
              :disabled="busy"
              @click="cancel('cancel', $event)"
            >
              {{ cancelText }}
            </Button>
            <Button
              ref="confirmRef"
              variant="solid"
              :severity="
                severity === 'danger'
                  ? 'danger'
                  : severity === 'warning'
                    ? 'warning'
                    : 'primary'
              "
              size="sm"
              :loading="pending === 'confirm' || loading"
              :disabled="busy"
              @click="confirm"
            >
              {{ confirmText }}
            </Button>
          </div>
        </section>
      </Transition>
    </Teleport>
  </span>
</template>
