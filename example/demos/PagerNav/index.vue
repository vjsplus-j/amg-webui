<script setup lang="ts">
import { computed, ref } from 'vue'
import { PagerNav, Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const page = ref(1)

const codeBasic = demoSfc({
  imports: [`import { PagerNav } from '@amg-webui/core'`],
  template: ['  <PagerNav v-model="page" :total-pages="8" />']
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'modelValue',
    type: 'number',
    defaultValue: '1',
    description: t('example.doc.pagerNav.prop.model')
  },
  {
    name: 'totalPages',
    type: 'number',
    defaultValue: '1',
    description: t('example.doc.pagerNav.prop.totalPages')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.pagerNav.when') }}</p>

    <DemoBlock
      :title="t('example.doc.pagerNav.demo.basic')"
      :description="t('example.doc.pagerNav.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block size="md">
        <PagerNav v-model="page" :total-pages="8" />
        <p class="hint">
          {{ t('example.doc.pagerNav.sample.page', { page }) }}
        </p>
      </Space>
    </DemoBlock>

    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.hint {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}
</style>
