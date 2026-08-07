<script setup lang="ts">
/**
 * Curated demo — aligned to Avatar gold standard (`demoCode.ts`).
 */
import { computed } from 'vue'
import { Button, Divider, Link, Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'

const { t } = useLocale()

/* ─── Code snippets: must mirror preview 1:1 (no `…`) ─── */

const codeBasic = demoSfc({
  imports: [`import { Divider } from '@amg-webui/core'`],
  template: [
    '  <p>{{ t(\'example.doc.divider.sample.above\') }}</p>',
    '  <Divider />',
    '  <p>{{ t(\'example.doc.divider.sample.below\') }}</p>',
    '  <Divider dashed />',
    '  <Divider>{{ t(\'example.doc.divider.sample.withText\') }}</Divider>',
    '  <Divider content-position="left">{{ t(\'example.doc.divider.sample.left\') }}</Divider>',
    '  <Divider content-position="right">{{ t(\'example.doc.divider.sample.right\') }}</Divider>'
  ]
})

const codeVertical = demoCode(
  `<Space align="center" wrap>`,
  `  <Link>{{ t('example.doc.divider.sample.edit') }}</Link>`,
  `  <Divider direction="vertical" />`,
  `  <Link>{{ t('example.doc.divider.sample.copy') }}</Link>`,
  `  <Divider type="vertical" dashed />`,
  `  <Link>{{ t('example.doc.divider.sample.delete') }}</Link>`,
  `  <Divider direction="vertical" />`,
  `  <Button size="sm" variant="outlined">`,
  `    {{ t('example.doc.divider.sample.more') }}`,
  `  </Button>`,
  `</Space>`
)

const codeStyle = demoCode(
  `<Divider border-style="dotted" />`,
  `<Divider dashed border-style="dashed" />`,
  `<Divider border-style="solid">`,
  `  {{ t('example.doc.divider.sample.withText') }}`,
  `</Divider>`
)

const codePlain = demoCode(
  `<Divider plain margin="sm">`,
  `  {{ t('example.doc.divider.sample.withText') }}`,
  `</Divider>`,
  `<Divider margin="none" decorative />`,
  `<Divider`,
  `  margin="lg"`,
  `  :aria-label="t('example.doc.divider.sample.section')"`,
  `/>`
)

const codeSlots = demoCode(
  `<!-- default slot: title on horizontal divider -->`,
  `<Divider content-position="center">`,
  `  {{ t('example.doc.divider.sample.withText') }}`,
  `</Divider>`,
  `<Divider content-position="left">`,
  `  {{ t('example.doc.divider.sample.left') }}`,
  `</Divider>`
)

/* ─── API tables ─── */

const propRows = computed<PropRow[]>(() => [
  {
    name: 'direction / type',
    description: t('example.doc.divider.prop.direction'),
    type: "'horizontal' | 'vertical'",
    defaultValue: "'horizontal'"
  },
  {
    name: 'contentPosition',
    description: t('example.doc.divider.prop.contentPosition'),
    type: "'left' | 'center' | 'right'",
    defaultValue: "'center'"
  },
  {
    name: 'dashed',
    description: t('example.doc.divider.prop.dashed'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'borderStyle',
    description: t('example.doc.divider.prop.borderStyle'),
    type: 'string',
    defaultValue: '-'
  },
  {
    name: 'plain',
    description: t('example.doc.divider.prop.plain'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'margin',
    description: t('example.doc.divider.prop.margin'),
    type: "'none' | 'sm' | 'md' | 'lg'",
    defaultValue: "'md'"
  },
  {
    name: 'decorative',
    description: t('example.doc.divider.prop.decorative'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'ariaLabel',
    description: t('example.doc.divider.prop.ariaLabel'),
    type: 'string',
    defaultValue: '-'
  }
])

const eventRows = computed<ApiRow[]>(() => [])

const slotRows = computed<ApiRow[]>(() => [
  {
    name: 'default',
    description: t('example.doc.divider.slot.default'),
    type: 'VNode',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <!-- 1. Basic — pasteable SFC, default-open -->
    <DemoBlock
      :title="t('example.doc.divider.demo.basic')"
      :description="t('example.doc.divider.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-divider-demo__block">
        <p>{{ t('example.doc.divider.sample.above') }}</p>
        <Divider />
        <p>{{ t('example.doc.divider.sample.below') }}</p>
        <Divider dashed />
        <Divider>{{ t('example.doc.divider.sample.withText') }}</Divider>
        <Divider content-position="left">{{ t('example.doc.divider.sample.left') }}</Divider>
        <Divider content-position="right">{{ t('example.doc.divider.sample.right') }}</Divider>
      </div>
    </DemoBlock>

    <!-- 2. Feature blocks -->
    <DemoBlock
      :title="t('example.doc.divider.demo.vertical')"
      :description="t('example.doc.divider.demo.verticalDesc')"
      :code="codeVertical"
    >
      <Space align="center" wrap>
        <Link>{{ t('example.doc.divider.sample.edit') }}</Link>
        <Divider direction="vertical" />
        <Link>{{ t('example.doc.divider.sample.copy') }}</Link>
        <Divider type="vertical" dashed />
        <Link>{{ t('example.doc.divider.sample.delete') }}</Link>
        <Divider direction="vertical" />
        <Button size="sm" variant="outlined">{{ t('example.doc.divider.sample.more') }}</Button>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.divider.demo.style')"
      :description="t('example.doc.divider.demo.styleDesc')"
      :code="codeStyle"
    >
      <div class="vp-divider-demo__block">
        <Divider border-style="dotted" />
        <Divider dashed border-style="dashed" />
        <Divider border-style="solid">{{ t('example.doc.divider.sample.withText') }}</Divider>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.divider.demo.plain')"
      :description="t('example.doc.divider.demo.plainDesc')"
      :code="codePlain"
    >
      <div class="vp-divider-demo__block">
        <Divider plain margin="sm">{{ t('example.doc.divider.sample.withText') }}</Divider>
        <Divider margin="none" decorative />
        <Divider
          margin="lg"
          :aria-label="t('example.doc.divider.sample.section')"
        />
      </div>
    </DemoBlock>

    <!-- 3. Slots -->
    <DemoBlock
      :title="t('example.doc.divider.demo.slots')"
      :description="t('example.doc.divider.demo.slotsDesc')"
      :code="codeSlots"
    >
      <div class="vp-divider-demo__block">
        <Divider content-position="center">{{ t('example.doc.divider.sample.withText') }}</Divider>
        <Divider content-position="left">{{ t('example.doc.divider.sample.left') }}</Divider>
      </div>
    </DemoBlock>

    <!-- 4. API: Props → Events → Slots -->
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
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
}

.vp-curated__api-title {
  margin: 0 0 var(--spacing-md);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-heading, 600);
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

.vp-divider-demo__block {
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
}

.vp-divider-demo__block p {
  margin: 0;
}
</style>
