<script setup lang="ts">
import { ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { VcrSearchPanelProps, VcrSearchPanelEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<VcrSearchPanelProps>(), { date: '2026-07-14', device: 'IPC-001', disabled: false, loading: false })
const emit = defineEmits<VcrSearchPanelEmits>()
const { t } = useLocale()
const d = ref(props.date), dev = ref(props.device)
watch(() => props.date, v => { d.value = v ?? '' })
watch(() => props.device, v => { dev.value = v ?? '' })
</script>
<template>
  <form :class="['vp-vcr-search-panel', 'vp-vcr-search-panel__panel', props.class]" :style="style" data-component="VcrSearchPanel" @submit.prevent="emit('search')">
    <h3 class="vp-vcr-search-panel__title">{{ t('common.search') }}</h3>
    <label class="vp-vcr-search-panel__field"><span class="vp-vcr-search-panel__label">{{ t('industry.vcr.searchDate') }}</span><input class="vp-vcr-search-panel__input" type="date" :value="d" :disabled="disabled" @input="d = ($event.target as HTMLInputElement).value; emit('update:date', d)" /></label>
    <label class="vp-vcr-search-panel__field"><span class="vp-vcr-search-panel__label">{{ t('industry.vcr.searchDevice') }}</span><input class="vp-vcr-search-panel__input" :value="dev" :disabled="disabled" @input="dev = ($event.target as HTMLInputElement).value; emit('update:device', dev)" /></label>
    <button type="submit" class="vp-vcr-search-panel__btn" :disabled="disabled || loading">{{ loading ? t('common.loading') : t('common.search') }}</button>
  </form>
</template>