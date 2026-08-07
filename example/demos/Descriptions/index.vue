<script setup lang="ts">
/**
 * Curated demo — Data wave1 Descriptions
 */
import { ref } from 'vue'
import { Descriptions, DescriptionsItem } from '@amg-webui/data'
import { Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
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
</style>
