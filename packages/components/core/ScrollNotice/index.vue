<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useLocale } from "@amg-webui/hooks";
import { trackEmit } from "@amg-webui/telemetry";
import Icon from '@amg-webui/core/Icon/index.vue';
import type { ScrollNoticeEmits, ScrollNoticeProps } from "./types";
import "./style.scss";
const props = withDefaults(defineProps<ScrollNoticeProps>(), {
  severity: "info",
  speed: 40,
  direction: "left",
  pauseOnHover: true,
  paused: false,
  disabled: false,
  loading: false,
  closable: false,
  telemetry: undefined,
});
const emit = defineEmits<ScrollNoticeEmits>();
const { t } = useLocale();
const hoverPaused = ref(false);
const visible = ref(true);
watch(
  () => props.paused,
  (value) => {
    hoverPaused.value = value;
  },
);
const message = computed(() => props.text ?? props.data ?? "");
const stopped = computed(
  () => props.paused || hoverPaused.value || props.disabled,
);
const duration = computed(
  () =>
    `${Math.max(6, (message.value.length * 20) / Math.max(1, props.speed))}s`,
);
function setHover(value: boolean) {
  if (!props.pauseOnHover || props.disabled) return;
  hoverPaused.value = value;
  emit("update:paused", value);
  if (value) emit("pause");
  else emit("resume");
}
function close(event: MouseEvent) {
  visible.value = false;
  emit("close", event);
  trackEmit({
    component: "ScrollNotice",
    type: "close",
    trackId: props.trackId,
    telemetry: props.telemetry,
  });
}
</script>
<template>
  <aside
    v-if="visible"
    :class="[
      'vp-scroll-notice',
      `vp-scroll-notice--${severity}`,
      `vp-scroll-notice--${direction}`,
      {
        'vp-scroll-notice--disabled': disabled,
        'vp-scroll-notice--paused': stopped,
      },
      props.class,
    ]"
    :style="style"
    role="status"
    data-component="ScrollNotice"
    @mouseenter="setHover(true)"
    @mouseleave="setHover(false)"
    @click="emit('click', $event)"
  >
    <span v-if="title" class="vp-scroll-notice__label">{{ title }}</span>
    <div class="vp-scroll-notice__track">
      <p v-if="loading" class="vp-scroll-notice__text">
        {{ t("common.loading") }}
      </p>
      <p
        v-else
        class="vp-scroll-notice__text"
        :style="{ animationDuration: duration }"
      >
        <slot>{{ message }}</slot>
      </p>
    </div>
    <button
      v-if="closable"
      type="button"
      class="vp-scroll-notice__close"
      :aria-label="t('common.close')"
      @click.stop="close"
    >
      <Icon name="X" size="sm" />
    </button>
  </aside>
</template>
