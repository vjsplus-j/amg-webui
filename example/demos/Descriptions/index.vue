<script setup lang="ts">
/**
 * Curated demo — Data wave1 Descriptions
 */
import { computed, ref } from 'vue'
import { Descriptions, DescriptionsItem } from '@amg-webui/data'
import { Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const density = ref<'sm' | 'md' | 'lg'>('md')

const codeBasic = demoSfc({
  imports: [
    `import { Descriptions, DescriptionsItem } from '@amg-webui/data'`
  ],
  template: [
    `  <Descriptions bordered :column="2" :title="t('example.doc.descriptions.sample.title')">`,
    `    <DescriptionsItem :label="t('example.doc.descriptions.sample.name')">Ada Lovelace</DescriptionsItem>`,
    `    <DescriptionsItem :label="t('example.doc.descriptions.sample.role')">{{ t('common.admin') }}</DescriptionsItem>`,
    `    <DescriptionsItem :label="t('example.doc.descriptions.sample.email')" :span="2">ada@example.com</DescriptionsItem>`,
    `  </Descriptions>`
  ]
})

const codeSize = demoCode(
  `<Descriptions`,
  `  bordered`,
  `  :size="density"`,
  `  :column="2"`,
  `  :title="t('example.doc.descriptions.sample.title')"`,
  `>`,
  `  <!-- DescriptionsItem children -->`,
  `</Descriptions>`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'column',
    description: t('example.doc.descriptions.prop.column'),
    type: 'number',
    defaultValue: '3'
  },
  {
    name: 'bordered',
    description: t('example.doc.descriptions.prop.bordered'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'size',
    description: t('example.doc.descriptions.prop.size'),
    type: "'sm' | 'md' | 'lg'",
    defaultValue: "'md'"
  },
  {
    name: 'DescriptionsItem.label / span',
    description: t('example.doc.descriptions.prop.label'),
    type: 'string / number',
    defaultValue: '—'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.descriptions.demo.basic')"
      :description="t('example.doc.descriptions.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Descriptions
        bordered
        :column="2"
        :title="t('example.doc.descriptions.sample.title')"
        label-width="6rem"
      >
        <DescriptionsItem :label="t('example.doc.descriptions.sample.name')" colon>
          Ada Lovelace
        </DescriptionsItem>
        <DescriptionsItem :label="t('example.doc.descriptions.sample.role')" colon>
          {{ t('common.admin') }}
        </DescriptionsItem>
        <DescriptionsItem :label="t('example.doc.descriptions.sample.dept')" colon>
          {{ t('example.doc.descriptions.sample.deptValue') }}
        </DescriptionsItem>
        <DescriptionsItem :label="t('example.doc.descriptions.sample.status')" colon>
          {{ t('example.doc.descriptions.sample.statusValue') }}
        </DescriptionsItem>
        <DescriptionsItem :label="t('example.doc.descriptions.sample.email')" :span="2" colon>
          ada@example.com
        </DescriptionsItem>
        <DescriptionsItem :label="t('example.doc.descriptions.sample.phone')" colon>
          +1 555 0100
        </DescriptionsItem>
        <DescriptionsItem :label="t('example.doc.descriptions.sample.location')" colon>
          {{ t('example.doc.descriptions.sample.locationValue') }}
        </DescriptionsItem>
      </Descriptions>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.descriptions.demo.size')"
      :description="t('example.doc.descriptions.demo.sizeDesc')"
      :code="codeSize"
    >
      <Space direction="vertical" block size="md" class="vp-curated__stack">
        <div class="vp-curated__row">
          <button
            v-for="sz in (['sm', 'md', 'lg'] as const)"
            :key="sz"
            type="button"
            class="density-btn"
            :class="{ 'density-btn--active': density === sz }"
            @click="density = sz"
          >
            {{ sz }}
          </button>
        </div>
        <Descriptions
          bordered
          :size="density"
          :column="2"
          :title="t('example.doc.descriptions.sample.title')"
          label-width="6rem"
        >
          <DescriptionsItem :label="t('example.doc.descriptions.sample.name')" colon>
            Ada Lovelace
          </DescriptionsItem>
          <DescriptionsItem :label="t('example.doc.descriptions.sample.role')" colon>
            {{ t('common.admin') }}
          </DescriptionsItem>
        </Descriptions>
      </Space>
    </DemoBlock>

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.props) }}</h3>
      <PropsTable :rows="propRows" />
    </section>
  </div>
</template>

<style scoped lang="scss">
.vp-curated__row {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  min-width: 0;
  gap: var(--spacing-md);
}

.vp-curated__stack {
  width: 100%;
}

.density-btn {
  appearance: none;
  padding: var(--spacing-xs) var(--spacing-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-btn-radius);
  background: var(--surface-1);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  cursor: pointer;
}

.density-btn--active {
  border-color: var(--ds-accent);
  color: var(--text-primary);
}

.vp-curated__api {
  width: 100%;
  margin-top: var(--theme-section-gap);
}

.vp-curated__api-title {
  margin: 0 0 var(--spacing-md);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-primary);
}

.vp-curated__api-sub {
  margin: var(--spacing-lg) 0 var(--spacing-sm);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-secondary);
}
</style>
