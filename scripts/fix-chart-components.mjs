import { writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const charts = [
  'BarChart',
  'LineChart',
  'PieChart',
  'RadarChart',
  'GaugeChart',
  'WordCloud',
  'TreeChart',
  'GraphChart',
  'HeatMap',
  'Ranking'
]

function kebab(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

function modeOf(n) {
  if (/Pie|Radar|WordCloud|HeatMap|Graph|TreeChart/.test(n)) return 'bubbles'
  if (/Line|Gauge/.test(n)) return 'line'
  return 'bars'
}

for (const name of charts) {
  const k = kebab(name)
  const mode = modeOf(name)
  const vue = `<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { ${name}Props, ${name}Emits } from './types'
import './style.scss'

const props = withDefaults(defineProps<${name}Props>(), {
  data: () => [40, 65, 30, 80, 55, 70]
})
defineEmits<${name}Emits>()
const { t } = useLocale()
const mode: string = '${mode}'

const series = computed(() => {
  const raw = Array.isArray(props.data) ? (props.data as number[]) : [40, 65, 30, 80, 55, 70]
  return raw.map((n) => Number(n) || 0)
})
const max = computed(() => Math.max(1, ...series.value))
const points = computed(() => {
  const w = 320
  const h = 120
  const pad = 8
  const vals = series.value
  if (!vals.length) return ''
  return vals
    .map((v, i) => {
      const x = pad + (i * (w - pad * 2)) / Math.max(1, vals.length - 1)
      const y = h - pad - (v / max.value) * (h - pad * 2)
      return \`\${x},\${y}\`
    })
    .join(' ')
})
const bars = computed(() => {
  const vals = series.value
  const w = 320
  const h = 120
  const gap = 6
  const bw = (w - gap * (vals.length + 1)) / Math.max(1, vals.length)
  return vals.map((v, i) => {
    const bh = (v / max.value) * (h - 16)
    return { x: gap + i * (bw + gap), y: h - 8 - bh, w: bw, h: bh }
  })
})
const titleText = computed(() => props.title ?? t('component.${k}.title'))
</script>

<template>
  <div :class="['vp-${k}', 'vp-${k}__panel', { 'vp-${k}--disabled': disabled }, props.class]" :style="style">
    <h3 class="vp-${k}__title">{{ titleText }}</h3>
    <p class="vp-${k}__muted">{{ description ?? t('component.${k}.lead') }}</p>
    <svg class="vp-${k}__chart" viewBox="0 0 320 120" role="img">
      <template v-if="mode === 'bubbles'">
        <circle
          v-for="(v, i) in series"
          :key="i"
          :cx="40 + (i % 5) * 56"
          :cy="40 + Math.floor(i / 5) * 40"
          :r="8 + (v / max) * 16"
          fill="var(--primary-500)"
          opacity="0.75"
        />
      </template>
      <template v-else-if="mode === 'line'">
        <polyline fill="none" stroke="var(--primary-500)" stroke-width="2" :points="points" />
      </template>
      <template v-else>
        <rect
          v-for="(b, i) in bars"
          :key="i"
          :x="b.x"
          :y="b.y"
          :width="b.w"
          :height="b.h"
          rx="2"
          fill="var(--primary-500)"
        />
      </template>
    </svg>
    <slot />
  </div>
</template>
`
  writeFileSync(resolve(root, 'packages/components/base', name, 'index.vue'), vue, 'utf8')
  console.log('fixed', name)
}
