<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { toLabelSeries, chartColor } from '@amg-webui/utils/data-display/chartHelpers'
import type { WordCloudProps, WordCloudEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<WordCloudProps>(), {
  data: () => []
})
defineEmits<WordCloudEmits>()
const { t } = useLocale()

const words = computed(() => {
  const items = toLabelSeries(props.data, [
    { label: 'Vue', value: 90 },
    { label: 'Token', value: 70 },
    { label: 'Theme', value: 55 },
    { label: 'Table', value: 48 },
    { label: 'Tree', value: 42 }
  ])
  const max = Math.max(1, ...items.map((d) => d.value))
  return items.map((d, i) => ({
    ...d,
    size: 12 + (d.value / max) * 20,
    x: 30 + (i % 3) * 70 + (i * 13) % 20,
    y: 30 + Math.floor(i / 3) * 36 + (i * 7) % 15,
    color: chartColor(i)
  }))
})
const titleText = computed(() => props.title ?? t('component.word-cloud.title'))
</script>

<template>
  <div :class="['vp-word-cloud', 'vp-word-cloud__panel', { 'vp-word-cloud--disabled': disabled }, props.class]" :style="style">
    <h3 class="vp-word-cloud__title">{{ titleText }}</h3>
    <svg class="vp-word-cloud__chart" viewBox="0 0 240 140" role="img" :aria-label="titleText">
      <text
        v-for="(w, i) in words"
        :key="i"
        :x="w.x"
        :y="w.y"
        :font-size="w.size"
        :fill="w.color"
        font-weight="600"
      >
        {{ w.label }}
      </text>
    </svg>
    <slot />
  </div>
</template>
