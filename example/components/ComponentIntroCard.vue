<script setup lang="ts">
import { computed } from 'vue'
import { Tag, Link } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { ComponentMetadata } from '../generated/component-metadata'

const props = defineProps<{
  meta: ComponentMetadata
  maturityLabel?: string
  maturitySeverity?: 'success' | 'warning' | 'info' | 'danger'
}>()

const { t } = useLocale()

const displayTitle = computed(() =>
  props.meta.titleZh ? `${props.meta.title} ${props.meta.titleZh}` : props.meta.title
)

const importSnippet = computed(() => {
  const from = props.meta.importFrom || props.meta.importPaths?.[0] || `amg-webui/${props.meta.package}`
  return `import { ${props.meta.name} } from '${from}'`
})

const docsHref = computed(() => {
  if (!props.meta.hasDocsPage || !props.meta.docsPath) return ''
  return `/${props.meta.docsPath}`
})
</script>

<template>
  <section class="component-intro-card" aria-labelledby="component-intro-title">
    <header class="component-intro-card__header">
      <div class="component-intro-card__title-row">
        <h2 id="component-intro-title" class="component-intro-card__title">{{ displayTitle }}</h2>
        <Tag
          v-if="maturityLabel"
          size="sm"
          :severity="maturitySeverity ?? 'info'"
          :label="maturityLabel"
        />
      </div>
      <p v-if="meta.summary" class="component-intro-card__summary">{{ meta.summary }}</p>
    </header>

    <dl class="component-intro-card__meta">
      <div class="component-intro-card__row">
        <dt>{{ t(LocaleKeys.exampleDoc.intro.package) }}</dt>
        <dd><code>{{ meta.package }}</code></dd>
      </div>
      <div v-if="meta.maturity" class="component-intro-card__row">
        <dt>{{ t(LocaleKeys.exampleDoc.intro.maturity) }}</dt>
        <dd><code>{{ meta.maturity }}</code></dd>
      </div>
      <div class="component-intro-card__row">
        <dt>{{ t(LocaleKeys.exampleDoc.intro.importPath) }}</dt>
        <dd><code class="component-intro-card__import">{{ importSnippet }}</code></dd>
      </div>
    </dl>

    <div v-if="meta.features?.length" class="component-intro-card__features">
      <h3 class="component-intro-card__features-title">{{ t(LocaleKeys.exampleDoc.intro.features) }}</h3>
      <ul class="component-intro-card__chips">
        <li v-for="feature in meta.features" :key="feature">
          <Tag size="sm" severity="secondary" :label="feature" />
        </li>
      </ul>
    </div>

    <p v-if="meta.hasDocsPage && docsHref" class="component-intro-card__docs">
      <Link :href="docsHref" target="_blank" rel="noopener noreferrer">
        {{ t(LocaleKeys.exampleDoc.intro.viewDocs) }}
      </Link>
      <code class="component-intro-card__docs-path">{{ docsHref }}</code>
    </p>
  </section>
</template>

<style scoped lang="scss">
.component-intro-card {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  background: var(--surface-elevated, var(--surface-secondary));
}

.component-intro-card__header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.component-intro-card__title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-md);
}

.component-intro-card__title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-primary);
}

.component-intro-card__summary {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}

.component-intro-card__meta {
  margin: 0;
  display: grid;
  gap: var(--spacing-sm);
}

.component-intro-card__row {
  display: grid;
  grid-template-columns: minmax(5rem, auto) 1fr;
  gap: var(--spacing-sm);
  align-items: baseline;
  font-size: var(--font-size-sm);

  dt {
    margin: 0;
    color: var(--text-tertiary, var(--text-secondary));
  }

  dd {
    margin: 0;
    color: var(--text-primary);
    word-break: break-word;
  }
}

.component-intro-card__import {
  display: inline-block;
  white-space: pre-wrap;
}

.component-intro-card__features-title {
  margin: 0 0 var(--spacing-xs);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-primary);
}

.component-intro-card__chips {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.component-intro-card__docs {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
}

.component-intro-card__docs-path {
  color: var(--text-tertiary, var(--text-secondary));
}
</style>
