<script setup lang="ts">
import { computed, getCurrentInstance, ref } from "vue";
import { useAutoDismiss, useLocale } from "@amg-webui/hooks";
import { LocaleKeys } from "@amg-webui/locale";
import { trackEmit } from "@amg-webui/telemetry";
import Button from "../Button/index.vue";
import Icon from "../Icon/index.vue";
import type { MessageCloseReason, MessageEmits, MessageProps } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<MessageProps>(), {
  severity: "info",
  showIcon: true,
  closable: true,
  autoHide: false,
  hideDelay: 3000,
  pauseOnHover: true,
  showProgress: false,
  variant: "soft",
  ariaLive: undefined,
  telemetry: undefined,
});
const emit = defineEmits<MessageEmits>();
const { t } = useLocale();
const internalVisible = ref(true);
const instance = getCurrentInstance();
const isControlled = computed(() =>
  Object.prototype.hasOwnProperty.call(instance?.vnode.props ?? {}, "visible"),
);
const isVisible = computed(() =>
  isControlled.value ? Boolean(props.visible) : internalVisible.value,
);
const timerActive = computed(
  () => props.autoHide && isVisible.value && props.hideDelay > 0,
);
const duration = computed(() => props.hideDelay);

const { paused, pause, resume } = useAutoDismiss(timerActive, duration, () =>
  close("timeout"),
);

const iconName = computed(() => {
  if (props.severity === "success") return "CircleCheck";
  if (props.severity === "warning") return "TriangleAlert";
  if (props.severity === "danger") return "CircleAlert";
  return "Info";
});
const live = computed(
  () =>
    props.ariaLive ??
    (props.severity === "danger" || props.severity === "warning"
      ? "assertive"
      : "polite"),
);
const rootClass = computed(() => [
  "vp-message",
  `vp-message--${props.severity}`,
  `vp-message--${props.variant}`,
  { "vp-message--paused": paused.value },
  props.class,
]);
const progressStyle = computed(() => ({
  "--vp-message-duration": `${props.hideDelay}ms`,
}));

function close(reason: MessageCloseReason = "programmatic", event?: Event) {
  if (!isVisible.value) return;
  if (!isControlled.value) internalVisible.value = false;
  emit("update:visible", false);
  emit("close", reason, event);
  trackEmit({
    component: "Message",
    type: "close",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { severity: props.severity, reason },
  });
}

function action(event: MouseEvent) {
  emit("action", event);
  trackEmit({
    component: "Message",
    type: "action",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { severity: props.severity },
  });
}
</script>

<template>
  <Transition name="vp-message" @after-leave="emit('closed')">
    <div
      v-if="isVisible"
      :class="rootClass"
      :style="style"
      :role="
        severity === 'danger' || severity === 'warning' ? 'alert' : 'status'
      "
      :aria-live="live"
      data-component="Message"
      @mouseenter="pauseOnHover && pause()"
      @mouseleave="pauseOnHover && resume()"
      @focusin="pauseOnHover && pause()"
      @focusout="pauseOnHover && resume()"
    >
      <span v-if="showIcon" class="vp-message__icon" aria-hidden="true">
        <slot name="icon"><Icon :name="iconName" size="md" /></slot>
      </span>
      <div class="vp-message__content">
        <strong v-if="title || $slots.title" class="vp-message__title">
          <slot name="title">{{ title }}</slot>
        </strong>
        <div class="vp-message__text">
          <slot>{{ text }}</slot>
        </div>
        <div v-if="$slots.actions || actionText" class="vp-message__actions">
          <slot name="actions" :close="close">
            <Button variant="text" severity="primary" size="sm" @click="action">
              {{ actionText }}
            </Button>
          </slot>
        </div>
      </div>
      <button
        v-if="closable"
        type="button"
        class="vp-message__close"
        :aria-label="t(LocaleKeys.common.close)"
        @click="close('close', $event)"
      >
        <Icon name="X" size="sm" />
      </button>
      <span
        v-if="showProgress && timerActive"
        class="vp-message__progress"
        :style="progressStyle"
        aria-hidden="true"
      />
    </div>
  </Transition>
</template>
