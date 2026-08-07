<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { IntroTocItem } from './introNav'

const props = defineProps<{
  items: IntroTocItem[]
}>()

const { t, locale } = useLocale()
const activeId = ref(props.items[0]?.id ?? '')

const labels = computed(() => {
  void locale.value
  return props.items.map((item) => ({
    id: item.id,
    label: t(item.labelKey)
  }))
})

let observer: IntersectionObserver | null = null

function bindObserver() {
  observer?.disconnect()
  if (typeof IntersectionObserver === 'undefined') return
  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
      if (visible[0]?.target?.id) {
        activeId.value = visible[0].target.id
      }
    },
    { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.25, 0.5, 1] }
  )
  for (const item of props.items) {
    const el = document.getElementById(item.id)
    if (el) observer.observe(el)
  }
}

onMounted(() => {
  bindObserver()
})

watch(
  () => props.items.map((i) => i.id).join(','),
  () => bindObserver()
)

onUnmounted(() => {
  observer?.disconnect()
  observer = null
})

function scrollTo(id: string) {
  const el = document.getElementById(id)
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  activeId.value = id
}
</script>

<template>
  <nav class="intro-toc" aria-label="On this page">
    <p class="intro-toc__title">{{ t('page.intro.toc') }}</p>
    <ul class="intro-toc__list">
      <li v-for="item in labels" :key="item.id">
        <button
          type="button"
          class="intro-toc__link"
          :class="{ 'intro-toc__link--active': activeId === item.id }"
          @click="scrollTo(item.id)"
        >
          {{ item.label }}
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.intro-toc {
  position: sticky;
  top: var(--spacing-xl);
  max-height: calc(100vh - 6rem);
  overflow: auto;
  padding-inline-start: var(--spacing-md);
  border-inline-start: 1px solid var(--ds-border);
}

.intro-toc__title {
  margin: 0 0 var(--spacing-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold, 600);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-tertiary, var(--text-secondary));
}

.intro-toc__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.intro-toc__link {
  display: block;
  width: 100%;
  text-align: start;
  border: 0;
  background: transparent;
  color: var(--text-secondary);
  font: inherit;
  font-size: var(--font-size-xs);
  line-height: var(--line-height-body);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
}

.intro-toc__link:hover {
  color: var(--text-primary);
  background: var(--surface-2, var(--surface-elevated));
}

.intro-toc__link--active {
  color: var(--primary-600, var(--primary));
  background: color-mix(in srgb, var(--primary-500, var(--primary)) 12%, transparent);
}

@media (max-width: 1100px) {
  .intro-toc {
    display: none;
  }
}
</style>
