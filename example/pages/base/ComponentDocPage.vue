<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Tag } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { getCatalogEntry } from '../../component-catalog'
import { componentMaturity, type MaturityLevel } from '../../component-zones'
import { getCuratedDemo } from '../../demos/registry'
import { isV01Component, V01_COMPONENTS } from '../../v0.1-subset'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import DemoSafeHost from '../../components/demo/DemoSafeHost.vue'
import ExamplePageHero from '../../components/ExamplePageHero.vue'
import ApiRenderer from '../../components/docs/ApiRenderer.vue'

const route = useRoute()
const router = useRouter()
const { t, tDyn, locale } = useLocale()

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
    return tDyn(curated.value.whenKey)
  }
  const leadKey = entry.value?.titleKey.replace(/\.title$/, '.lead')
  if (leadKey) {
    const lead = tDyn(leadKey, undefined, '')
    if (lead && lead !== leadKey) return lead
  }
  return t(LocaleKeys.exampleDoc.whenFallback, { name: componentName.value })
})

const maturity = computed(() => componentMaturity(componentName.value))

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
    <ExamplePageHero :title="displayTitle" :lead="whenToUse">
      <template #title-extra>
        <Tag
          v-if="isV01Component(componentName)"
          size="sm"
          severity="success"
          :label="t(LocaleKeys.page.gallery.v01.badge)"
          :title="t(LocaleKeys.page.gallery.v01.hint, { count: V01_COMPONENTS.length })"
        />
        <Tag
          size="sm"
          :severity="levelSeverity(maturity.level)"
          :label="levelLabel(maturity.level)"
          :title="t(LocaleKeys.page.gallery.maturity.score, { score: maturity.score })"
        />
      </template>
    </ExamplePageHero>

    <section v-if="curated" class="vp-doc-page__section">
      <h2 class="vp-doc-page__h2">{{ t(LocaleKeys.exampleDoc.demos) }}</h2>
      <DemoSafeHost :name="componentName">
        <component :is="curated.Demo" />
      </DemoSafeHost>
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
          <DemoSafeHost :name="componentName" />
        </DemoBlock>
      </section>
    </template>

    <section class="vp-doc-page__section">
      <h2 class="vp-doc-page__h2">{{ t(LocaleKeys.exampleDoc.api) }}</h2>
      <ApiRenderer :component-name="componentName" />
    </section>
  </div>
</template>

<style scoped>
.vp-doc-page {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
}

.vp-doc-page__section {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
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

/* Prose only — never apply max-width to DemoBlock / curated demos / PropsTable */
.vp-doc-page__body,
.vp-doc-page__hint {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}
</style>

<!-- Full-bleed curated contract — see vue3-amg-webui-example-demo-layout.mdc -->
<style src="../../components/demo/curatedDemo.scss"></style>
