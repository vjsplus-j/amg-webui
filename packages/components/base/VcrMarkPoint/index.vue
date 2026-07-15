<script setup lang="ts">
import { ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { VcrMarkPointProps, VcrMarkPointEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<VcrMarkPointProps>(), {
  marks: () => [
    { id: 'm1', time: 120, label: 'Incident A' },
    { id: 'm2', time: 480, label: 'Motion peak' },
  ],
  disabled: false
})
const emit = defineEmits<VcrMarkPointEmits>()
const { t } = useLocale()
const label = ref('')
function add() {
  if (!label.value.trim() || props.disabled) return
  emit('add', { time: 0, label: label.value.trim() })
  label.value = ''
}
</script>
<template>
  <div :class="['vp-vcr-mark-point', 'vp-vcr-mark-point__panel', props.class]" :style="style" data-component="VcrMarkPoint">
    <h3 class="vp-vcr-mark-point__title">{{ t('industry.vcr.mark') }}</h3>
    <ul class="vp-vcr-mark-point__list">
      <li v-for="m in marks" :key="m.id" class="vp-vcr-mark-point__item">
        <button type="button" class="vp-vcr-mark-point__btn vp-vcr-mark-point__btn--ghost" :disabled="disabled" @click="emit('select', m.id)">{{ m.label }} ({{ m.time }}s)</button>
        <button type="button" class="vp-vcr-mark-point__btn vp-vcr-mark-point__btn--ghost" :disabled="disabled" @click="emit('remove', m.id)">{{ t('button.delete') }}</button>
      </li>
    </ul>
    <div class="vp-vcr-mark-point__toolbar">
      <input v-model="label" class="vp-vcr-mark-point__input" type="text" :placeholder="t('industry.vcr.mark')" :disabled="disabled" />
      <button type="button" class="vp-vcr-mark-point__btn" :disabled="disabled" @click="add">{{ t('industry.vcr.addMark') }}</button>
    </div>
  </div>
</template>