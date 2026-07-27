<script setup lang="ts">
/**
 * Curated demo — aligned to Avatar gold standard (`demoCode.ts`).
 */
import { computed } from 'vue'
import { Button, Space } from '@amg-webui/components/base'
import type { Size } from '@amg-webui/types'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'

const { t } = useLocale()

const sizes: Size[] = ['xs', 'sm', 'md', 'lg', 'xl']

function sizeLabel(sz: Size) {
  return t(`example.doc.space.size.${sz}`)
}

/* ─── Code snippets: must mirror preview 1:1 (no `…`) ─── */

const codeBasic = demoSfc({
  imports: [`import { Button, Space } from '@amg-webui/components/base'`],
  template: [
    '  <Space>',
    '    <Button size="sm">A</Button>',
    '    <Button size="sm" variant="outlined">B</Button>',
    '    <Button size="sm" variant="text">C</Button>',
    '  </Space>'
  ]
})

const codeSize = demoCode(
  `<Space direction="vertical" block size="lg">`,
  `  <Space size="xs">`,
  `    <Button size="sm">A</Button>`,
  `    <Button size="sm" variant="outlined">B</Button>`,
  `    <Button size="sm" variant="text">C</Button>`,
  `  </Space>`,
  `  <Space size="sm">`,
  `    <Button size="sm">A</Button>`,
  `    <Button size="sm" variant="outlined">B</Button>`,
  `    <Button size="sm" variant="text">C</Button>`,
  `  </Space>`,
  `  <Space size="md">`,
  `    <Button size="sm">A</Button>`,
  `    <Button size="sm" variant="outlined">B</Button>`,
  `    <Button size="sm" variant="text">C</Button>`,
  `  </Space>`,
  `  <Space size="lg">`,
  `    <Button size="sm">A</Button>`,
  `    <Button size="sm" variant="outlined">B</Button>`,
  `    <Button size="sm" variant="text">C</Button>`,
  `  </Space>`,
  `  <Space size="xl">`,
  `    <Button size="sm">A</Button>`,
  `    <Button size="sm" variant="outlined">B</Button>`,
  `    <Button size="sm" variant="text">C</Button>`,
  `  </Space>`,
  `</Space>`
)

const codeVert = demoCode(
  `<Space direction="vertical">`,
  `  <Button size="sm">A</Button>`,
  `  <Button size="sm" variant="outlined">B</Button>`,
  `  <Button size="sm" variant="text">C</Button>`,
  `</Space>`
)

const codeAlign = demoCode(
  `<Space align="center" justify="space-between" block>`,
  `  <Button size="sm">A</Button>`,
  `  <Button size="sm" variant="outlined">B</Button>`,
  `  <Button size="sm" variant="text">C</Button>`,
  `</Space>`,
  ``,
  `<Space wrap size="sm">`,
  `  <Button size="sm">1</Button>`,
  `  <Button size="sm">2</Button>`,
  `  <Button size="sm">3</Button>`,
  `  <Button size="sm">4</Button>`,
  `  <Button size="sm">5</Button>`,
  `  <Button size="sm">6</Button>`,
  `</Space>`
)

const codeSplit = demoCode(
  `<Space :aria-label="t('example.doc.space.sample.splitGroup')">`,
  `  <template #separator>|</template>`,
  `  <Button size="sm" variant="text">{{ t('example.doc.space.sample.linkA') }}</Button>`,
  `  <Button size="sm" variant="text">{{ t('example.doc.space.sample.linkB') }}</Button>`,
  `  <Button size="sm" variant="text">{{ t('example.doc.space.sample.linkC') }}</Button>`,
  `</Space>`
)

const codeSlots = demoCode(
  `<!-- default slot: spaced children -->`,
  `<Space size="md">`,
  `  <Button size="sm">A</Button>`,
  `  <Button size="sm" variant="outlined">B</Button>`,
  `</Space>`
)

/* ─── API tables ─── */

const propRows = computed<PropRow[]>(() => [
  {
    name: 'size / gap',
    description: t('example.doc.space.prop.size'),
    type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | string",
    defaultValue: "'md'"
  },
  {
    name: 'direction',
    description: t('example.doc.space.prop.direction'),
    type: "'horizontal' | 'vertical'",
    defaultValue: "'horizontal'"
  },
  {
    name: 'align / justify',
    description: t('example.doc.space.prop.align'),
    type: "'start' | 'end' | 'center' | 'baseline' | 'stretch' / 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'",
    defaultValue: '-'
  },
  {
    name: 'wrap / block',
    description: t('example.doc.space.prop.layout'),
    type: 'boolean',
    defaultValue: 'true / false'
  },
  {
    name: 'ariaLabel',
    description: t('example.doc.space.prop.ariaLabel'),
    type: 'string',
    defaultValue: '-'
  }
])

const eventRows = computed<ApiRow[]>(() => [])

const slotRows = computed<ApiRow[]>(() => [
  {
    name: 'default',
    description: t('example.doc.space.slot.default'),
    type: 'VNode',
    defaultValue: '-'
  },
  {
    name: 'separator',
    description: t('example.doc.space.slot.separator'),
    type: 'VNode',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <!-- 1. Basic — pasteable SFC, default-open -->
    <DemoBlock
      :title="t('example.doc.space.demo.basic')"
      :description="t('example.doc.space.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space>
        <Button size="sm">A</Button>
        <Button size="sm" variant="outlined">B</Button>
        <Button size="sm" variant="text">C</Button>
      </Space>
    </DemoBlock>

    <!-- 2. Feature blocks -->
    <DemoBlock
      :title="t('example.doc.space.demo.size')"
      :description="t('example.doc.space.demo.sizeDesc')"
      :code="codeSize"
    >
      <Space direction="vertical" block size="lg">
        <div v-for="sz in sizes" :key="sz" class="vp-space-demo__row">
          <span class="vp-space-demo__label">{{ sizeLabel(sz) }} ({{ sz }})</span>
          <Space :size="sz">
            <Button size="sm">A</Button>
            <Button size="sm" variant="outlined">B</Button>
            <Button size="sm" variant="text">C</Button>
          </Space>
        </div>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.space.demo.vertical')"
      :description="t('example.doc.space.demo.verticalDesc')"
      :code="codeVert"
    >
      <Space direction="vertical">
        <Button size="sm">A</Button>
        <Button size="sm" variant="outlined">B</Button>
        <Button size="sm" variant="text">C</Button>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.space.demo.align')"
      :description="t('example.doc.space.demo.alignDesc')"
      :code="codeAlign"
    >
      <Space direction="vertical" block size="lg">
        <Space align="center" justify="space-between" block>
          <Button size="sm">A</Button>
          <Button size="sm" variant="outlined">B</Button>
          <Button size="sm" variant="text">C</Button>
        </Space>
        <Space wrap size="sm" class="vp-space-demo__wrap">
          <Button size="sm">1</Button>
          <Button size="sm">2</Button>
          <Button size="sm">3</Button>
          <Button size="sm">4</Button>
          <Button size="sm">5</Button>
          <Button size="sm">6</Button>
        </Space>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.space.demo.split')"
      :description="t('example.doc.space.demo.splitDesc')"
      :code="codeSplit"
    >
      <Space :aria-label="t('example.doc.space.sample.splitGroup')">
        <template #separator>|</template>
        <Button size="sm" variant="text">{{ t('example.doc.space.sample.linkA') }}</Button>
        <Button size="sm" variant="text">{{ t('example.doc.space.sample.linkB') }}</Button>
        <Button size="sm" variant="text">{{ t('example.doc.space.sample.linkC') }}</Button>
      </Space>
    </DemoBlock>

    <!-- 3. Slots -->
    <DemoBlock
      :title="t('example.doc.space.demo.slots')"
      :description="t('example.doc.space.demo.slotsDesc')"
      :code="codeSlots"
    >
      <Space size="md">
        <Button size="sm">A</Button>
        <Button size="sm" variant="outlined">B</Button>
      </Space>
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

.vp-space-demo__row {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.vp-space-demo__label {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}

.vp-space-demo__wrap {
  max-width: 100%;
}
</style>
