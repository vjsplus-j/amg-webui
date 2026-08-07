<script setup lang="ts">
import { computed, getCurrentInstance, ref } from "vue";
import { useAutoDismiss, useLocale } from "@amg-webui/hooks";
import { LocaleKeys } from "@amg-webui/locale";
import { trackEmit } from "@amg-webui/telemetry";
import Button from '@amg-webui/core/Button/index.vue';
import Icon from '@amg-webui/core/Icon/index.vue';
import type { NoticeCloseReason, NoticeEmits, NoticeProps } from "./notice";
import "./feedback-notice.scss";

const props = withDefaults(
  defineProps<NoticeProps & { kind?: "toast" | "notification" }>(),
  {
    kind: "notification",
    severity: "info",
    duration: 3000,
    closable: true,
    position: "top-right",
    showIcon: true,
    pauseOnHover: true,
    showProgress: false,
    teleport: true,
    teleportTo: "body",
    ariaLive: undefined,
    telemetry: undefined,
  },
);
const emit = defineEmits<NoticeEmits>();
const { t } = useLocale();
const internalVisible = ref(true);
const instance = getCurrentInstance();
const isControlled = computed(() =>
  Object.prototype.hasOwnProperty.call(instance?.vnode.props ?? {}, "visible"),
);
const isVisible = computed(() =>
  isControlled.value ? Boolean(props.visible) : internalVisible.value,
);
const durationRef = computed(() => props.duration);
const timerActive = computed(() => isVisible.value && props.duration > 0);
const { paused, pause, resume } = useAutoDismiss(timerActive, durationRef, () =>
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
  "vp-notice",
  `vp-notice--${props.kind}`,
  `vp-notice--${props.severity}`,
  `vp-notice--${props.position}`,
  { "vp-notice--paused": paused.value },
  props.class,
]);
const rootStyle = computed(() => ({
  ...(props.style ?? {}),
  ...(props.zIndex === undefined ? {} : { zIndex: String(props.zIndex) }),
}));
const progressStyle = computed(() => ({
  "--vp-notice-duration": `${props.duration}ms`,
}));

function close(reason: NoticeCloseReason = "programmatic", event?: Event) {
  if (!isVisible.value) return;
  if (!isControlled.value) internalVisible.value = false;
  emit("update:visible", false);
  emit("close", reason, event);
  trackEmit({
    component: props.kind === "toast" ? "Toast" : "Notification",
    type: "close",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { severity: props.severity, reason, position: props.position },
  });
}

function action(event: MouseEvent) {
  emit("action", event);
  trackEmit({
    component: props.kind === "toast" ? "Toast" : "Notification",
    type: "action",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { severity: props.severity },
  });
}
</script>

<template>
  <Teleport :to="teleportTo" :disabled="!teleport">
    <Transition
      name="vp-notice"
      @after-enter="emit('open')"
      @after-leave="emit('closed')"
    >
      <article
        v-if="isVisible"
        :class="rootClass"
        :style="rootStyle"
        :role="
          severity === 'danger' || severity === 'warning' ? 'alert' : 'status'
        "
        :aria-live="live"
        :data-component="kind === 'toast' ? 'Toast' : 'Notification'"
        @click="emit('click', $event)"
        @mouseenter="pauseOnHover && pause()"
        @mouseleave="pauseOnHover && resume()"
        @focusin="pauseOnHover && pause()"
        @focusout="pauseOnHover && resume()"
      >
        <span v-if="showIcon" class="vp-notice__icon" aria-hidden="true">
          <slot name="icon"><Icon :name="iconName" size="md" /></slot>
        </span>
        <div class="vp-notice__body">
          <h4 v-if="title || $slots.title" class="vp-notice__title">
            <slot name="title">{{ title }}</slot>
          </h4>
          <div v-if="message || $slots.default" class="vp-notice__message">
            <slot>{{ message }}</slot>
          </div>
          <div v-if="$slots.actions || actionText" class="vp-notice__actions">
            <slot name="actions" :close="close">
              <Button
                variant="text"
                severity="primary"
                size="sm"
                @click.stop="action"
              >
                {{ actionText }}
              </Button>
            </slot>
          </div>
        </div>
        <button
          v-if="closable"
          type="button"
          class="vp-notice__close"
          :aria-label="t(LocaleKeys.common.close)"
          @click.stop="close('close', $event)"
        >
          <Icon name="X" size="sm" />
        </button>
        <span
          v-if="showProgress && timerActive"
          class="vp-notice__progress"
          :style="progressStyle"
          aria-hidden="true"
        />
      </article>
    </Transition>
  </Teleport>
</template>
