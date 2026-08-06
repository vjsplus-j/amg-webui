<script setup lang="ts">
import { computed, ref } from "vue";
import Icon from "../Icon/index.vue";
import { useLocale } from "@amg-webui/hooks";
import { LocaleKeys } from "@amg-webui/locale";
import { trackEmit } from "@amg-webui/telemetry";
import type { StatusTipEmits, StatusTipProps } from "./types";
import "./style.scss";
const props = withDefaults(defineProps<StatusTipProps>(), {
  severity: "info",
  icon: true,
  closable: false,
  block: false,
  compact: false,
  telemetry: undefined,
});
const emit = defineEmits<StatusTipEmits>();
const { t } = useLocale();
const show = ref(true);
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
  show.value = false;
  emit("close", event);
  trackEmit({
    component: "StatusTip",
    type: "close",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { severity: props.severity },
  });
}
function action(event: MouseEvent) {
  emit("action", event);
  trackEmit({
    component: "StatusTip",
    type: "action",
    trackId: props.trackId,
    telemetry: props.telemetry,
  });
}
</script>
<template>
  <Transition name="vp-status-tip"
    ><aside
      v-if="show"
      :class="[
        'vp-status-tip',
        `vp-status-tip--${severity}`,
        { 'vp-status-tip--block': block, 'vp-status-tip--compact': compact },
        props.class,
      ]"
      :style="style"
      :role="severity === 'danger' ? 'alert' : 'status'"
      data-component="StatusTip"
    >
      <slot name="icon"
        ><Icon
          v-if="iconName"
          :name="iconName"
          size="sm"
          class="vp-status-tip__icon"
      /></slot>
      <div class="vp-status-tip__content">
        <strong v-if="title" class="vp-status-tip__title">{{ title }}</strong
        ><span class="vp-status-tip__text"
          ><slot>{{ message }}</slot></span
        >
      </div>
      <button
        v-if="actionText"
        type="button"
        class="vp-status-tip__action"
        @click="action"
      >
        {{ actionText }}</button
      ><slot name="action" :close="close" />
      <button
        v-if="closable"
        type="button"
        class="vp-status-tip__close"
        :aria-label="t(LocaleKeys.common.close)"
        @click="close"
      >
        <Icon name="X" size="sm" />
      </button></aside
  ></Transition>
</template>
