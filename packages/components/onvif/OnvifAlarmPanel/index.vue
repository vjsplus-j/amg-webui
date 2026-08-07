<script setup lang="ts">
import { createMockMediaAdapter, type MediaAdapter } from '@amg-webui/utils'
import { computed, onBeforeUnmount } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { OnvifAlarmPanelProps, OnvifAlarmPanelEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<OnvifAlarmPanelProps>(), {
  alarms: () => [
    { id: 'a1', type: 'motion', time: '2026-07-14 10:00:00' },
    { id: 'a2', type: 'tamper', time: '2026-07-14 09:30:00' }
  ],
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<OnvifAlarmPanelEmits>()
const { t } = useLocale()

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.onvif.alarm))
const isEmpty = computed(() => !props.alarms?.length)

function ackAll() {
  if (props.disabled || props.loading || isEmpty.value) return
  for (const row of props.alarms ?? []) emit('acknowledge', row.id)
  trackEmit({ component: 'OnvifAlarmPanel', type: 'ack-all', trackId: props.trackId, telemetry: props.telemetry })
}

function ackOne(id: string) {
  if (props.disabled || props.loading) return
  emit('acknowledge', id)
  trackEmit({ component: 'OnvifAlarmPanel', type: 'acknowledge', trackId: props.trackId, telemetry: props.telemetry })
}

const mediaAdapter: MediaAdapter = createMockMediaAdapter()
onBeforeUnmount(() => {
  mediaAdapter.destroy()
})
</script>

<template>
  <section
    :class="['vp-onvif-alarm-panel', 'vp-onvif-alarm-panel__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-onvif-alarm-panel-title"
    data-component="OnvifAlarmPanel"
  >
    <header class="vp-onvif-alarm-panel__header">
      <h3 id="vp-onvif-alarm-panel-title" class="vp-onvif-alarm-panel__title">{{ titleText }}</h3>
      <div class="vp-onvif-alarm-panel__status" role="status" aria-live="polite">{{ alarms?.length ?? 0 }}</div>
    </header>
    <div v-if="loading" class="vp-onvif-alarm-panel__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-onvif-alarm-panel__body">
      <div class="vp-onvif-alarm-panel__toolbar">
        <button type="button" class="vp-onvif-alarm-panel__btn" :disabled="disabled || isEmpty" @click="ackAll">
          {{ t(LocaleKeys.industry.gbs.acknowledge) }}
        </button>
        <button type="button" class="vp-onvif-alarm-panel__btn vp-onvif-alarm-panel__btn--ghost" :disabled="disabled" @click="ackAll">
          {{ t(LocaleKeys.button.refresh) }}
        </button>
      </div>
      <p v-if="isEmpty" class="vp-onvif-alarm-panel__empty" role="status">{{ t(LocaleKeys.industry.common.noAlarms) }}</p>
      <ul v-else class="vp-onvif-alarm-panel__list" role="list">
        <li v-for="row in alarms" :key="row.id" class="vp-onvif-alarm-panel__item">
          <span class="vp-onvif-alarm-panel__badge vp-onvif-alarm-panel__badge--on">{{ row.type }}</span>
          <span>{{ row.time }}</span>
          <button type="button" class="vp-onvif-alarm-panel__btn vp-onvif-alarm-panel__btn--ghost" :disabled="disabled" @click="ackOne(row.id)">
            {{ t(LocaleKeys.industry.gbs.acknowledge) }}
          </button>
        </li>
      </ul>
      <slot />
    </div>
  </section>
</template>
