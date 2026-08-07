<script setup lang="ts">
/**
 * Curated demo — Data wave1 Pagination
 */
import { computed, ref } from 'vue'
import { Pagination } from '@amg-webui/data'
import { Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const page = ref(1)
const pageSize = ref(10)
const total = 128

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { Pagination } from '@amg-webui/data'`
  ],
  script: [`const page = ref(1)`, `const pageSize = ref(10)`],
  template: [
    '  <Pagination',
    '    :total="128"',
    '    v-model:page="page"',
    '    v-model:page-size="pageSize"',
    '  />'
  ]
})

const codePageSize = demoCode(
  `<Pagination`,
  `  :total="128"`,
  `  v-model:page="page"`,
  `  v-model:page-size="pageSize"`,
  `  :page-sizes="[10, 20, 50]"`,
  `/>`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'total',
    description: t('example.doc.pagination.prop.total'),
    type: 'number',
    defaultValue: '0'
  },
  {
    name: 'page (v-model:page)',
    description: t('example.doc.pagination.prop.page'),
    type: 'number',
    defaultValue: '1'
  },
  {
    name: 'pageSize (v-model:pageSize)',
    description: t('example.doc.pagination.prop.pageSize'),
    type: 'number',
    defaultValue: '10'
  },
  {
    name: 'pageSizes',
    description: t('example.doc.pagination.prop.pageSizes'),
    type: 'number[]',
    defaultValue: '[10, 20, 50, 100]'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:page / update:pageSize / change',
    description: t('example.doc.pagination.event.change'),
    type: '({ page, pageSize }) => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.pagination.demo.basic')"
      :description="t('example.doc.pagination.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block size="md">
        <Pagination
          :total="total"
          v-model:page="page"
          v-model:page-size="pageSize"
        >
          <template #total="{ total: n }">
            {{ t('example.doc.pagination.sample.total', { total: n }) }}
          </template>
        </Pagination>
        <p class="vp-curated__hint">
          {{ t('example.doc.pagination.sample.current', { page, pageSize }) }}
        </p>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.pagination.demo.pageSize')"
      :description="t('example.doc.pagination.demo.pageSizeDesc')"
      :code="codePageSize"
    >
      <Pagination
        :total="total"
        v-model:page="page"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50]"
      />
    </DemoBlock>

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.props) }}</h3>
      <PropsTable :rows="propRows" />
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.events) }}</h3>
      <PropsTable :rows="eventRows" />
    </section>
  </div>
</template>

<style scoped lang="scss">
.vp-curated__hint {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
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
