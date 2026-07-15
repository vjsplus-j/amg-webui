<script setup lang="ts">
import { computed } from 'vue'
import type { HighlightProps, HighlightSegment } from './types'
import './style.scss'

const props = withDefaults(defineProps<HighlightProps>(), {
  ignoreCase: true
})

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const segments = computed<HighlightSegment[]>(() => {
  const keywords = (Array.isArray(props.keyword) ? props.keyword : [props.keyword])
    .filter((k): k is string => Boolean(k && String(k).length))
    .map((k) => escapeRegExp(String(k)))
    // Longer keywords first so alternation prefers fuller matches
    .sort((a, b) => b.length - a.length)

  if (!keywords.length || !props.text) {
    return [{ text: props.text ?? '', highlight: false }]
  }

  const flags = props.ignoreCase ? 'gi' : 'g'
  const pattern = new RegExp(`(${keywords.join('|')})`, flags)
  const parts = props.text.split(pattern).filter((p) => p.length > 0)

  return parts.map((part) => {
    const testPattern = new RegExp(
      `^(${keywords.join('|')})$`,
      props.ignoreCase ? 'i' : ''
    )
    return { text: part, highlight: testPattern.test(part) }
  })
})

const rootStyle = computed(() => {
  const style: Record<string, string> = { ...(props.style ?? {}) }
  if (props.color) style['--vp-highlight-bg'] = props.color
  if (props.colorText) style['--vp-highlight-fg'] = props.colorText
  return style
})
</script>

<template>
  <span :class="['vp-highlight', props.class]" :style="rootStyle">
    <template v-for="(seg, idx) in segments" :key="idx">
      <mark v-if="seg.highlight" class="vp-highlight__mark">{{ seg.text }}</mark>
      <template v-else>{{ seg.text }}</template>
    </template>
  </span>
</template>
