<script setup lang="ts">
import { createMockMediaAdapter, type MediaAdapter } from '@amg-webui/utils'
import { ref, watch, computed, onBeforeUnmount } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { VcrClipCutProps, VcrClipCutEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<VcrClipCutProps>(), {
  start: 0,
  end: 60,
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<VcrClipCutEmits>()
const { t } = useLocale()
const s = ref(props.start ?? 0)
const e = ref(props.end ?? 60)

watch(() => props.start, (v) => { s.value = v ?? 0 })
watch(() => props.end, (v) => { e.value = v ?? 0 })

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.vcr.cut))
const rangeLabel = computed(() => `${s.value} – ${e.value}`)

function patchStart(ev: Event) {
  const v = Number((ev.target as HTMLInputElement).value)
  s.value = v
  emit('update:start', v)
}

function patchEnd(ev: Event) {
  const v = Number((ev.target as HTMLInputElement).value)
  e.value = v
  emit('update:end', v)
}

function cutClip() {
  if (props.disabled || props.loading) return
  emit('cut', { start: s.value, end: e.value })
  trackEmit({ component: 'VcrClipCut', type: 'cut', trackId: props.trackId, telemetry: props.telemetry })
}

function resetRange() {
  if (props.disabled || props.loading) return
  s.value = props.start ?? 0
  e.value = props.end ?? 60
  trackEmit({ component: 'VcrClipCut', type: 'reset', trackId: props.trackId, telemetry: props.telemetry })
}

const mediaAdapter: MediaAdapter = createMockMediaAdapter()
onBeforeUnmount(() => {
  mediaAdapter.destroy()
})
</script>

<template>
  <section
    :class="['vp-vcr-clip-cut', 'vp-vcr-clip-cut__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-vcr-clip-cut-title"
    data-component="VcrClipCut"
  >
    <header class="vp-vcr-clip-cut__header">
      <h3 id="vp-vcr-clip-cut-title" class="vp-vcr-clip-cut__title">{{ titleText }}</h3>
      <div class="vp-vcr-clip-cut__status" role="status" aria-live="polite">{{ rangeLabel }}</div>
    </header>
    <div v-if="loading" class="vp-vcr-clip-cut__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-vcr-clip-cut__body">
      <label class="vp-vcr-clip-cut__field">
        <span class="vp-vcr-clip-cut__label">{{ t(LocaleKeys.industry.vcr.clipStart) }}</span>
        <input type="number" class="vp-vcr-clip-cut__input" :value="s" :disabled="disabled" @input="patchStart" />
      </label>
      <label class="vp-vcr-clip-cut__field">
        <span class="vp-vcr-clip-cut__label">{{ t(LocaleKeys.industry.vcr.clipEnd) }}</span>
        <input type="number" class="vp-vcr-clip-cut__input" :value="e" :disabled="disabled" @input="patchEnd" />
      </label>
      <div class="vp-vcr-clip-cut__toolbar">
        <button type="button" class="vp-vcr-clip-cut__btn" :disabled="disabled" @click="cutClip">{{ t(LocaleKeys.industry.vcr.cut) }}</button>
        <button type="button" class="vp-vcr-clip-cut__btn vp-vcr-clip-cut__btn--ghost" :disabled="disabled" @click="resetRange">
          {{ t(LocaleKeys.button.reset) }}
        </button>
      </div>
      <slot />
    </div>
  </section>
</template>
