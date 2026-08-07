<script setup lang="ts">
import { computed, watch } from "vue";
import { useLocale } from "@amg-webui/hooks";
import { LocaleKeys } from "@amg-webui/locale";
import { trackEmit } from "@amg-webui/telemetry";
import Progress from "../Progress/index.vue";
import Button from '@amg-webui/core/Button/index.vue';
import Icon from '@amg-webui/core/Icon/index.vue';
import type { ProgressStatus } from "../Progress/types";
import type { ProgressTipProps, ProgressTipEmits } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<ProgressTipProps>(), {
  percentage: 0,
  severity: "info",
  size: "md",
  showText: true,
  striped: false,
  indeterminate: false,
  closable: false,
  state: "active",
  cancellable: false,
  retryable: false,
  telemetry: undefined,
});

const emit = defineEmits<ProgressTipEmits>();
const { t } = useLocale();

const pct = computed(() =>
  Math.min(100, Math.max(0, props.modelValue ?? props.percentage)),
);
const stepText = computed(() => {
  if (!props.totalSteps) return "";
  const current = Math.min(
    props.totalSteps,
    Math.max(0, props.currentStep ?? 0),
  );
  return `${current} / ${props.totalSteps}`;
});
const messageText = computed(() => props.message ?? props.description);
const cancelText = computed(
  () => props.cancelText || t(LocaleKeys.button.cancel),
);
const retryText = computed(
  () => props.retryText || t(LocaleKeys.button.refresh),
);

watch(pct, (v, prev) => {
  emit("update:modelValue", v);
  if (prev != null && prev < 100 && v >= 100) emit("complete");
});

const progressStatus = computed<ProgressStatus>(() => {
  if (props.state === "error") return "danger";
  if (props.state === "success") return "success";
  if (props.severity === "danger") return "danger";
  if (props.severity === "warning") return "warning";
  if (props.severity === "success") return "success";
  return "normal";
});

const rootClass = computed(() => [
  "vp-progress-tip",
  `vp-progress-tip--${props.severity}`,
  `vp-progress-tip--size-${props.size}`,
  {
    "vp-progress-tip--striped": props.striped,
    "vp-progress-tip--indeterminate": props.indeterminate,
  },
  props.class,
]);

function fire(
  type: "action" | "cancel" | "retry" | "pause" | "resume",
  event: MouseEvent,
) {
  trackEmit({
    component: "ProgressTip",
    type,
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { percentage: pct.value, state: props.state },
  });
  if (type === "action") emit("action", event);
  else if (type === "cancel") emit("cancel", event);
  else if (type === "retry") emit("retry", event);
  else if (type === "pause") emit("pause", event);
  else emit("resume", event);
}
</script>

<template>
  <div
    :class="rootClass"
    :style="style"
    role="status"
    aria-live="polite"
    :aria-busy="state === 'active' || undefined"
    data-component="ProgressTip"
  >
    <header
      v-if="
        title || closable || actionText || stepText || cancellable || retryable
      "
      class="vp-progress-tip__header"
    >
      <span class="vp-progress-tip__state" aria-hidden="true">
        <Icon
          :name="
            state === 'success'
              ? 'CircleCheck'
              : state === 'error'
                ? 'CircleAlert'
                : state === 'paused'
                  ? 'Pause'
                  : 'LoaderCircle'
          "
          size="sm"
        />
      </span>
      <strong v-if="title" class="vp-progress-tip__title">{{ title }}</strong>
      <span v-if="stepText" class="vp-progress-tip__step">{{ stepText }}</span>
      <Button
        v-if="state === 'paused'"
        variant="text"
        size="sm"
        @click="fire('resume', $event)"
        >{{ t(LocaleKeys.button.continue) }}</Button
      >
      <Button
        v-else-if="state === 'active'"
        variant="text"
        size="sm"
        @click="fire('pause', $event)"
        >{{ t(LocaleKeys.common.pause) }}</Button
      >
      <Button
        v-if="retryable && state === 'error'"
        variant="text"
        size="sm"
        @click="fire('retry', $event)"
        >{{ retryText }}</Button
      >
      <Button
        v-if="cancellable && state === 'active'"
        variant="text"
        severity="danger"
        size="sm"
        @click="fire('cancel', $event)"
        >{{ cancelText }}</Button
      >
      <Button
        v-if="actionText"
        class="vp-progress-tip__btn"
        variant="text"
        size="sm"
        @click="fire('action', $event)"
        >{{ actionText }}</Button
      >
      <button
        v-if="closable"
        type="button"
        class="vp-progress-tip__close"
        :aria-label="t('common.close')"
        @click="emit('close')"
      >
        <Icon name="X" size="sm" />
      </button>
    </header>
    <p v-if="messageText || $slots.default" class="vp-progress-tip__message">
      <slot>{{ messageText }}</slot>
    </p>
    <Progress
      :percentage="pct"
      type="line"
      :status="progressStatus"
      :show-text="showText"
      :stroke-width="size === 'sm' ? 4 : size === 'lg' ? 10 : 6"
    />
    <div v-if="$slots.details" class="vp-progress-tip__details">
      <slot name="details" />
    </div>
  </div>
</template>
