<script setup lang="ts">
import { computed } from 'vue'
import { Space, Statistic } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import type { PropRow } from '../../components/demo/types'

const { t } = useLocale()

const propRows = computed<PropRow[]>(() => [
  {
    name: 'value',
    description: t('example.doc.statistic.prop.value'),
    type: 'number | string',
    defaultValue: '-'
  },
  {
    name: 'title / prefix / suffix',
    description: t('example.doc.statistic.prop.label'),
    type: 'string',
    defaultValue: '-'
  },
  {
    name: 'precision / separators',
    description: t('example.doc.statistic.prop.format'),
    type: 'number / string',
    defaultValue: '-'
  },
  {
    name: 'trend',
    description: t('example.doc.statistic.prop.trend'),
    type: "'up' | 'down' | 'none'",
    defaultValue: "'none'"
  },
  {
    name: 'animate / duration',
    description: t('example.doc.statistic.prop.animate'),
    type: 'boolean / number',
    defaultValue: 'false / 1000'
  },
  {
    name: '@finish',
    description: t('example.doc.statistic.emit.finish'),
    type: '(value: number | string) => void',
    defaultValue: '-'
  }
])

const codeBasic = `<Statistic
  :title="…"
  :value="128650"
  prefix="¥"
  :precision="2"
/>`

const codeTrend = `<Statistic :value="12.6" suffix="%" trend="up" />
<Statistic :value="3.2" suffix="%" trend="down" />`
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.statistic.demo.basic')"
      :description="t('example.doc.statistic.demo.basicDesc')"
      :code="codeBasic"
    >
      <Space size="xl" wrap>
        <Statistic
          :title="t('example.doc.statistic.sample.revenue')"
          :value="128650.55"
          prefix="¥"
          :precision="2"
          animate
        />
        <Statistic
          :title="t('example.doc.statistic.sample.users')"
          :value="10842"
          animate
        />
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.statistic.demo.trend')"
      :description="t('example.doc.statistic.demo.trendDesc')"
      :code="codeTrend"
    >
      <Space size="xl" wrap>
        <Statistic
          :title="t('example.doc.statistic.sample.growth')"
          :value="12.6"
          suffix="%"
          :precision="1"
          trend="up"
        />
        <Statistic
          :title="t('example.doc.statistic.sample.churn')"
          :value="3.2"
          suffix="%"
          :precision="1"
          trend="down"
        />
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
