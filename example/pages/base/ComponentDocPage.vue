<script setup lang="ts">
import { computed, defineAsyncComponent, watch, type Component } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Tag } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { getCatalogEntry } from '../../component-catalog'
import { componentMaturity, type MaturityLevel } from '../../component-zones'
import { getCuratedDemo } from '../../demos/registry'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import type { PropRow } from '../../components/demo/types'

const route = useRoute()
const router = useRouter()
const { t, locale } = useLocale()

const modules = import.meta.glob('../../../packages/components/base/*/index.vue') as Record<
  string,
  () => Promise<Component>
>

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

const componentName = computed(() => String(route.params.name ?? ''))

const entry = computed(() => getCatalogEntry(componentName.value))

const curated = computed(() => getCuratedDemo(componentName.value))

const displayTitle = computed(() => {
  // English component leaf name only (Button), not「按钮 Button」
  return componentName.value
})

const whenToUse = computed(() => {
  void locale.value
  if (curated.value?.whenKey) {
    return t(curated.value.whenKey)
  }
  const leadKey = entry.value?.titleKey.replace(/\.title$/, '.lead')
  if (leadKey) {
    const lead = t(leadKey, undefined, '')
    if (lead && lead !== leadKey) return lead
  }
  return t(LocaleKeys.exampleDoc.whenFallback, { name: componentName.value })
})

function loadMount(name: string) {
  const key = Object.keys(modules).find((p) => p.includes(`/base/${name}/`))
  if (!key) return null
  return defineAsyncComponent(modules[key])
}

const MountComp = computed(() => {
  if (curated.value) return null
  return loadMount(componentName.value)
})

const maturity = computed(() => componentMaturity(componentName.value))

const columns = computed(() => {
  void locale.value
  return [
    { field: 'id', header: 'ID' },
    { field: 'name', header: t('biz.name') },
    { field: 'status', header: t('biz.status') }
  ]
})

const draftProps = computed((): PropRow[] => {
  void locale.value
  return [
    {
      name: 'class',
      description: t(LocaleKeys.exampleDoc.propClass),
      type: 'string',
      defaultValue: '—'
    },
    {
      name: 'style',
      description: t(LocaleKeys.exampleDoc.propStyle),
      type: 'CSSProperties',
      defaultValue: '—'
    }
  ]
})

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

watch(
  componentName,
  (name) => {
    if (name && !getCatalogEntry(name)) {
      router.replace({ name: 'base-overview' })
    }
  },
  { immediate: true }
)
</script>

<template>
  <div v-if="entry" class="vp-doc-page">
    <header class="ln-page-hero">
      <div class="vp-doc-page__title-row">
        <h1 class="ln-page-title">{{ displayTitle }}</h1>
        <Tag
          size="sm"
          :severity="levelSeverity(maturity.level)"
          :label="levelLabel(maturity.level)"
          :title="t(LocaleKeys.page.gallery.maturity.score, { score: maturity.score })"
        />
      </div>
      <p class="ln-page-lead">{{ whenToUse }}</p>
    </header>

    <section v-if="curated" class="vp-doc-page__section">
      <h2 class="vp-doc-page__h2">{{ t(LocaleKeys.exampleDoc.demos) }}</h2>
      <component :is="curated.Demo" />
    </section>

    <template v-else>
      <section class="vp-doc-page__section">
        <h2 class="vp-doc-page__h2">{{ t(LocaleKeys.exampleDoc.whenToUse) }}</h2>
        <p class="vp-doc-page__body">{{ whenToUse }}</p>
      </section>

      <section class="vp-doc-page__section">
        <h2 class="vp-doc-page__h2">{{ t(LocaleKeys.exampleDoc.demos) }}</h2>
        <p class="vp-doc-page__hint">{{ t(LocaleKeys.exampleDoc.fallbackHint) }}</p>
        <DemoBlock
          :title="t(LocaleKeys.exampleDoc.basicMount)"
          :description="t(LocaleKeys.exampleDoc.basicMountDesc)"
          :code="`<${componentName} />`"
        >
          <component
            :is="MountComp"
            :options="sampleTree"
            :data="sampleTree"
            :slides="sampleRows"
            :items="sampleRows"
            :columns="columns"
            :rows="sampleRows"
            :value="sampleRows"
            :model-value="undefined"
          />
        </DemoBlock>
      </section>

      <section class="vp-doc-page__section">
        <h2 class="vp-doc-page__h2">{{ t(LocaleKeys.exampleDoc.api) }}</h2>
        <p class="vp-doc-page__hint">{{ t(LocaleKeys.exampleDoc.apiDraft) }}</p>
        <PropsTable :rows="draftProps" />
      </section>
    </template>
  </div>
</template>

<style scoped>
.vp-doc-page {
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
}

.vp-doc-page__title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-md);
}

.vp-doc-page__section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.vp-doc-page__h2 {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-primary);
}

.vp-doc-page__body,
.vp-doc-page__hint {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
  max-width: 48rem;
}
</style>
