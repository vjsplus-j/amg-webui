<script setup lang="ts">
import { ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { GbsCascadePanelProps, GbsCascadePanelEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<GbsCascadePanelProps>(), { upstream: '34020000001110000001', downstream: '34020000001320000002', disabled: false })
const emit = defineEmits<GbsCascadePanelEmits>()
const { t } = useLocale()
const up = ref(props.upstream), down = ref(props.downstream)
watch(() => props.upstream, v => { up.value = v ?? '' })
watch(() => props.downstream, v => { down.value = v ?? '' })
</script>
<template>
  <div :class="['vp-gbs-cascade-panel', 'vp-gbs-cascade-panel__panel', props.class]" :style="style" data-component="GbsCascadePanel">
    <h3 class="vp-gbs-cascade-panel__title">{{ t('industry.gbs.cascade') }}</h3>
    <label class="vp-gbs-cascade-panel__field"><span class="vp-gbs-cascade-panel__label">{{ t('industry.gbs.upstream') }}</span><input class="vp-gbs-cascade-panel__input" :value="up" :disabled="disabled" @input="up = ($event.target as HTMLInputElement).value; emit('update:upstream', up)" /></label>
    <label class="vp-gbs-cascade-panel__field"><span class="vp-gbs-cascade-panel__label">{{ t('industry.gbs.downstream') }}</span><input class="vp-gbs-cascade-panel__input" :value="down" :disabled="disabled" @input="down = ($event.target as HTMLInputElement).value; emit('update:downstream', down)" /></label>
    <button type="button" class="vp-gbs-cascade-panel__btn" :disabled="disabled" @click="emit('save')">{{ t('button.save') }}</button>
  </div>
</template>