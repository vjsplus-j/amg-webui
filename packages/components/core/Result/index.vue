<script setup lang="ts">
import { computed, useId } from "vue";
import Icon from '@amg-webui/core/Icon/index.vue';
import { useLocale } from "@amg-webui/hooks";
import type { LocaleKey } from "@amg-webui/locale";
import { trackEmit } from "@amg-webui/telemetry";
import type { ResultEmits, ResultProps, ResultStatus } from "./types";
import "./style.scss";

const RESULT_TITLE_KEYS: Record<ResultStatus, LocaleKey> = {
  success: "component.result.success",
  warning: "component.result.warning",
  error: "component.result.error",
  info: "component.result.info",
  "403": "component.result.403",
  "404": "component.result.404",
  "500": "component.result.500",
};

const props = withDefaults(defineProps<ResultProps>(), {
  status: "info",
  size: "md",
  fullScreen: false,
  actions: () => [],
  live: "polite",
  telemetry: undefined,
});
const emit = defineEmits<ResultEmits>();
const { t } = useLocale();
const uid = useId();
const titleId = `${uid}-title`;
const subtitleId = `${uid}-subtitle`;
const iconMap: Record<ResultStatus, string> = {
  success: "CircleCheck",
  warning: "TriangleAlert",
  error: "CircleX",
  info: "Info",
  "403": "ShieldAlert",
  "404": "SearchX",
  "500": "ServerCrash",
};
const iconName = computed(() =>
  props.icon === false ? undefined : (props.icon ?? iconMap[props.status]),
);
const titleText = computed(() => {
  if (props.title) return props.title
  const key = RESULT_TITLE_KEYS[props.status]
  return t(key)
});
function action(key: string, event: MouseEvent) {
  emit("action", key, event);
  trackEmit({
    component: "Result",
    type: "action",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { key, status: props.status },
  });
}
</script>
<template>
  <section
    :class="[
      'vp-result',
      `vp-result--${status}`,
      `vp-result--${size}`,
      { 'vp-result--full-screen': fullScreen },
      props.class,
    ]"
    :style="style"
    :role="status === 'error' || status === '500' ? 'alert' : 'status'"
    :aria-live="live"
    :aria-labelledby="titleText || $slots.title ? titleId : undefined"
    :aria-describedby="subTitle || $slots.subTitle ? subtitleId : undefined"
    data-component="Result"
  >
    <div v-if="image || iconName || $slots.icon" class="vp-result__visual">
      <slot name="icon"
        ><img v-if="image" :src="image" alt="" class="vp-result__image" /><span
          v-else-if="iconName"
          class="vp-result__icon"
          aria-hidden="true"
          ><Icon :name="iconName" size="lg" /></span
      ></slot>
    </div>
    <h3 v-if="titleText || $slots.title" :id="titleId" class="vp-result__title">
      <slot name="title">{{ titleText }}</slot>
    </h3>
    <p
      v-if="subTitle || $slots.subTitle"
      :id="subtitleId"
      class="vp-result__subtitle"
    >
      <slot name="subTitle">{{ subTitle }}</slot>
    </p>
    <div v-if="$slots.default" class="vp-result__body"><slot /></div>
    <div
      v-if="actions.length || $slots.extra"
      class="vp-result__extra"
      @click="emit('extra-click', $event)"
    >
      <slot name="extra"
        ><button
          v-for="item in actions"
          :key="item.key"
          type="button"
          :class="[
            'vp-result__action',
            { 'vp-result__action--primary': item.primary },
          ]"
          :disabled="item.disabled"
          @click.stop="action(item.key, $event)"
        >
          {{ item.label }}
        </button></slot
      >
    </div>
  </section>
</template>
