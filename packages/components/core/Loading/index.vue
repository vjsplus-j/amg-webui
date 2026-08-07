<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from "vue";
import { useBodyScrollLock, useLocale } from "@amg-webui/hooks";
import { LocaleKeys } from "@amg-webui/locale";
import { trackEmit } from "@amg-webui/telemetry";
import type { LoadingEmits, LoadingProps } from "./types";
import "./style.scss";
const props = withDefaults(defineProps<LoadingProps>(), {
  visible: true,
  fullscreen: false,
  size: "md",
  indicator: "spinner",
  lockScroll: true,
  backdrop: true,
  delay: 0,
  cancellable: false,
  live: "polite",
  telemetry: undefined,
});
const emit = defineEmits<LoadingEmits>();
const { t } = useLocale();
const rendered = ref(props.visible && props.delay <= 0);
let timer: ReturnType<typeof setTimeout> | null = null;
const active = computed(() => rendered.value && props.visible);
const lockEnabled = computed(() => props.fullscreen && props.lockScroll);
useBodyScrollLock(active, lockEnabled);
watch(
  () => [props.visible, props.delay] as const,
  ([visible, delay]) => {
    if (timer) clearTimeout(timer);
    timer = null;
    if (!visible) {
      rendered.value = false;
      emit("visibleChange", false);
      return;
    }
    if (delay > 0)
      timer = setTimeout(() => {
        rendered.value = true;
        emit("visibleChange", true);
      }, delay);
    else {
      rendered.value = true;
      emit("visibleChange", true);
    }
  },
  { immediate: true },
);
onUnmounted(() => {
  if (timer) clearTimeout(timer);
});
const label = computed(() => props.text ?? t(LocaleKeys.common.loading));
const progress = computed(() =>
  props.progress == null
    ? undefined
    : Math.min(100, Math.max(0, props.progress)),
);
function cancel(event: MouseEvent) {
  emit("cancel", event);
  emit("update:visible", false);
  trackEmit({
    component: "Loading",
    type: "cancel",
    trackId: props.trackId,
    telemetry: props.telemetry,
  });
}
</script>
<template>
  <Teleport to="body" :disabled="!fullscreen"
    ><Transition
      name="vp-loading-fade"
      @after-enter="emit('after-enter')"
      @after-leave="emit('after-leave')"
      ><div
        v-if="rendered && visible"
        :class="[
          'vp-loading',
          `vp-loading--size-${size}`,
          {
            'vp-loading--fullscreen': fullscreen,
            'vp-loading--inline': !fullscreen,
            'vp-loading--backdrop': backdrop,
          },
          props.class,
        ]"
        :style="[style, zIndex == null ? undefined : { zIndex }]"
        role="status"
        :aria-live="live"
        aria-busy="true"
        :aria-label="label"
        data-component="Loading"
      >
        <div class="vp-loading__overlay">
          <slot name="indicator" :progress="progress"
            ><span
              v-if="progress == null && indicator === 'spinner'"
              class="vp-loading__spinner"
              aria-hidden="true" /><span
              v-else-if="progress == null"
              class="vp-loading__dots"
              aria-hidden="true"
              ><i /><i /><i /></span
            ><span
              v-else
              class="vp-loading__progress"
              role="progressbar"
              aria-valuemin="0"
              aria-valuemax="100"
              :aria-valuenow="progress"
              ><i :style="{ width: `${progress}%` }" /></span></slot
          ><span v-if="label" class="vp-loading__text">{{ label }}</span
          ><slot :cancel="cancel" :progress="progress" /><button
            v-if="cancellable"
            type="button"
            class="vp-loading__cancel"
            @click="cancel"
          >
            {{ cancelText ?? t(LocaleKeys.button.cancel) }}
          </button>
        </div>
      </div></Transition
    ></Teleport
  >
</template>
