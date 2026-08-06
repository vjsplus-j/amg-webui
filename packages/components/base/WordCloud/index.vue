<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { toLabelSeries, chartColor } from '@amg-webui/utils/data-display/chartHelpers'
import type { WordCloudEmits, WordCloudProps } from './types'
import { useWordCloudSelection } from './useWordCloudSelection'
import './style.scss'

const props = withDefaults(defineProps<WordCloudProps>(), {
  data: () => [],
  minFontSize: 12,
  maxFontSize: 32,
  rotate: true,
  showValues: false,
  selectable: true
})
const emit = defineEmits<WordCloudEmits>()
const { t } = useLocale()
const { isSelected, selectWord } = useWordCloudSelection(props, emit)

const words = computed(() => {
  const items = toLabelSeries(props.data).map((item, index) => ({ ...item, index }))
  const max = Math.max(1, ...items.map((d) => d.value))
  return items.map((d, i) => ({
    ...d,
    size: props.minFontSize + (d.value / max) * (props.maxFontSize - props.minFontSize),
    x: 30 + (i % 3) * 70 + (i * 13) % 20,
    y: 30 + Math.floor(i / 3) * 36 + (i * 7) % 15,
    color: chartColor(i),
    rotate: props.rotate && i % 4 === 0 ? -12 : props.rotate && i % 5 === 0 ? 12 : 0
  }))
})
const hasData = computed(() => words.value.length > 0)
const titleText = computed(() => props.title ?? t('component.word-cloud.title'))
const emptyText = computed(() => props.emptyText ?? t('common.noData'))

function onKeydown(event: KeyboardEvent, item: { label: string; value: number; index: number }) {
  if (event.key !== 'Enter' && event.key !== ' ') return
  event.preventDefault()
  selectWord(item)
}
</script>

<template>
  <div
    :class="['vp-word-cloud', 'vp-word-cloud__panel', { 'vp-word-cloud--disabled': disabled, 'vp-word-cloud--loading': loading }, props.class]"
    :style="style"
    data-component="WordCloud"
    role="group"
    :aria-label="titleText"
    :aria-busy="loading || undefined"
  >
    <h3 class="vp-word-cloud__title">{{ titleText }}</h3>
    <p v-if="description" class="vp-word-cloud__muted">{{ description }}</p>
    <p v-if="loading" class="vp-word-cloud__muted" role="status">{{ t('common.loading') }}</p>
    <p v-else-if="!hasData" class="vp-word-cloud__muted" role="status">{{ emptyText }}</p>
    <svg v-else class="vp-word-cloud__chart" viewBox="0 0 240 140" role="img" :aria-label="titleText">
      <text
        v-for="(w, i) in words"
        :key="i"
        class="vp-word-cloud__word"
        :class="{ 'vp-word-cloud__word--selected': isSelected(w) }"
        :x="w.x"
        :y="w.y"
        :font-size="w.size"
        :fill="w.color"
        :transform="`rotate(${w.rotate} ${w.x} ${w.y})`"
        :tabindex="disabled ? -1 : 0"
        role="button"
        :aria-label="`${w.label}: ${w.value}`"
        font-weight="600"
        @click="selectWord(w, $event)"
        @keydown="onKeydown($event, w)"
      >
        {{ showValues ? `${w.label} ${w.value}` : w.label }}
      </text>
    </svg>
    <slot :words="words" :selected="modelValue" />
  </div>
</template>
