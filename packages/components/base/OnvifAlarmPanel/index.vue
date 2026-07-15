<script setup lang="ts">
import { useLocale } from '@amg-webui/hooks'
import type { OnvifAlarmPanelProps, OnvifAlarmPanelEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<OnvifAlarmPanelProps>(), {
  alarms: () => [
    { id: 'a1', type: 'motion', time: '2026-07-14 10:00:00' },
    { id: 'a2', type: 'tamper', time: '2026-07-14 09:30:00' },
  ],
  disabled: false
})
const emit = defineEmits<OnvifAlarmPanelEmits>()
const { t } = useLocale()
</script>
<template>
  <div :class="['vp-onvif-alarm-panel', 'vp-onvif-alarm-panel__panel', props.class]" :style="style" data-component="OnvifAlarmPanel">
    <h3 class="vp-onvif-alarm-panel__title">{{ t('industry.onvif.alarm') }}</h3>
    <ul class="vp-onvif-alarm-panel__list">
      <li v-for="a in alarms" :key="a.id" class="vp-onvif-alarm-panel__toolbar">
        <span><strong>{{ a.type }}</strong> · {{ a.time }}</span>
        <button type="button" class="vp-onvif-alarm-panel__btn vp-onvif-alarm-panel__btn--ghost" :disabled="disabled" @click="emit('acknowledge', a.id)">{{ t('industry.gbs.acknowledge') }}</button>
      </li>
    </ul>
  </div>
</template>