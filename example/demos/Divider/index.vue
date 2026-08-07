<script setup lang="ts">
/**
 * Curated demo — aligned to Avatar gold standard (`demoCode.ts`).
 */
import {  } from 'vue'
import { Button, Divider, Link, Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'

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
  </div>
</template>

<style scoped>
.vp-curated {
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
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
