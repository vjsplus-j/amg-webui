<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { TimelineListProps, TimelineListEmits } from './types'
import './style.scss'

interface TimelineItem {
  id?: string | number
  time: string
  title: string
  status?: 'success' | 'warning' | 'danger' | 'info'
  content?: string
}

const props = withDefaults(defineProps<TimelineListProps & { items?: TimelineItem[] }>(), {
  items: () => [],
  disabled: false
})
const emit = defineEmits<TimelineListEmits>()
const { t } = useLocale()

const list = computed<TimelineItem[]>(() => {
  if (props.items?.length) return props.items
  if (Array.isArray(props.data)) return props.data as TimelineItem[]
  return []
})

const grouped = computed(() => {
  const map = new Map<string, TimelineItem[]>()
  for (const item of list.value) {
    const day = item.time.split(' ')[0] ?? item.time
    map.set(day, [...(map.get(day) ?? []), item])
  }
  return [...map.entries()]
})

const titleText = computed(() => props.title ?? t('component.timeline-list.title'))
</script>

<template>
  <div :class="['vp-timeline-list', 'vp-timeline-list__panel', { 'vp-timeline-list--disabled': disabled }, props.class]" :style="style">
    <h3 class="vp-timeline-list__heading">{{ titleText }}</h3>
    <div v-if="list.length" class="vp-timeline-list__track">
      <section v-for="[day, items] in grouped" :key="day" class="vp-timeline-list__group">
        <h4 class="vp-timeline-list__day">{{ day }}</h4>
        <article
          v-for="(item, i) in items"
          :key="item.id ?? i"
          class="vp-timeline-list__item"
          :class="'vp-timeline-list__item--' + (item.status ?? 'info')"
          @click="emit('change', item)"
        >
          <time class="vp-timeline-list__time">{{ item.time }}</time>
          <h5 class="vp-timeline-list__title">{{ item.title }}</h5>
          <p v-if="item.content" class="vp-timeline-list__content">{{ item.content }}</p>
        </article>
      </section>
    </div>
    <p v-else class="vp-timeline-list__muted">{{ t('common.noData') }}</p>
    <slot />
  </div>
</template>

<style scoped>
.vp-timeline-list__track {
  margin-top: var(--spacing-md);
  border-left: 2px solid var(--ds-border);
  padding-left: var(--spacing-lg);
}
.vp-timeline-list__day {
  margin: var(--spacing-md) 0 var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}
.vp-timeline-list__item {
  position: relative;
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--surface-1);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
}
.vp-timeline-list__item::before {
  content: '';
  position: absolute;
  left: calc(-1 * var(--spacing-lg) - 5px);
  top: var(--spacing-md);
  width: var(--spacing-sm);
  height: var(--spacing-sm);
  border-radius: var(--border-radius-full, 50%);
  background: var(--primary-500);
}
.vp-timeline-list__item--success::before { background: var(--status-success); }
.vp-timeline-list__item--warning::before { background: var(--status-warning); }
.vp-timeline-list__item--danger::before { background: var(--status-danger); }
.vp-timeline-list__time {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}
.vp-timeline-list__title {
  margin: var(--spacing-xs) 0;
  font-size: var(--font-size-md);
}
.vp-timeline-list__content {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}
</style>
