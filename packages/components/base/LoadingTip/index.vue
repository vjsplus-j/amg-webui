<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from "vue";
import type { LoadingTipEmits, LoadingTipProps } from "./types";
import { useLocale } from "@amg-webui/hooks";
import { LocaleKeys } from "@amg-webui/locale";
import { trackEmit } from "@amg-webui/telemetry";
import "./style.scss";

const props = withDefaults(defineProps<LoadingTipProps>(), {
  loading: true,
  size: "md",
  delay: 0,
  block: false,
  persistent: false,
  overlay: false,
  cancellable: false,
  live: "polite",
  telemetry: undefined,
});

const { t } = useLocale();
const emit = defineEmits<LoadingTipEmits>();
const visible = ref(props.delay <= 0 && props.loading);
let timer: ReturnType<typeof setTimeout> | undefined;

function clearTimer() {
  if (timer != null) {
    clearTimeout(timer);
    timer = undefined;
  }
}

watch(
  () => [props.loading, props.delay] as const,
  ([loading, delay]) => {
    clearTimer();
    if (!loading) {
      if (visible.value) {
        emit("hide");
        trackEmit({
          component: "LoadingTip",
          type: "hide",
          trackId: props.trackId,
          telemetry: props.telemetry,
        });
      }
      visible.value = false;
      return;
    }
    if (!delay) {
      visible.value = true;
      emit("show");
      trackEmit({
        component: "LoadingTip",
        type: "show",
        trackId: props.trackId,
        telemetry: props.telemetry,
      });
      return;
    }
    visible.value = false;
    timer = setTimeout(() => {
      visible.value = true;
      emit("show");
      trackEmit({
        component: "LoadingTip",
        type: "show",
        trackId: props.trackId,
        telemetry: props.telemetry,
      });
      timer = undefined;
    }, delay);
  },
  { immediate: true },
);

onUnmounted(clearTimer);

const rootClass = computed(() => [
  "vp-loading-tip",
  `vp-loading-tip--${props.size}`,
  {
    "vp-loading-tip--loading": visible.value,
    "vp-loading-tip--block": props.block,
    "vp-loading-tip--overlay": props.overlay,
  },
  props.class,
]);

const label = computed(() => props.message ?? t(LocaleKeys.common.loading));
const progressValue = computed(() =>
  props.progress == null
    ? undefined
    : Math.min(100, Math.max(0, props.progress)),
);
function cancel(event: MouseEvent) {
  emit("cancel", event);
  trackEmit({
    component: "LoadingTip",
    type: "cancel",
    trackId: props.trackId,
    telemetry: props.telemetry,
  });
}
</script>

<template>
  <div
    v-if="visible || persistent"
    :class="rootClass"
    :style="style"
    role="status"
    :aria-busy="visible"
    :aria-live="live"
    data-component="LoadingTip"
  >
    <span
      v-if="visible && progressValue == null"
      class="vp-loading-tip__spinner"
      aria-hidden="true"
    />
    <span v-if="visible" class="vp-loading-tip__content"
      ><span class="vp-loading-tip__text">{{ label }}</span
      ><span
        v-if="progressValue != null"
        class="vp-loading-tip__progress"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="progressValue"
        ><i :style="{ width: `${progressValue}%` }" /></span
    ></span>
    <button
      v-if="visible && cancellable"
      type="button"
      class="vp-loading-tip__cancel"
      @click="cancel"
    >
      {{ cancelText ?? t(LocaleKeys.button.cancel) }}
    </button>
    <slot :loading="visible" />
  </div>
</template>
