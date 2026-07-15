<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { DataCardProps, DataCardEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<DataCardProps & { value?: number | string; trend?: number; icon?: string }>(), {
  value: 0,
  trend: 0,
  loading: false,
  disabled: false
})
const emit = defineEmits<DataCardEmits>()
const { t } = useLocale()

const displayValue = computed(() => {
  if (props.value != null && props.value !== '') return props.value
  if (typeof props.data === 'number' || typeof props.data === 'string') return props.data
  return 0
})

const trendUp = computed(() => Number(props.trend) >= 0)
const titleText = computed(() => props.title ?? t('component.data-card.title'))
</script>

<template>
  <div
    :class="['vp-data-card', 'vp-data-card__panel', { 'vp-data-card--disabled': disabled, 'vp-data-card--loading': loading }, props.class]"
    :style="style"
    @click="emit('click', $event)"
  >
    <div class="vp-data-card__header">
      <span v-if="icon" class="vp-data-card__icon">{{ icon }}</span>
      <h3 class="vp-data-card__title">{{ titleText }}</h3>
    </div>
    <p v-if="loading" class="vp-data-card__value">{{ t('common.loading') }}</p>
    <p v-else class="vp-data-card__value">{{ displayValue }}</p>
    <p v-if="trend != null" class="vp-data-card__trend" :class="trendUp ? 'vp-data-card__trend--up' : 'vp-data-card__trend--down'">
      {{ trendUp ? '+' : '' }}{{ trend }}%
    </p>
    <p v-if="description" class="vp-data-card__desc">{{ description }}</p>
    <slot />
  </div>
</template>

<style scoped>
.vp-data-card__panel {
  background: var(--surface-1);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  padding: var(--theme-card-pad);
}
.vp-data-card__header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}
.vp-data-card__title {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-weight: 500;
}
.vp-data-card__value {
  margin: var(--spacing-md) 0 var(--spacing-xs);
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--text-primary);
}
.vp-data-card__trend {
  margin: 0;
  font-size: var(--font-size-sm);
}
.vp-data-card__trend--up { color: var(--status-success); }
.vp-data-card__trend--down { color: var(--status-danger); }
.vp-data-card__desc {
  margin: var(--spacing-sm) 0 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}
</style>
