<script setup lang="ts">
import { createMockMediaAdapter, type MediaAdapter } from '@amg-webui/utils'
import { ref, computed, onBeforeUnmount } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { VcrMarkPointProps, VcrMarkPointEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<VcrMarkPointProps>(), {
  marks: () => [
    { id: 'm1', time: 120, label: 'Incident A' },
    { id: 'm2', time: 480, label: 'Motion peak' }
  ],
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<VcrMarkPointEmits>()
const { t } = useLocale()
const label = ref('')
const time = ref(0)

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.vcr.mark))
const isEmpty = computed(() => !props.marks?.length)

function addMark() {
  if (props.disabled || props.loading || !label.value.trim()) return
  emit('add', { time: time.value, label: label.value.trim() })
  label.value = ''
  trackEmit({ component: 'VcrMarkPoint', type: 'add', trackId: props.trackId, telemetry: props.telemetry })
}

function selectMark(id: string) {
  if (props.disabled || props.loading) return
  emit('select', id)
  trackEmit({ component: 'VcrMarkPoint', type: 'select', trackId: props.trackId, telemetry: props.telemetry })
}

function removeMark(id: string) {
  if (props.disabled || props.loading) return
  emit('remove', id)
  trackEmit({ component: 'VcrMarkPoint', type: 'remove', trackId: props.trackId, telemetry: props.telemetry })
}

const mediaAdapter: MediaAdapter = createMockMediaAdapter()
onBeforeUnmount(() => {
  mediaAdapter.destroy()
})
</script>

<template>
  <section
    :class="['vp-vcr-mark-point', 'vp-vcr-mark-point__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-vcr-mark-point-title"
    data-component="VcrMarkPoint"
  >
    <header class="vp-vcr-mark-point__header">
      <h3 id="vp-vcr-mark-point-title" class="vp-vcr-mark-point__title">{{ titleText }}</h3>
      <div class="vp-vcr-mark-point__status" role="status" aria-live="polite">{{ marks?.length ?? 0 }}</div>
    </header>
    <div v-if="loading" class="vp-vcr-mark-point__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-vcr-mark-point__body">
      <label class="vp-vcr-mark-point__field">
        <span class="vp-vcr-mark-point__label">{{ t(LocaleKeys.industry.vcr.addMark) }}</span>
        <input v-model="label" class="vp-vcr-mark-point__input" :disabled="disabled" />
      </label>
      <div class="vp-vcr-mark-point__toolbar">
        <button type="button" class="vp-vcr-mark-point__btn" :disabled="disabled || !label.trim()" @click="addMark">
          {{ t(LocaleKeys.industry.vcr.addMark) }}
        </button>
        <button type="button" class="vp-vcr-mark-point__btn vp-vcr-mark-point__btn--ghost" :disabled="disabled" @click="label = ''">
          {{ t(LocaleKeys.button.reset) }}
        </button>
      </div>
      <p v-if="isEmpty" class="vp-vcr-mark-point__empty" role="status">{{ t(LocaleKeys.industry.common.noMarks) }}</p>
      <ul v-else class="vp-vcr-mark-point__list" role="list">
        <li v-for="m in marks" :key="m.id" class="vp-vcr-mark-point__item">
          <button type="button" class="vp-vcr-mark-point__btn vp-vcr-mark-point__btn--ghost" :disabled="disabled" @click="selectMark(m.id)">{{ m.label }}</button>
          <span class="vp-vcr-mark-point__muted">{{ m.time }}</span>
          <button type="button" class="vp-vcr-mark-point__btn vp-vcr-mark-point__btn--danger" :disabled="disabled" @click="removeMark(m.id)">
            {{ t(LocaleKeys.button.delete) }}
          </button>
        </li>
      </ul>
      <slot />
    </div>
  </section>
</template>
