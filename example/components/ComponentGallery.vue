<script setup lang="ts">
import { computed, defineAsyncComponent, type Component, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Card, InputText, Tag, Button } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import ExamplePageHero from './ExamplePageHero.vue'
import {
  zoneNames,
  zoneMaturitySummary,
  componentMaturity,
  type MaturityLevel,
  type ExampleZoneId
} from '../component-zones'
import { isV01Component } from '../v0.1-subset'

const props = withDefaults(
  defineProps<{
    zone: ExampleZoneId
    titleKey?: string
    leadKey?: string
    /** Keep curated demo slot above the grid */
    showSearch?: boolean
    /** Click tile name → /base/:name doc page */
    linkToDoc?: boolean
    /**
     * `mount` — try live component with sample props (default).
     * `link` — skip empty mounts; show open-doc CTA (layout / shell comps).
     */
    previewMode?: 'mount' | 'link'
  }>(),
  {
    showSearch: true,
    linkToDoc: false,
    previewMode: 'mount'
  }
)

const router = useRouter()
const { t, locale } = useLocale()
const keyword = ref('')
const maturityFilter = ref<MaturityLevel | 'all' | 'v01'>('all')
const v01Count = computed(() => names.value.filter((n) => isV01Component(n)).length)

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
    if (maturityFilter.value === 'v01') return isV01Component(n)
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

/** Flat NavItem[] for *Nav / Dropdown gallery mounts */
const sampleNavItems = [
  { label: 'A', value: 'a' },
  { label: 'B', value: 'b' },
  { label: 'C', value: 'c' }
]

/** Extra items so ScrollNav can demonstrate overflow-x */
const sampleScrollNavItems = [
  { label: 'A', value: 'a' },
  { label: 'B', value: 'b' },
  { label: 'C', value: 'c' },
  { label: 'D', value: 'd' },
  { label: 'E', value: 'e' },
  { label: 'F', value: 'f' },
  { label: 'G', value: 'g' },
  { label: 'H', value: 'h' }
]

const sampleMenuItems = [
  { key: 'a', label: 'A' },
  { key: 'b', label: 'B', children: [{ key: 'b1', label: 'B1' }] },
  { key: 'c', label: 'C' }
]

function galleryItems(name: string) {
  if (name === 'Menu' || name === 'MenuBar') return sampleMenuItems
  if (name === 'ScrollNav') return sampleScrollNavItems
  if (
    name.endsWith('Nav') ||
    name === 'Dropdown' ||
    name === 'Anchor' ||
    name === 'Breadcrumb'
  ) {
    return sampleNavItems
  }
  return sampleRows
}

function galleryModel(name: string) {
  if (name.endsWith('Nav') || name === 'Dropdown' || name === 'Anchor') return 'a'
  if (name === 'Menu' || name === 'MenuBar') return 'a'
  return undefined
}

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
    <ExamplePageHero v-if="titleKey" :title-key="titleKey" :lead-key="leadKey">
      <p class="gallery__maturity-lead">{{ t(LocaleKeys.page.gallery.maturity.lead) }}</p>
    </ExamplePageHero>

    <slot name="featured" />

    <Card v-if="showSearch" class="vp-toolbar gallery__toolbar">
      <InputText
        v-model="keyword"
        :placeholder="t(LocaleKeys.common.search)"
        class="gallery__search"
      />
      <div class="gallery__filters" role="group" :aria-label="t(LocaleKeys.page.gallery.maturity.filter)">
        <Button
          size="sm"
          :variant="maturityFilter === 'all' ? 'solid' : 'outlined'"
          @click="maturityFilter = 'all'"
        >
          {{ t(LocaleKeys.common.all) }}
          <span class="gallery__chip-count">{{ names.length }}</span>
        </Button>
        <Button
          size="sm"
          :variant="maturityFilter === 'v01' ? 'solid' : 'outlined'"
          @click="maturityFilter = 'v01'"
        >
          {{ t(LocaleKeys.page.gallery.v01.filter) }}
          <span class="gallery__chip-count">{{ v01Count }}</span>
        </Button>
        <Button
          v-for="level in levelOrder"
          :key="level"
          size="sm"
          :variant="maturityFilter === level ? 'solid' : 'outlined'"
          :severity="levelSeverity(level)"
          @click="maturityFilter = level"
        >
          {{ levelLabel(level) }}
          <span class="gallery__chip-count">{{ zoneSummary[level] }}</span>
        </Button>
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
            <div class="gallery__tile-tags">
              <Tag
                v-if="isV01Component(name)"
                size="sm"
                severity="success"
                :label="t(LocaleKeys.page.gallery.v01.badge)"
              />
              <Tag
                size="sm"
                :severity="levelSeverity(tileMeta(name).level)"
                :label="levelLabel(tileMeta(name).level)"
                :title="t(LocaleKeys.page.gallery.maturity.score, { score: tileMeta(name).score })"
              />
            </div>
          </div>
        </template>
        <p v-if="showEmptyHint(tileMeta(name).level)" class="gallery__hint">
          {{ t(LocaleKeys.page.gallery.maturity.previewHint) }}
        </p>
        <div v-if="previewMode === 'link'" class="gallery__link-preview">
          <Button size="sm" variant="outlined" @click="openDoc(name)">
            {{ t(LocaleKeys.page.gallery.openDoc) }}
          </Button>
        </div>
        <component
          v-else
          :is="load(name)"
          :options="sampleTree"
          :data="sampleTree"
          :slides="sampleRows"
          :items="galleryItems(name)"
          :columns="columns"
          :rows="sampleRows"
          :value="sampleRows"
          :model-value="galleryModel(name)"
          :style="name === 'ScrollNav' ? { maxWidth: '100%' } : undefined"
          :class="name === 'ScrollNav' ? 'gallery__scroll-nav' : undefined"
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

.gallery__chip-count {
  color: inherit;
  opacity: var(--ds-muted-opacity, 0.72);
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

.gallery__tile-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-xs);
  flex-shrink: 0;
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

.gallery__scroll-nav {
  display: block;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.gallery__link-preview {
  display: flex;
  align-items: center;
  min-height: calc(var(--spacing-2xl) * 2);
}
</style>
