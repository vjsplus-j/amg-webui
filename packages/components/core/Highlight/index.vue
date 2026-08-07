<script setup lang="ts">
import { computed, watch } from 'vue'
import type { HighlightProps, HighlightSegment } from './types'
import './style.scss'

const props = withDefaults(defineProps<HighlightProps>(), {
  ignoreCase: true,
  variant: 'mark',
  matchWholeWord: false,
  compact: false
})

/** Inline — imported `HighlightEmits` is not expanded into runtime emits. */
const emit = defineEmits<{
  matchChange: [count: number]
}>()

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const keywords = computed(() =>
  (Array.isArray(props.keyword) ? props.keyword : [props.keyword])
    .filter((k): k is string => Boolean(k && String(k).length))
    .map((k) => escapeRegExp(String(k)))
    .sort((a, b) => b.length - a.length)
)

const segments = computed<HighlightSegment[]>(() => {
  const keys = keywords.value
  if (!keys.length || !props.text) {
    return [{ text: props.text ?? '', highlight: false }]
  }

  const wrap = props.matchWholeWord ? (k: string) => `\\b(?:${k})\\b` : (k: string) => k
  const body = keys.map(wrap).join('|')
  const flags = props.ignoreCase ? 'gi' : 'g'
  const pattern = new RegExp(`(${body})`, flags)
  const parts = props.text.split(pattern).filter((p) => p.length > 0)

  const testFlags = props.ignoreCase ? 'i' : ''
  const testPattern = new RegExp(`^(?:${body})$`, testFlags)

  return parts.map((part) => ({
    text: part,
    highlight: testPattern.test(part)
  }))
})

const matchCount = computed(
  () => segments.value.filter((s) => s.highlight).length
)

watch(
  matchCount,
  (count) => {
    emit('matchChange', count)
  },
  { immediate: true }
)

const rootStyle = computed(() => {
  const style: Record<string, string> = { ...(props.style ?? {}) }
  if (props.color) style['--vp-highlight-bg'] = props.color
  if (props.colorText) style['--vp-highlight-fg'] = props.colorText
  return style
})

const rootClass = computed(() => [
  'vp-highlight',
  `vp-highlight--${props.variant}`,
  { 'vp-highlight--compact': props.compact },
  props.class
])

const rootAriaLabel = computed(() => {
  if (props.ariaLabel) return props.ariaLabel
  if (!matchCount.value) return undefined
  return undefined
})

/** Prefer longer keywords first (already sorted); expose count for demos / a11y. */
const hasMatches = computed(() => matchCount.value > 0)
</script>

<template>
  <span
    :class="rootClass"
    :style="rootStyle"
    :aria-label="rootAriaLabel"
    :data-match-count="matchCount"
    :data-has-matches="hasMatches ? 'true' : 'false'"
  >
    <template v-for="(seg, idx) in segments" :key="idx">
      <mark
        v-if="seg.highlight"
        class="vp-highlight__mark"
        :aria-current="variant === 'mark' ? 'true' : undefined"
      >{{ seg.text }}</mark>
      <template v-else>{{ seg.text }}</template>
    </template>
  </span>
</template>
