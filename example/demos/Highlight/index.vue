<script setup lang="ts">
/**
 * Curated demo — aligned to Avatar gold standard (`demoCode.ts` header).
 */
import { computed, ref } from 'vue'
import { Highlight } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'

const { t } = useLocale()

const searchKeyword = ref('Vue')

/* ─── Code snippets: must mirror preview 1:1 (no `…`) ─── */

const codeBasic = demoSfc({
  imports: [`import { Highlight } from '@amg-webui/components/base'`],
  template: [
    `  <Highlight`,
    `    :text="t('example.doc.highlight.sample.sentence')"`,
    `    keyword="Vue"`,
    `  />`
  ]
})

const codeMulti = demoCode(
  `<Highlight`,
  `  :text="t('example.doc.highlight.sample.paragraph')"`,
  `  :keyword="['API', 'Token', 'i18n']"`,
  `/>`
)

const codeCase = demoCode(
  `<Highlight`,
  `  :text="t('example.doc.highlight.sample.cased')"`,
  `  keyword="vue"`,
  `  :ignore-case="true"`,
  `/>`,
  `<Highlight`,
  `  :text="t('example.doc.highlight.sample.cased')"`,
  `  keyword="vue"`,
  `  :ignore-case="false"`,
  `/>`
)

const codeColor = demoCode(
  `<Highlight`,
  `  :text="t('example.doc.highlight.sample.paragraph')"`,
  `  keyword="Token"`,
  `  color="var(--warning-100)"`,
  `  color-text="var(--warning-700)"`,
  `/>`,
  `<Highlight`,
  `  :text="t('example.doc.highlight.sample.paragraph')"`,
  `  keyword="API"`,
  `  color="var(--success-100)"`,
  `  color-text="var(--success-700)"`,
  `/>`
)

const codeSearch = demoCode(
  `<input v-model="searchKeyword" type="search" />`,
  `<Highlight`,
  `  :text="t('example.doc.highlight.sample.paragraph')"`,
  `  :keyword="searchKeyword"`,
  `/>`
)

const codeVariant = demoCode(
  `<Highlight`,
  `  :text="t('example.doc.highlight.sample.sentence')"`,
  `  keyword="Vue"`,
  `  variant="mark"`,
  `/>`,
  `<Highlight`,
  `  :text="t('example.doc.highlight.sample.sentence')"`,
  `  keyword="Vue"`,
  `  variant="underline"`,
  `/>`,
  `<Highlight`,
  `  :text="t('example.doc.highlight.sample.sentence')"`,
  `  keyword="Vue"`,
  `  variant="background"`,
  `/>`
)

/* ─── API tables ─── */

const propRows = computed<PropRow[]>(() => [
  {
    name: 'text',
    description: t('example.doc.highlight.prop.text'),
    type: 'string',
    defaultValue: '-'
  },
  {
    name: 'keyword',
    description: t('example.doc.highlight.prop.keyword'),
    type: 'string | string[]',
    defaultValue: '-'
  },
  {
    name: 'ignoreCase',
    description: t('example.doc.highlight.prop.ignoreCase'),
    type: 'boolean',
    defaultValue: 'true'
  },
  {
    name: 'matchWholeWord',
    description: t('example.doc.highlight.prop.matchWholeWord'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'variant',
    description: t('example.doc.highlight.prop.variant'),
    type: "'mark' | 'underline' | 'background'",
    defaultValue: "'mark'"
  },
  {
    name: 'color',
    description: t('example.doc.highlight.prop.color'),
    type: 'string',
    defaultValue: 'var(--ds-accent-muted)'
  },
  {
    name: 'colorText',
    description: t('example.doc.highlight.prop.colorText'),
    type: 'string',
    defaultValue: 'var(--text-primary)'
  },
  {
    name: 'ariaLabel',
    description: t('example.doc.highlight.prop.ariaLabel'),
    type: 'string',
    defaultValue: '-'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'matchChange',
    description: t('example.doc.highlight.emit.matchChange'),
    type: '(count: number) => void',
    defaultValue: '-'
  }
])

const slotRows = computed<ApiRow[]>(() => [])
</script>

<template>
  <div class="vp-curated">
    <!-- 1. Basic -->
    <DemoBlock
      :title="t('example.doc.highlight.demo.basic')"
      :description="t('example.doc.highlight.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Highlight
        :text="t('example.doc.highlight.sample.sentence')"
        keyword="Vue"
      />
    </DemoBlock>

    <!-- 2. Features -->
    <DemoBlock
      :title="t('example.doc.highlight.demo.multi')"
      :description="t('example.doc.highlight.demo.multiDesc')"
      :code="codeMulti"
    >
      <Highlight
        :text="t('example.doc.highlight.sample.paragraph')"
        :keyword="['API', 'Token', 'i18n']"
      />
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.highlight.demo.case')"
      :description="t('example.doc.highlight.demo.caseDesc')"
      :code="codeCase"
    >
      <div class="vp-highlight-demo__stack">
        <Highlight
          :text="t('example.doc.highlight.sample.cased')"
          keyword="vue"
          :ignore-case="true"
        />
        <Highlight
          :text="t('example.doc.highlight.sample.cased')"
          keyword="vue"
          :ignore-case="false"
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.highlight.demo.color')"
      :description="t('example.doc.highlight.demo.colorDesc')"
      :code="codeColor"
    >
      <div class="vp-highlight-demo__stack">
        <Highlight
          :text="t('example.doc.highlight.sample.paragraph')"
          keyword="Token"
          color="var(--warning-100)"
          color-text="var(--warning-700)"
        />
        <Highlight
          :text="t('example.doc.highlight.sample.paragraph')"
          keyword="API"
          color="var(--success-100)"
          color-text="var(--success-700)"
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.highlight.demo.search')"
      :description="t('example.doc.highlight.demo.searchDesc')"
      :code="codeSearch"
    >
      <div class="vp-highlight-demo__search">
        <label class="vp-highlight-demo__label">
          <span class="vp-highlight-demo__label-text">{{
            t('example.doc.highlight.sample.queryLabel')
          }}</span>
          <input
            v-model="searchKeyword"
            type="search"
            class="vp-highlight-demo__input"
            :aria-label="t('example.doc.highlight.sample.queryLabel')"
          />
        </label>
        <p class="vp-highlight-demo__result">
          <Highlight
            :text="t('example.doc.highlight.sample.paragraph')"
            :keyword="searchKeyword"
          />
        </p>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.highlight.demo.variant')"
      :description="t('example.doc.highlight.demo.variantDesc')"
      :code="codeVariant"
    >
      <div class="vp-highlight-demo__stack">
        <Highlight
          :text="t('example.doc.highlight.sample.sentence')"
          keyword="Vue"
          variant="mark"
        />
        <Highlight
          :text="t('example.doc.highlight.sample.sentence')"
          keyword="Vue"
          variant="underline"
        />
        <Highlight
          :text="t('example.doc.highlight.sample.sentence')"
          keyword="Vue"
          variant="background"
        />
      </div>
    </DemoBlock>

    <!-- 7. API: Props → Events → Slots -->
    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>

      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.props) }}</h3>
      <PropsTable :rows="propRows" />

      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.events) }}</h3>
      <PropsTable :rows="eventRows" />

      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.slots) }}</h3>
      <PropsTable :rows="slotRows" />
    </section>
  </div>
</template>

<style scoped>
.vp-curated {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
}

.vp-curated__api-title {
  margin: 0 0 var(--spacing-md);
  font-size: var(--font-size-lg);
  color: var(--text-primary);
}

.vp-curated__api-sub {
  margin: var(--spacing-xl) 0 var(--spacing-md);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-primary);
}

.vp-curated__api-sub:first-of-type {
  margin-top: 0;
}

.vp-highlight-demo__stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.vp-highlight-demo__search {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.vp-highlight-demo__label {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  max-width: 100%;
}

.vp-highlight-demo__label-text {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.vp-highlight-demo__input {
  font: inherit;
  font-size: var(--font-size-md);
  color: var(--text-primary);
  background: var(--surface-1);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-input-radius);
  padding: var(--spacing-sm) var(--spacing-md);
  min-height: var(--height-md);
  max-width: 100%;
}

.vp-highlight-demo__input:focus-visible {
  outline: 2px solid var(--ds-focus-ring);
  outline-offset: 2px;
}

.vp-highlight-demo__result {
  margin: 0;
  padding: var(--theme-card-pad);
  background: var(--surface-1);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  line-height: var(--line-height-body);
}
</style>
