<script setup lang="ts">
import { createMockMediaAdapter, type MediaAdapter } from '@amg-webui/utils'
import { computed, nextTick, ref, watch, onBeforeUnmount } from 'vue';
import { useLocale, useOverlay } from "@amg-webui/hooks";
import { trackEmit } from "@amg-webui/telemetry";
import { LocaleKeys } from "@amg-webui/locale";
import type {
  GbsAlarmCloseReason,
  GbsAlarmModalEmits,
  GbsAlarmModalProps,
} from "./types";
import "./style.scss";

const props = withDefaults(defineProps<GbsAlarmModalProps>(), {
  open: false,
  alarm: null,
  disabled: false,
  loading: false,
  closable: true,
  maskClosable: true,
  closeOnEscape: true,
  lockScroll: true,
  destroyOnClose: true,
  teleportTo: "body",
  telemetry: undefined,
});
const emit = defineEmits<GbsAlarmModalEmits>();
const { t, locale } = useLocale();
const dialogRef = ref<HTMLElement | null>(null);
const active = computed(() => props.open);
const closeOnEscape = computed(() => props.closeOnEscape);

const overlay = useOverlay({
  visible: active,
  kind: "modal",
  container: dialogRef,
  modal: true,
  lockScroll: () => props.lockScroll,
  trapFocus: true,
  restoreFocus: true,
  closeOnEscape,
  teleportTo: () => props.teleportTo,
  autoFocus: false,
  onEscape: () => {
    if (closeOnEscape.value) close("escape");
  },
});

const titleId = overlay.titleId;
const descriptionId = `${titleId}-description`;
const overlayStyle = computed(() => {
  const z = overlay.zIndex.value;
  return z === undefined ? undefined : { zIndex: String(z) };
});

const titleText = computed(
  () =>
    props.title ?? props.alarm?.title ?? t(LocaleKeys.industry.gbs.alarmTitle),
);
const descriptionText = computed(
  () =>
    props.description ??
    props.alarm?.description ??
    t(LocaleKeys.industry.gbs.alarmDesc),
);
const details = computed(() => Object.entries(props.alarm?.details ?? {}));
function formatTime(value: GbsAlarmInfoTime) {
  if (value == null || value === "") return "";
  if (typeof value === "string") return value;
  return new Intl.DateTimeFormat(locale.value, {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(value);
}
type GbsAlarmInfoTime = string | number | Date | undefined;
watch(
  () => props.open,
  (open) => {
    if (!open) return;
    emit("open");
    void nextTick(() => {
      dialogRef.value?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
      emit("afterOpen");
    });
  },
  { immediate: true },
);
function close(reason: GbsAlarmCloseReason) {
  if (!props.closable && reason !== "acknowledge") return;
  emit("update:open", false);
  emit("close", reason);
  trackEmit({
    component: "GbsAlarmModal",
    type: "close",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { reason, id: props.alarm?.id },
  });
}
function acknowledge() {
  if (props.disabled || props.loading) return;
  emit("acknowledge", props.alarm);
  trackEmit({
    component: "GbsAlarmModal",
    type: "acknowledge",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { id: props.alarm?.id, severity: props.alarm?.severity },
  });
  close("acknowledge");
}
function maskClick() {
  if (props.maskClosable) close("mask");
}

const mediaAdapter: MediaAdapter = createMockMediaAdapter()
onBeforeUnmount(() => {
  mediaAdapter.destroy()
})
</script>

<template>
  <Teleport :to="overlay.teleportTo">
    <Transition name="vp-gbs-alarm-modal-fade">
      <div
        v-if="open || !destroyOnClose"
        v-show="open"
        class="vp-gbs-alarm-modal__mask"
        :style="overlayStyle"
        data-component="GbsAlarmModal"
        @click.self="maskClick"
      >
        <section
          ref="dialogRef"
          :class="[
            'vp-gbs-alarm-modal__dialog',
            `vp-gbs-alarm-modal__dialog--${alarm?.severity ?? 'warning'}`,
            props.class,
          ]"
          :style="style"
          role="alertdialog"
          :aria-modal="overlay.ariaModal.value"
          :aria-label="ariaLabel"
          :aria-labelledby="ariaLabel ? undefined : titleId"
          :aria-describedby="descriptionId"
          :aria-busy="loading"
          tabindex="-1"
        >
          <header class="vp-gbs-alarm-modal__header">
            <div>
              <span class="vp-gbs-alarm-modal__severity" aria-hidden="true" />
              <h3 :id="titleId">{{ titleText }}</h3>
            </div>
            <button
              v-if="closable"
              type="button"
              :aria-label="t(LocaleKeys.common.close)"
              :disabled="loading"
              @click="close('close')"
            >
              ×
            </button>
          </header>
          <p :id="descriptionId" class="vp-gbs-alarm-modal__description">
            {{ descriptionText }}
          </p>
          <dl v-if="alarm" class="vp-gbs-alarm-modal__meta">
            <template v-if="alarm.deviceName || alarm.deviceId"
              ><dt>{{ t(LocaleKeys.industry.gbs.deviceId) }}</dt>
              <dd>{{ alarm.deviceName ?? alarm.deviceId }}</dd></template
            >
            <template v-if="alarm.channelName"
              ><dt>{{ t(LocaleKeys.industry.onvif.channel) }}</dt>
              <dd>{{ alarm.channelName }}</dd></template
            >
            <template v-if="alarm.time"
              ><dt>{{ t(LocaleKeys.industry.onvif.alarmTime) }}</dt>
              <dd>
                <time>{{ formatTime(alarm.time) }}</time>
              </dd></template
            >
            <template v-for="[key, value] in details" :key="key"
              ><dt>{{ key }}</dt>
              <dd>{{ value }}</dd></template
            >
          </dl>
          <div v-if="loading" class="vp-gbs-alarm-modal__loading" role="status">
            {{ t(LocaleKeys.common.loading) }}
          </div>
          <slot :alarm="alarm" />
          <footer class="vp-gbs-alarm-modal__actions">
            <slot
              name="actions"
              :alarm="alarm"
              :acknowledge="acknowledge"
              :close="close"
            >
              <button
                type="button"
                data-autofocus
                :disabled="disabled || loading"
                @click="acknowledge"
              >
                {{ t(LocaleKeys.industry.gbs.acknowledge) }}
              </button>
              <button
                v-if="closable"
                type="button"
                class="vp-gbs-alarm-modal__secondary"
                :disabled="loading"
                @click="close('close')"
              >
                {{ t(LocaleKeys.common.close) }}
              </button>
            </slot>
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>
