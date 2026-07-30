<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { GbsAlarmModalProps, GbsAlarmModalEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<GbsAlarmModalProps>(), {
  open: false,
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<GbsAlarmModalEmits>()
const { t } = useLocale()

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.gbs.alarmTitle))
const descText = computed(() => props.description ?? t(LocaleKeys.industry.gbs.alarmDesc))

function close() {
  emit('update:open', false)
  emit('close')
  trackEmit({ component: 'GbsAlarmModal', type: 'close', trackId: props.trackId, telemetry: props.telemetry })
}

function ack() {
  if (props.disabled || props.loading) return
  emit('acknowledge')
  trackEmit({ component: 'GbsAlarmModal', type: 'acknowledge', trackId: props.trackId, telemetry: props.telemetry })
  close()
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="vp-gbs-alarm-modal__modal"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="'vp-gbs-alarm-modal-title'"
      data-component="GbsAlarmModal"
      @click.self="close"
      @keydown.esc="close"
    >
      <div :class="['vp-gbs-alarm-modal__dialog', props.class]" :style="style">
        <header class="vp-gbs-alarm-modal__header">
          <h3 id="vp-gbs-alarm-modal-title" class="vp-gbs-alarm-modal__title">{{ titleText }}</h3>
          <span class="vp-gbs-alarm-modal__badge vp-gbs-alarm-modal__badge--on" role="status">
            {{ t(LocaleKeys.industry.onvif.alarm) }}
          </span>
        </header>
        <p class="vp-gbs-alarm-modal__muted">{{ descText }}</p>
        <div v-if="loading" class="vp-gbs-alarm-modal__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
        <div class="vp-gbs-alarm-modal__toolbar">
          <button type="button" class="vp-gbs-alarm-modal__btn" :disabled="disabled || loading" @click="ack">
            {{ t(LocaleKeys.industry.gbs.acknowledge) }}
          </button>
          <button type="button" class="vp-gbs-alarm-modal__btn vp-gbs-alarm-modal__btn--ghost" @click="close">
            {{ t(LocaleKeys.common.close) }}
          </button>
        </div>
        <slot />
      </div>
    </div>
  </Teleport>
</template>
