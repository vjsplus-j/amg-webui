<script setup lang="ts">
import { ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { VcrClipCutProps, VcrClipCutEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<VcrClipCutProps>(), { start: 0, end: 60, disabled: false })
const emit = defineEmits<VcrClipCutEmits>()
const { t } = useLocale()
const s = ref(props.start), e = ref(props.end)
watch(() => props.start, v => { s.value = v ?? 0 })
watch(() => props.end, v => { e.value = v ?? 0 })
function cut() { emit('cut', { start: s.value, end: e.value }) }
</script>
<template>
  <div :class="['vp-vcr-clip-cut', 'vp-vcr-clip-cut__panel', props.class]" :style="style" data-component="VcrClipCut">
    <h3 class="vp-vcr-clip-cut__title">{{ t('industry.vcr.cut') }}</h3>
    <label class="vp-vcr-clip-cut__field"><span class="vp-vcr-clip-cut__label">{{ t('industry.vcr.clipStart') }}</span><input class="vp-vcr-clip-cut__input" type="number" min="0" :value="s" :disabled="disabled" @input="s = Number(($event.target as HTMLInputElement).value); emit('update:start', s)" /></label>
    <label class="vp-vcr-clip-cut__field"><span class="vp-vcr-clip-cut__label">{{ t('industry.vcr.clipEnd') }}</span><input class="vp-vcr-clip-cut__input" type="number" min="0" :value="e" :disabled="disabled" @input="e = Number(($event.target as HTMLInputElement).value); emit('update:end', e)" /></label>
    <button type="button" class="vp-vcr-clip-cut__btn" :disabled="disabled" @click="cut">{{ t('industry.vcr.cut') }}</button>
  </div>
</template>