<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button, Card, Space, Spin } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import type { PropRow } from '../../components/demo/types'

const { t } = useLocale()
const nested = ref(true)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'spinning',
    description: t('example.doc.spin.prop.spinning'),
    type: 'boolean',
    defaultValue: 'true'
  },
  {
    name: 'tip',
    description: t('example.doc.spin.prop.tip'),
    type: 'string',
    defaultValue: 'common.loading'
  },
  {
    name: 'size',
    description: t('example.doc.spin.prop.size'),
    type: 'Size',
    defaultValue: "'md'"
  },
  {
    name: 'delay / fullscreen',
    description: t('example.doc.spin.prop.extra'),
    type: 'number / boolean',
    defaultValue: '0 / false'
  }
])

const codeBasic = `<Spin />
<Spin size="lg" tip="…" />`

const codeNested = `<Spin :spinning="loading">
  <Card>…</Card>
</Spin>`
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.spin.demo.basic')"
      :description="t('example.doc.spin.demo.basicDesc')"
      :code="codeBasic"
    >
      <Space size="xl" align="center">
        <Spin size="sm" />
        <Spin size="md" />
        <Spin size="lg" />
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.spin.demo.nested')"
      :description="t('example.doc.spin.demo.nestedDesc')"
      :code="codeNested"
    >
      <Space direction="vertical" block>
        <Button size="sm" variant="outlined" @click="nested = !nested">
          {{ t('example.doc.spin.sample.toggle') }}
        </Button>
        <Spin :spinning="nested">
          <Card>
            <p>{{ t('example.doc.spin.sample.content') }}</p>
          </Card>
        </Spin>
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
</style>
