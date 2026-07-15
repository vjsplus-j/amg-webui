<script setup lang="ts">
import { computed, defineAsyncComponent, type Component, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Card, InputText, Tag } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import {
  zoneNames,
  zoneMaturitySummary,
  componentMaturity,
  type MaturityLevel,
  type ExampleZoneId
} from '../component-zones'

const props = withDefaults(
  defineProps<{
    zone: ExampleZoneId
    titleKey?: string
    leadKey?: string
    /** Keep curated demo slot above the grid */
    showSearch?: boolean
    /** Click tile name → /base/:name doc page */
    linkToDoc?: boolean
  }>(),
  {
    showSearch: true,
    linkToDoc: false
  }
)

const router = useRouter()
const { t, locale } = useLocale()
const keyword = ref('')
const maturityFilter = ref<MaturityLevel | 'all'>('all')

const modules = import.meta.glob('../../../packages/components/base/*/index.vue') as Record<
  string,
  () => Promise<Component>
>

const names = computed(() => {
  void locale.value
  return zoneNames(props.zone)
})

const zoneSummary = computed(() => {
  void locale.value
  return zoneMaturitySummary(props.zone)
})

const filtered = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return names.value.filter((n) => {
    if (kw && !n.toLowerCase().includes(kw)) return false
    if (maturityFilter.value === 'all') return true
    return componentMaturity(n).level === maturityFilter.value
  })
})

const sampleTree = [
  {
    label: 'A',
    value: 'a',
    children: [
      { label: 'A1', value: 'a1' },
      { label: 'A2', value: 'a2' }
    ]
  },
  { label: 'B', value: 'b', children: [{ label: 'B1', value: 'b1' }] }
]

const sampleRows = [
  { id: 1, name: 'demo-01', status: 'online', value: 12 },
  { id: 2, name: 'demo-02', status: 'offline', value: 28 },
  { id: 3, name: 'demo-03', status: 'online', value: 18 }
]

function load(name: string) {
  const key = Object.keys(modules).find((p) => p.includes(`/base/${name}/`))
  if (!key) return null
  return defineAsyncComponent(modules[key])
}

const columns = computed(() => {
  void locale.value
  return [
    { field: 'id', header: 'ID' },
    { field: 'name', header: t('biz.name') },
    { field: 'status', header: t('biz.status') }
  ]
})

const levelOrder: MaturityLevel[] = ['ready', 'beta', 'shell', 'stub']

function levelLabel(level: MaturityLevel) {
  return t(LocaleKeys.page.gallery.maturity[level])
}

function levelSeverity(level: MaturityLevel): 'success' | 'warning' | 'info' | 'danger' {
  switch (level) {
    case 'ready':
      return 'success'
    case 'beta':
      return 'warning'
    case 'shell':
      return 'info'
    default:
      return 'danger'
  }
}

function tileMeta(name: string) {
  return componentMaturity(name)
}

function showEmptyHint(level: MaturityLevel) {
  return level === 'shell' || level === 'stub'
}

function openDoc(name: string) {
  if (!props.linkToDoc) return
  router.push({ name: 'base-component', params: { name } })
}

</script>

<template>
  <div class="gallery">
    <header v-if="titleKey" class="ln-page-hero">
      <h1 class="ln-page-title">{{ t(titleKey) }}</h1>
      <p v-if="leadKey" class="ln-page-lead">{{ t(leadKey) }}</p>
      <p class="gallery__maturity-lead">{{ t(LocaleKeys.page.gallery.maturity.lead) }}</p>
    </header>

    <slot name="featured" />

    <Card v-if="showSearch" class="vp-toolbar gallery__toolbar">
      <InputText
        v-model="keyword"
        :placeholder="t(LocaleKeys.common.search)"
        class="gallery__search"
      />
      <div class="gallery__filters" role="group" :aria-label="t(LocaleKeys.page.gallery.maturity.filter)">
        <button
          type="button"
          class="gallery__chip"
          :class="{ 'gallery__chip--active': maturityFilter === 'all' }"
          @click="maturityFilter = 'all'"
        >
          {{ t(LocaleKeys.common.all) }}
          <span class="gallery__chip-count">{{ names.length }}</span>
        </button>
        <button
          v-for="level in levelOrder"
          :key="level"
          type="button"
          class="gallery__chip"
          :class="{ 'gallery__chip--active': maturityFilter === level }"
          @click="maturityFilter = level"
        >
          {{ levelLabel(level) }}
          <span class="gallery__chip-count">{{ zoneSummary[level] }}</span>
        </button>
      </div>
      <span class="gallery__count">{{ filtered.length }} / {{ names.length }}</span>
    </Card>

    <div class="gallery__grid">
      <Card v-for="name in filtered" :key="name" class="gallery__tile">
        <template #header>
          <div class="gallery__tile-head">
            <span
              class="gallery__tile-name"
              :class="{ 'gallery__tile-name--link': linkToDoc }"
              :title="name"
              role="link"
              tabindex="0"
              @click="openDoc(name)"
              @keydown.enter="openDoc(name)"
            >{{ name }}</span>
            <Tag
              size="sm"
              :severity="levelSeverity(tileMeta(name).level)"
              :label="levelLabel(tileMeta(name).level)"
              :title="t(LocaleKeys.page.gallery.maturity.score, { score: tileMeta(name).score })"
            />
          </div>
        </template>
        <p v-if="showEmptyHint(tileMeta(name).level)" class="gallery__hint">
          {{ t(LocaleKeys.page.gallery.maturity.previewHint) }}
        </p>
        <component
          :is="load(name)"
          :options="sampleTree"
          :data="sampleTree"
          :slides="sampleRows"
          :items="sampleRows"
          :columns="columns"
          :rows="sampleRows"
          :value="sampleRows"
          :model-value="undefined"
        />
      </Card>
    </div>
  </div>
</template>

<style scoped>
.gallery {
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
}

.gallery__maturity-lead {
  margin: var(--spacing-sm) 0 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
  max-width: 48rem;
}

.gallery__toolbar {
  margin-bottom: 0;
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  align-items: center;
}

.gallery__search {
  min-width: 16rem;
}

.gallery__filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  align-items: center;
}

.gallery__chip {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  min-height: var(--height-sm);
  padding: 0 var(--spacing-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-btn-radius);
  background: var(--surface-1);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: border-color var(--transition-normal), color var(--transition-normal),
    background var(--transition-normal);
}

.gallery__chip:hover {
  border-color: var(--border-color-hover);
  color: var(--text-primary);
}

.gallery__chip--active {
  border-color: var(--ds-accent);
  color: var(--text-primary);
  background: var(--surface-2, var(--surface-1));
}

.gallery__chip-count {
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.gallery__count {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  margin-inline-start: auto;
}

.gallery__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  gap: var(--theme-section-gap);
}

.gallery__tile {
  min-height: 12rem;
  max-height: 28rem;
  overflow: auto;
}

.gallery__tile-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  width: 100%;
  min-width: 0;
}

.gallery__tile-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 600;
}

.gallery__tile-name--link {
  cursor: pointer;
  color: var(--ds-accent);
}

.gallery__tile-name--link:hover {
  text-decoration: underline;
}

.gallery__hint {
  margin: 0 0 var(--spacing-md);
  color: var(--text-muted);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-body);
}
</style>
