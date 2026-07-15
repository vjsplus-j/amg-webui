<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { WaterfallProps, WaterfallEmits } from './types'
import './style.scss'

interface Card {
  id?: string | number
  title?: string
  image?: string
  height?: number
}

const props = withDefaults(defineProps<WaterfallProps & { items?: Card[]; columns?: number }>(), {
  items: () => [],
  columns: 3,
  disabled: false
})
const emit = defineEmits<WaterfallEmits>()
const { t } = useLocale()

const list = computed<Card[]>(() => {
  if (props.items?.length) return props.items
  if (Array.isArray(props.data)) return props.data as Card[]
  return []
})

const cols = computed(() => {
  const n = Math.max(1, props.columns)
  const buckets: Card[][] = Array.from({ length: n }, () => [])
  const heights = Array(n).fill(0)
  for (const item of list.value) {
    const h = item.height ?? 120
    const min = heights.indexOf(Math.min(...heights))
    buckets[min].push(item)
    heights[min] += h
  }
  return buckets
})

const titleText = computed(() => props.title ?? t('component.waterfall.title'))
</script>

<template>
  <div :class="['vp-waterfall', 'vp-waterfall__panel', { 'vp-waterfall--disabled': disabled }, props.class]" :style="style">
    <h3 class="vp-waterfall__heading">{{ titleText }}</h3>
    <div v-if="list.length" class="vp-waterfall__grid" :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)` }">
      <div v-for="(col, ci) in cols" :key="ci" class="vp-waterfall__col">
        <article
          v-for="(item, i) in col"
          :key="item.id ?? i"
          class="vp-waterfall__card"
          @click="emit('change', item)"
        >
          <img v-if="item.image" class="vp-waterfall__image" :src="item.image" :alt="item.title ?? ''" loading="lazy" />
          <p v-if="item.title" class="vp-waterfall__title">{{ item.title }}</p>
        </article>
      </div>
    </div>
    <p v-else class="vp-waterfall__muted">{{ t('common.noData') }}</p>
    <slot />
  </div>
</template>

<style scoped>
.vp-waterfall__grid {
  display: grid;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}
.vp-waterfall__col {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}
.vp-waterfall__card {
  background: var(--surface-1);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  overflow: hidden;
  cursor: pointer;
}
.vp-waterfall__image {
  width: 100%;
  display: block;
  object-fit: cover;
}
.vp-waterfall__title {
  margin: 0;
  padding: var(--spacing-md);
  font-size: var(--font-size-md);
}
</style>
