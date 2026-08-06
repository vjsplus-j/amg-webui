<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import type { Ink404Props, Ink404Emits } from './types'
import './style.scss'

const props = withDefaults(defineProps<Ink404Props>(), {
  code: 404,
  disabled: false,
  loading: false,
  retryable: false,
  telemetry: undefined
})
const emit = defineEmits<Ink404Emits>()
const { t } = useLocale()
const titleText = computed(() => props.title ?? t('error.notFound'))
const leadText = computed(() => props.description ?? t('component.ink404.lead'))
const rootClass = computed(() => [
  'vp-ink404',
  'vp-ink404__panel',
  { 'vp-ink404--disabled': props.disabled, 'vp-ink404--loading': props.loading },
  props.class
])

function activate(event: MouseEvent) {
  if (props.disabled || props.loading) return
  trackEmit({
    component: 'Ink404',
    type: 'click',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { action: 'continue' }
  })
  emit('update:modelValue', 'continue')
  emit('change', 'continue')
  emit('click', event)
}

function retry(event: MouseEvent) {
  if (props.disabled || props.loading) return
  trackEmit({
    component: 'Ink404',
    type: 'retry',
    trackId: props.trackId,
    telemetry: props.telemetry
  })
  emit('retry', event)
}
</script>

<template>
  <div :class="rootClass" :style="style" data-component="Ink404" data-variant="ink404" role="status" :aria-busy="loading || undefined">
    <div class="vp-ink404__body">
      <p class="vp-ink404__code" aria-hidden="true">{{ code }}</p>
      <h1 class="vp-ink404__title">{{ titleText }}</h1>
      <p class="vp-ink404__muted">{{ leadText }}</p>
      <div class="vp-ink404__toolbar">
        <slot>
          <button type="button" class="vp-ink404__action" :disabled="disabled || loading" @click="activate">
            {{ actionText ?? t('button.continue') }}
          </button>
          <button v-if="retryable" type="button" class="vp-ink404__action vp-ink404__action--ghost" :disabled="disabled || loading" @click="retry">
            {{ t('button.refresh') }}
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>
