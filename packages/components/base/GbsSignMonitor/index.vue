<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { GbsSignMonitorProps, GbsSignMonitorEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<GbsSignMonitorProps>(), {
  logs: () => [
    { id: '1', type: 'REGISTER', message: 'SIP/2.0 200 OK', time: '10:00:01' },
    { id: '2', type: 'KEEPALIVE', message: 'MESSAGE sip:...', time: '10:00:31' }
  ],
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<GbsSignMonitorEmits>()
const { t } = useLocale()

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.gbs.signLog))
const countLabel = computed(() => String(props.logs?.length ?? 0))
const isEmpty = computed(() => !props.logs?.length)

function refresh() {
  if (props.disabled || props.loading) return
  emit('refresh')
  trackEmit({ component: 'GbsSignMonitor', type: 'refresh', trackId: props.trackId, telemetry: props.telemetry })
}

function clearView() {
  trackEmit({ component: 'GbsSignMonitor', type: 'clear', trackId: props.trackId, telemetry: props.telemetry })
}
</script>

<template>
  <section
    :class="['vp-gbs-sign-monitor', 'vp-gbs-sign-monitor__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-gbs-sign-monitor-title"
    data-component="GbsSignMonitor"
  >
    <header class="vp-gbs-sign-monitor__header">
      <h3 id="vp-gbs-sign-monitor-title" class="vp-gbs-sign-monitor__title">{{ titleText }}</h3>
      <div class="vp-gbs-sign-monitor__status" role="status" aria-live="polite">{{ countLabel }}</div>
    </header>
    <div v-if="loading" class="vp-gbs-sign-monitor__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-gbs-sign-monitor__body">
      <div class="vp-gbs-sign-monitor__toolbar">
        <button type="button" class="vp-gbs-sign-monitor__btn" :disabled="disabled" @click="refresh">
          {{ t(LocaleKeys.button.refresh) }}
        </button>
        <button type="button" class="vp-gbs-sign-monitor__btn vp-gbs-sign-monitor__btn--ghost" :disabled="disabled" @click="clearView">
          {{ t(LocaleKeys.button.reset) }}
        </button>
      </div>
      <p v-if="isEmpty" class="vp-gbs-sign-monitor__empty" role="status">{{ t(LocaleKeys.industry.common.noLogs) }}</p>
      <ul v-else class="vp-gbs-sign-monitor__list" role="log" aria-live="polite">
        <li v-for="row in logs" :key="row.id" class="vp-gbs-sign-monitor__log">
          <span class="vp-gbs-sign-monitor__badge vp-gbs-sign-monitor__badge--on">{{ row.type }}</span>
          <span>{{ row.message }}</span>
          <span class="vp-gbs-sign-monitor__muted">{{ row.time }}</span>
        </li>
      </ul>
      <slot />
    </div>
  </section>
</template>
