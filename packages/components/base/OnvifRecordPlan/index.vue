<script setup lang="ts">
import { ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { OnvifRecordPlanProps, OnvifRecordPlanEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<OnvifRecordPlanProps>(), {
  slots: () => Array.from({ length: 24 }, (_, i) => i >= 8 && i < 20), disabled: false
})
const emit = defineEmits<OnvifRecordPlanEmits>()
const { t } = useLocale()
const grid = ref([...(props.slots ?? [])])
watch(() => props.slots, v => { if (v) grid.value = [...v] }, { deep: true })
function toggle(i: number) {
  if (props.disabled) return
  grid.value[i] = !grid.value[i]
  emit('update:slots', [...grid.value])
  emit('toggle', i, grid.value[i])
}
</script>
<template>
  <div :class="['vp-onvif-record-plan', 'vp-onvif-record-plan__panel', props.class]" :style="style" data-component="OnvifRecordPlan">
    <h3 class="vp-onvif-record-plan__title">{{ t('industry.onvif.recordPlan') }}</h3>
    <p class="vp-onvif-record-plan__muted">{{ t('industry.onvif.schedule') }} (24h)</p>
    <div class="vp-onvif-record-plan__grid-schedule">
      <button v-for="(on, i) in grid" :key="i" type="button" :class="['vp-onvif-record-plan__slot', { 'vp-onvif-record-plan__slot--on': on }]" :disabled="disabled" :aria-label="String(i)" @click="toggle(i)" />
    </div>
  </div>
</template>