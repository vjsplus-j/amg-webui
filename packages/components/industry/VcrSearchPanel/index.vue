<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { VcrSearchPanelProps, VcrSearchPanelEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<VcrSearchPanelProps>(), {
  date: '2026-07-14',
  device: 'IPC-001',
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<VcrSearchPanelEmits>()
const { t } = useLocale()
const d = ref(props.date ?? '')
const dev = ref(props.device ?? '')

watch(() => props.date, (v) => { d.value = v ?? '' })
watch(() => props.device, (v) => { dev.value = v ?? '' })

const titleText = computed(() => props.title ?? t(LocaleKeys.common.search))

function search() {
  if (props.disabled || props.loading) return
  emit('search')
  trackEmit({ component: 'VcrSearchPanel', type: 'search', trackId: props.trackId, telemetry: props.telemetry })
}

function resetForm() {
  if (props.disabled || props.loading) return
  d.value = props.date ?? ''
  dev.value = props.device ?? ''
  trackEmit({ component: 'VcrSearchPanel', type: 'reset', trackId: props.trackId, telemetry: props.telemetry })
}
</script>

<template>
  <section
    :class="['vp-vcr-search-panel', 'vp-vcr-search-panel__panel', props.class]"
    :style="style"
    role="search"
    aria-labelledby="vp-vcr-search-panel-title"
    data-component="VcrSearchPanel"
  >
    <header class="vp-vcr-search-panel__header">
      <h3 id="vp-vcr-search-panel-title" class="vp-vcr-search-panel__title">{{ titleText }}</h3>
      <div class="vp-vcr-search-panel__status" role="status" aria-live="polite">{{ dev }}</div>
    </header>
    <div v-if="loading" class="vp-vcr-search-panel__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <form v-else class="vp-vcr-search-panel__body" @submit.prevent="search">
      <label class="vp-vcr-search-panel__field">
        <span class="vp-vcr-search-panel__label">{{ t(LocaleKeys.industry.vcr.searchDate) }}</span>
        <input class="vp-vcr-search-panel__input" type="date" :value="d" :disabled="disabled" @input="d = ($event.target as HTMLInputElement).value; emit('update:date', d)" />
      </label>
      <label class="vp-vcr-search-panel__field">
        <span class="vp-vcr-search-panel__label">{{ t(LocaleKeys.industry.vcr.searchDevice) }}</span>
        <input class="vp-vcr-search-panel__input" :value="dev" :disabled="disabled" @input="dev = ($event.target as HTMLInputElement).value; emit('update:device', dev)" />
      </label>
      <div class="vp-vcr-search-panel__toolbar">
        <button type="submit" class="vp-vcr-search-panel__btn" :disabled="disabled">{{ t(LocaleKeys.common.search) }}</button>
        <button type="button" class="vp-vcr-search-panel__btn vp-vcr-search-panel__btn--ghost" :disabled="disabled" @click="resetForm">
          {{ t(LocaleKeys.button.reset) }}
        </button>
      </div>
      <slot />
    </form>
  </section>
</template>
