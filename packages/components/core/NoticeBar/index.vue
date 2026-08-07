<script setup lang="ts">
import { computed, getCurrentInstance, ref, watch } from "vue";
import { useLocale } from "@amg-webui/hooks";
import { LocaleKeys } from "@amg-webui/locale";
import { trackEmit } from "@amg-webui/telemetry";
import Icon from '@amg-webui/core/Icon/index.vue';
import type { NoticeBarEmits, NoticeBarProps } from "./types";
import "./style.scss";
const props = withDefaults(defineProps<NoticeBarProps>(), {
  modelValue: true,
  severity: "info",
  icon: true,
  closable: true,
  scrollable: false,
  speed: 18,
  pauseOnHover: true,
  wrap: false,
  telemetry: undefined,
});
const emit = defineEmits<NoticeBarEmits>();
const { t } = useLocale();
const internalVisible = ref(props.modelValue);
const instance = getCurrentInstance();
const controlled = computed(() =>
  Object.prototype.hasOwnProperty.call(
    instance?.vnode.props ?? {},
    "modelValue",
  ),
);
const visible = computed(() =>
  controlled.value ? props.modelValue : internalVisible.value,
);
watch(
  () => props.modelValue,
  (value) => {
    internalVisible.value = value;
  },
);
const icons = {
  primary: "Info",
  secondary: "Info",
  info: "Info",
  success: "CircleCheck",
  warning: "TriangleAlert",
  danger: "CircleX",
} as const;
const iconName = computed(() =>
  typeof props.icon === "string"
    ? props.icon
    : props.icon
      ? icons[props.severity]
      : undefined,
);
function close(event: MouseEvent) {
  if (!controlled.value) internalVisible.value = false;
  emit("update:modelValue", false);
  emit("close", event);
  trackEmit({
    component: "NoticeBar",
    type: "close",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { severity: props.severity },
  });
}
function click(event: MouseEvent) {
  emit("click", event);
}
function action(event: MouseEvent) {
  event.stopPropagation();
  emit("action", event);
  trackEmit({
    component: "NoticeBar",
    type: "action",
    trackId: props.trackId,
    telemetry: props.telemetry,
  });
}
</script>
<template>
  <Transition name="vp-notice-bar"
    ><aside
      v-if="visible"
      :class="[
        'vp-notice-bar',
        `vp-notice-bar--${severity}`,
        {
          'vp-notice-bar--scroll': scrollable && !wrap,
          'vp-notice-bar--wrap': wrap,
        },
        props.class,
      ]"
      :style="style"
      :role="
        severity === 'danger' || severity === 'warning' ? 'alert' : 'status'
      "
      :aria-live="severity === 'danger' ? 'assertive' : 'polite'"
      data-component="NoticeBar"
      @click="click"
    >
      <slot name="icon"
        ><Icon
          v-if="iconName"
          :name="iconName"
          size="sm"
          class="vp-notice-bar__icon"
      /></slot>
      <div class="vp-notice-bar__viewport">
        <div
          class="vp-notice-bar__track"
          :class="{ 'vp-notice-bar__track--pause': pauseOnHover }"
          :style="
            scrollable
              ? { '--vp-notice-speed': `${Math.max(speed, 1)}s` }
              : undefined
          "
        >
          <strong v-if="title" class="vp-notice-bar__title">{{ title }}</strong
          ><span class="vp-notice-bar__text"
            ><slot>{{ message }}</slot></span
          >
        </div>
      </div>
      <button
        v-if="actionText"
        type="button"
        class="vp-notice-bar__action"
        @click="action"
      >
        {{ actionText }}</button
      ><slot name="action" :close="close" />
      <button
        v-if="closable"
        type="button"
        class="vp-notice-bar__close"
        :aria-label="t(LocaleKeys.common.close)"
        @click.stop="close"
      >
        <Icon name="X" size="sm" />
      </button></aside
  ></Transition>
</template>
