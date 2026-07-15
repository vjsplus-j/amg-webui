<script setup lang="ts">
import { useLocale } from '@amg-webui/hooks'
import type { VcrSpeedControlProps, VcrSpeedControlEmits, VcrSpeed } from './types'
import './style.scss'
const props = withDefaults(defineProps<VcrSpeedControlProps>(), { modelValue: 1, disabled: false })
const emit = defineEmits<VcrSpeedControlEmits>()
const { t } = useLocale()
const speeds: VcrSpeed[] = [0.5, 1, 2, 4, 8]
function pick(s: VcrSpeed) { if (!props.disabled) { emit('update:modelValue', s); emit('change', s) } }
</script>
<template>
  <div :class="['vp-vcr-speed-control', 'vp-vcr-speed-control__panel', props.class]" :style="style" data-component="VcrSpeedControl">
    <h3 class="vp-vcr-speed-control__title">{{ t('industry.vcr.speed') }}</h3>
    <div class="vp-vcr-speed-control__speeds">
      <button v-for="s in speeds" :key="s" type="button" :class="['vp-vcr-speed-control__btn', { 'vp-vcr-speed-control__btn--active': modelValue === s }]" :disabled="disabled" @click="pick(s)">{{ s }}×</button>
    </div>
  </div>
</template>