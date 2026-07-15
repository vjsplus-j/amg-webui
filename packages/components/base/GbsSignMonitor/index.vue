<script setup lang="ts">
import { useLocale } from '@amg-webui/hooks'
import type { GbsSignMonitorProps, GbsSignMonitorEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<GbsSignMonitorProps>(), {
  logs: () => [
    { id: '1', type: 'REGISTER', message: 'SIP/2.0 200 OK', time: '10:00:01' },
    { id: '2', type: 'KEEPALIVE', message: 'MESSAGE sip:...', time: '10:00:31' },
    { id: '3', type: 'INVITE', message: 'INVITE sip:340200...', time: '10:01:05' },
  ],
  disabled: false
})
const emit = defineEmits<GbsSignMonitorEmits>()
const { t } = useLocale()
</script>
<template>
  <div :class="['vp-gbs-sign-monitor', 'vp-gbs-sign-monitor__panel', props.class]" :style="style" data-component="GbsSignMonitor">
    <div class="vp-gbs-sign-monitor__toolbar">
      <h3 class="vp-gbs-sign-monitor__title">{{ t('industry.gbs.signLog') }}</h3>
      <button type="button" class="vp-gbs-sign-monitor__btn vp-gbs-sign-monitor__btn--ghost" :disabled="disabled" @click="emit('refresh')">{{ t('button.refresh') }}</button>
    </div>
    <ul class="vp-gbs-sign-monitor__list">
      <li v-for="l in logs" :key="l.id" class="vp-gbs-sign-monitor__log"><span class="vp-gbs-sign-monitor__badge vp-gbs-sign-monitor__badge--on">{{ l.type }}</span> {{ l.time }} — {{ l.message }}</li>
    </ul>
  </div>
</template>