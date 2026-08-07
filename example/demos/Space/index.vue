<script setup lang="ts">
/**
 * Curated demo — aligned to Avatar gold standard (`demoCode.ts`).
 */
import {  } from 'vue'
import { Button, Space } from '@amg-webui/core'
import type { Size } from '@amg-webui/types'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'

const { t } = useLocale()

const sizes: Size[] = ['xs', 'sm', 'md', 'lg', 'xl']

function sizeLabel(sz: Size) {
  return t(`example.doc.space.size.${sz}`)
}

/* ─── Code snippets: must mirror preview 1:1 (no `…`) ─── */

const codeBasic = demoSfc({
  imports: [`import { Button, Space } from '@amg-webui/core'`],
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
  </div>
</template>

<style scoped>
.vp-curated {
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
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
