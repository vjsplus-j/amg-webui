<script setup lang="ts">
import { computed, ref, onUnmounted } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import Icon from '@amg-webui/core/Icon/index.vue'
import type { Size } from '@amg-webui/types'
import type { CopyTextEmits } from './types'
import { trackEmit } from '@amg-webui/telemetry'
import './style.scss'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    text: string
    label?: string
    truncate?: boolean
    maxWidth?: string
    size?: Size
    showButton?: boolean
    copyTooltip?: string
    trackId?: string
    telemetry?: boolean
    class?: string
    style?: Record<string, string>
  }>(),
  {
    truncate: true,
    size: 'md',
    showButton: true,
    /** Vue Boolean omit → false; keep undefined so tracking inherits global enable */
    telemetry: undefined
  }
)

const emit = defineEmits<CopyTextEmits>()

const { t } = useLocale()
const copied = ref(false)
let resetTimer: ReturnType<typeof setTimeout> | 0 = 0

const displayLabel = computed(() => props.label ?? props.text)
const copyLabel = computed(() => props.copyTooltip ?? t(LocaleKeys.common.copy))
const feedbackLabel = computed(() =>
  copied.value ? t(LocaleKeys.common.copied) : copyLabel.value
)

const rootClass = computed(() => [
  'vp-copy-text',
  `vp-copy-text--${props.size}`,
  {
    'vp-copy-text--truncate': props.truncate,
    'vp-copy-text--copied': copied.value
  },
  props.class
])

const rootStyle = computed(() => {
  const s: Record<string, string> = { ...(props.style || {}) }
  if (props.maxWidth) s.maxWidth = props.maxWidth
  return s
})

async function copyToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }
  const ta = document.createElement('textarea')
  ta.value = value
  ta.setAttribute('readonly', '')
  ta.style.position = 'fixed'
  ta.style.left = '-9999px'
  document.body.appendChild(ta)
  ta.select()
  const ok = document.execCommand('copy')
  document.body.removeChild(ta)
  if (!ok) throw new Error('copy-failed')
}

async function onCopy() {
  try {
    await copyToClipboard(props.text)
    copied.value = true
    trackEmit({
      component: 'CopyText',
      type: 'copy',
      trackId: props.trackId,
      telemetry: props.telemetry
    })
    emit('copy', props.text)
    if (resetTimer) clearTimeout(resetTimer)
    resetTimer = setTimeout(() => {
      copied.value = false
      resetTimer = 0
    }, 1800)
  } catch (err) {
    trackEmit({
      component: 'CopyText',
      type: 'copyError',
      category: 'error',
      trackId: props.trackId,
      telemetry: props.telemetry
    })
    emit('copyError', err)
    emit('error', err)
  }
}

onUnmounted(() => {
  if (resetTimer) clearTimeout(resetTimer)
})
</script>

<template>
  <span :class="rootClass" :style="rootStyle">
    <span class="vp-copy-text__value" :title="displayLabel">
      <slot>{{ displayLabel }}</slot>
    </span>
    <button
      v-if="showButton"
      type="button"
      class="vp-copy-text__btn"
      :aria-label="feedbackLabel"
      :title="feedbackLabel"
      @click="onCopy"
    >
      <Icon :name="copied ? 'Check' : 'Copy'" :size="size" />
    </button>
  </span>
</template>
