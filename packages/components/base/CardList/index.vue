<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { CardListProps, CardListEmits } from './types'
import './style.scss'

interface CardItem {
  id: string | number
  title: string
  description?: string
  image?: string
}

const props = withDefaults(defineProps<CardListProps & { items?: CardItem[] }>(), {
  items: () => [],
  modelValue: () => [],
  disabled: false
})
const emit = defineEmits<CardListEmits>()
const { t } = useLocale()

const selected = ref<Set<string | number>>(new Set(Array.isArray(props.modelValue) ? props.modelValue : []))

const list = computed<CardItem[]>(() => {
  if (props.items?.length) return props.items
  if (Array.isArray(props.data)) return props.data as CardItem[]
  return []
})

function toggle(id: string | number) {
  const next = new Set(selected.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  selected.value = next
  const arr = [...next]
  emit('update:modelValue', arr)
  emit('change', arr)
}

const titleText = computed(() => props.title ?? t('component.card-list.title'))
</script>

<template>
  <div :class="['vp-card-list', 'vp-card-list__panel', { 'vp-card-list--disabled': disabled }, props.class]" :style="style">
    <h3 class="vp-card-list__heading">{{ titleText }}</h3>
    <div v-if="list.length" class="vp-card-list__grid">
      <article
        v-for="item in list"
        :key="item.id"
        class="vp-card-list__card"
        :class="{ 'vp-card-list__card--selected': selected.has(item.id) }"
        @click="toggle(item.id)"
      >
        <input type="checkbox" :checked="selected.has(item.id)" :disabled="disabled" @click.stop @change="toggle(item.id)" />
        <img v-if="item.image" class="vp-card-list__image" :src="item.image" :alt="item.title" />
        <h4 class="vp-card-list__title">{{ item.title }}</h4>
        <p v-if="item.description" class="vp-card-list__desc">{{ item.description }}</p>
        <slot name="actions" :item="item" />
      </article>
    </div>
    <p v-else class="vp-card-list__muted">{{ t('common.noData') }}</p>
    <slot />
  </div>
</template>

<style scoped>
.vp-card-list__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}
.vp-card-list__card {
  background: var(--surface-1);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  padding: var(--theme-card-pad);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}
.vp-card-list__card--selected {
  border-color: var(--primary-500);
  box-shadow: var(--shadow-sm);
}
.vp-card-list__image {
  width: 100%;
  border-radius: var(--theme-card-radius);
  object-fit: cover;
  max-height: 8rem;
}
.vp-card-list__title {
  margin: 0;
  font-size: var(--font-size-md);
}
.vp-card-list__desc {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}
</style>
