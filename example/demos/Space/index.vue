<script setup lang="ts">
import { computed } from 'vue'
import { Button, Space } from '@amg-webui/components/base'
import type { Size } from '@amg-webui/types'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import type { PropRow } from '../../components/demo/types'

const { t } = useLocale()

/** 极小 → 极大 */
const sizes: Size[] = ['xs', 'sm', 'md', 'lg', 'xl']

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
    type: 'string',
    defaultValue: '-'
  },
  {
    name: 'wrap / block',
    description: t('example.doc.space.prop.layout'),
    type: 'boolean',
    defaultValue: 'true / false'
  }
])

const codeBasic = `<Space>
  <Button>A</Button>
  <Button>B</Button>
  <Button>C</Button>
</Space>`

const codeSize = `<Space size="xs">…</Space>  <!-- 极小 -->
<Space size="sm">…</Space>  <!-- 小 -->
<Space size="md">…</Space>  <!-- 中 -->
<Space size="lg">…</Space>  <!-- 大 -->
<Space size="xl">…</Space>  <!-- 极大 -->`

const codeVert = `<Space direction="vertical" block>
  <Button>A</Button>
  <Button>B</Button>
</Space>`

function sizeLabel(sz: Size) {
  return t(`example.doc.space.size.${sz}`)
}
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.space.demo.basic')"
      :description="t('example.doc.space.demo.basicDesc')"
      :code="codeBasic"
    >
      <Space>
        <Button size="sm">A</Button>
        <Button size="sm" variant="outlined">B</Button>
        <Button size="sm" variant="text">C</Button>
      </Space>
    </DemoBlock>

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

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>
      <PropsTable :rows="propRows" />
    </section>
  </div>
</template>

<style scoped lang="scss">
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
</style>
