<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { toLabelSeries, chartColor } from '@amg-webui/utils/data-display/chartHelpers'
import type { RankingProps, RankingEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<RankingProps & { items?: { label: string; value: number }[] }>(), {
  data: () => [],
  items: () => [],
  disabled: false
})
const emit = defineEmits<RankingEmits>()
const { t } = useLocale()
const sortDesc = ref(true)

const raw = computed(() => {
  if (props.items?.length) return props.items
  return toLabelSeries(props.data, [
    { label: 'A', value: 92 },
    { label: 'B', value: 78 },
    { label: 'C', value: 65 },
    { label: 'D', value: 50 },
    { label: 'E', value: 38 }
  ])
})

const ranked = computed(() => {
  const list = [...raw.value]
  list.sort((a, b) => (sortDesc.value ? b.value - a.value : a.value - b.value))
  return list
})

const maxVal = computed(() => Math.max(1, ...ranked.value.map((d) => d.value)))

const titleText = computed(() => props.title ?? t('component.ranking.title'))
</script>

<template>
  <div :class="['vp-ranking', 'vp-ranking__panel', { 'vp-ranking--disabled': disabled }, props.class]" :style="style">
    <div class="vp-ranking__toolbar">
      <h3 class="vp-ranking__heading">{{ titleText }}</h3>
      <button type="button" class="vp-ranking__control" @click="sortDesc = !sortDesc">
        {{ sortDesc ? t('common.sortDesc') : t('common.sortAsc') }}
      </button>
    </div>
    <ol v-if="ranked.length" class="vp-ranking__list">
      <li
        v-for="(item, i) in ranked"
        :key="item.label"
        class="vp-ranking__item"
        :class="{ 'vp-ranking__item--top': i < 3 }"
        @click="emit('change', item)"
      >
        <span class="vp-ranking__rank">{{ t('common.rank') }} {{ i + 1 }}</span>
        <span class="vp-ranking__label">{{ item.label }}</span>
        <div class="vp-ranking__bar-track">
          <div
            class="vp-ranking__bar-fill"
            :style="{ width: (item.value / maxVal * 100) + '%', background: chartColor(i) }"
          />
        </div>
        <span class="vp-ranking__value">{{ item.value }}</span>
      </li>
    </ol>
    <p v-else class="vp-ranking__muted">{{ t('common.noData') }}</p>
    <slot />
  </div>
</template>

<style scoped>
.vp-ranking__list {
  list-style: none;
  margin: var(--spacing-md) 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}
.vp-ranking__item {
  display: grid;
  grid-template-columns: auto 1fr 2fr auto;
  gap: var(--spacing-md);
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  cursor: pointer;
}
.vp-ranking__item--top {
  border-color: var(--primary-500);
  background: color-mix(in srgb, var(--primary-500) 8%, transparent);
}
.vp-ranking__rank {
  font-size: var(--font-size-sm);
  font-weight: 700;
  color: var(--primary-500);
  min-width: 4rem;
}
.vp-ranking__bar-track {
  height: var(--spacing-sm);
  background: var(--surface-2);
  border-radius: var(--border-radius-full, 999px);
  overflow: hidden;
}
.vp-ranking__bar-fill {
  height: 100%;
  border-radius: inherit;
  transition: width var(--transition-normal, 0.2s);
}
.vp-ranking__control {
  appearance: none;
  border: 1px solid var(--ds-border);
  background: var(--surface-1);
  border-radius: var(--theme-btn-radius);
  height: var(--height-sm);
  padding: 0 var(--spacing-md);
  cursor: pointer;
}
</style>
