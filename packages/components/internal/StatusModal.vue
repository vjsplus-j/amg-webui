<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { useLocale, useOverlay } from "@amg-webui/hooks";
import { LocaleKeys } from "@amg-webui/locale";
import { trackEmit } from "@amg-webui/telemetry";
import Icon from '@amg-webui/core/Icon/index.vue';
import Button from '@amg-webui/core/Button/index.vue';
import type {
  StatusModalAction,
  StatusModalCloseReason,
  StatusModalEmits,
  StatusModalProps,
} from "./statusModal";
import "./status-modal.scss";

const props = withDefaults(defineProps<StatusModalProps>(), {
  visible: false,
  severity: "info",
  closable: true,
  dismissible: true,
  closeOnClickOverlay: undefined,
  closeOnPressEscape: undefined,
  lockScroll: true,
  showCancel: true,
  confirmLabel: "",
  cancelLabel: "",
  loading: false,
  teleportTo: "body",
  initialFocus: "confirm",
  telemetry: undefined,
});

const emit = defineEmits<StatusModalEmits>();
const { t } = useLocale();
const dialogRef = ref<HTMLElement | null>(null);
const confirmRef = ref<{ $el?: HTMLElement } | null>(null);
const cancelRef = ref<{ $el?: HTMLElement } | null>(null);
const pending = ref<StatusModalAction | null>(null);
const visibleRef = computed(() => props.visible);
const closeOnEscape = computed(
  () => props.closeOnPressEscape ?? props.dismissible,
);

const overlay = useOverlay({
  visible: visibleRef,
  kind: "modal",
  container: dialogRef,
  modal: true,
  lockScroll: () => props.lockScroll,
  trapFocus: true,
  restoreFocus: true,
  closeOnEscape,
  zIndex: () => props.zIndex,
  teleportTo: () => props.teleportTo,
  autoFocus: false,
  onEscape: () => {
    if (closeOnEscape.value) void requestClose("escape");
  },
});

const titleId = overlay.titleId;
const descriptionId = `${titleId}-description`;
const confirmText = computed(
  () => props.confirmLabel || t(LocaleKeys.button.confirm),
);
const cancelText = computed(
  () => props.cancelLabel || t(LocaleKeys.button.cancel),
);
const closeLabel = computed(() => t(LocaleKeys.common.close));
const closeOnOverlay = computed(
  () => props.closeOnClickOverlay ?? props.dismissible,
);
const busy = computed(() => props.loading || pending.value !== null);

const iconName = computed(() => {
  if (props.severity === "success") return "CircleCheck";
  if (props.severity === "warning") return "TriangleAlert";
  if (props.severity === "danger") return "CircleAlert";
  if (props.severity === "primary") return "Sparkles";
  return "Info";
});

const rootClass = computed(() => [
  "vp-status-modal",
  `vp-status-modal--${props.severity}`,
  props.class,
]);

const panelStyle = computed(() => ({
  ...(props.style ?? {}),
  ...(props.width ? { width: props.width } : {}),
}));

const overlayStyle = computed(() => {
  const z = overlay.zIndex.value ?? props.zIndex;
  return z === undefined ? undefined : { zIndex: String(z) };
});

async function runGuard(
  action: StatusModalAction,
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

async function requestClose(reason: StatusModalCloseReason, event?: Event) {
  if (busy.value) return;
  pending.value = "cancel";
  try {
    const allowed = await runGuard("cancel", () =>
      props.beforeCancel ? props.beforeCancel(reason, event) : true,
    );
    if (!allowed) return;
    trackEmit({
      component: "StatusModal",
      type: "cancel",
      trackId: props.trackId,
      telemetry: props.telemetry,
      payload: { severity: props.severity, reason },
    });
    emit("update:visible", false);
    emit("cancel", event, reason);
    emit("close", reason, event);
  } finally {
    pending.value = null;
  }
}

async function confirm(event: MouseEvent) {
  if (busy.value) return;
  pending.value = "confirm";
  try {
    const allowed = await runGuard("confirm", () =>
      props.beforeConfirm ? props.beforeConfirm(event) : true,
    );
    if (!allowed) return;
    trackEmit({
      component: "StatusModal",
      type: "confirm",
      trackId: props.trackId,
      telemetry: props.telemetry,
      payload: { severity: props.severity },
    });
    emit("confirm", event);
    emit("update:visible", false);
  } finally {
    pending.value = null;
  }
}

function onOverlay(event: MouseEvent) {
  if (closeOnOverlay.value && event.target === event.currentTarget) {
    void requestClose("overlay", event);
  }
}

function focusInitial() {
  if (props.initialFocus === "none") return;
  if (props.initialFocus === "dialog") {
    dialogRef.value?.focus();
    return;
  }
  const component =
    props.initialFocus === "cancel" ? cancelRef.value : confirmRef.value;
  const element = component?.$el;
  if (element instanceof HTMLElement) element.focus();
  else dialogRef.value?.focus();
}

watch(
  () => props.visible,
  (visible) => {
    if (visible) void nextTick(focusInitial);
  },
);
</script>

<template>
  <Teleport :to="overlay.teleportTo">
    <Transition
      name="vp-status-modal"
      @after-enter="emit('open')"
      @after-leave="emit('closed')"
    >
      <div
        v-if="visible"
        class="vp-status-modal-overlay"
        :style="overlayStyle"
        role="presentation"
        @click="onOverlay"
      >
        <section
          ref="dialogRef"
          :class="rootClass"
          :style="panelStyle"
          role="alertdialog"
          :aria-modal="overlay.ariaModal.value"
          :aria-labelledby="titleId"
          :aria-describedby="
            message || $slots.default ? descriptionId : undefined
          "
          :aria-busy="busy || undefined"
          tabindex="-1"
          data-component="StatusModal"
          @click.stop
        >
          <div class="vp-status-modal__accent" aria-hidden="true" />
          <header class="vp-status-modal__header">
            <span class="vp-status-modal__icon" aria-hidden="true">
              <slot name="icon"><Icon :name="iconName" size="lg" /></slot>
            </span>
            <div class="vp-status-modal__heading">
              <h2 :id="titleId" class="vp-status-modal__title">
                <slot name="title">{{ title }}</slot>
              </h2>
            </div>
            <button
              v-if="closable"
              type="button"
              class="vp-status-modal__close"
              :aria-label="closeLabel"
              :disabled="busy"
              @click="requestClose('close', $event)"
            >
              <Icon name="X" size="sm" />
            </button>
          </header>

          <div :id="descriptionId" class="vp-status-modal__body">
            <slot>{{ message }}</slot>
          </div>

          <footer class="vp-status-modal__footer">
            <slot
              name="footer"
              :busy="busy"
              :confirm="confirm"
              :cancel="requestClose"
            >
              <Button
                v-if="showCancel"
                ref="cancelRef"
                variant="outline"
                severity="secondary"
                :disabled="busy"
                @click="requestClose('cancel', $event)"
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
                :loading="pending === 'confirm' || loading"
                :disabled="busy"
                @click="confirm"
              >
                {{ confirmText }}
              </Button>
            </slot>
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>
