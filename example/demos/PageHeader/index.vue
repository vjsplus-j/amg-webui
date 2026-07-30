<script setup lang="ts">
import { computed, ref } from 'vue'
import { PageHeader, Button, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const backLog = ref('')
const withBack = ref(true)

const codeBasic = demoSfc({
  imports: [`import { PageHeader, Button } from '@amg-webui/components/base'`],
  template: [
    '  <PageHeader back :title="title" :subtitle="subtitle">',
    '    <template #extra><Button size="sm" /></template>',
    '  </PageHeader>'
  ]
})

const codePlain = demoSfc({
  imports: [`import { PageHeader } from '@amg-webui/components/base'`],
  template: ['  <PageHeader :title="title" />']
})

const propRows = computed<PropRow[]>(() => [
  { name: 'title / subtitle', type: 'string', description: t('example.doc.pageHeader.prop.title') },
  { name: 'back', type: 'boolean', defaultValue: 'false', description: t('example.doc.pageHeader.prop.back') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.pageHeader.when') }}</p>
    <DemoBlock
      :title="t('example.doc.pageHeader.demo.basic')"
      :description="t('example.doc.pageHeader.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <PageHeader
        :back="withBack"
        :title="t('example.doc.pageHeader.sample.title')"
        :subtitle="t('example.doc.pageHeader.sample.subtitle')"
        @back="backLog = t('example.doc.pageHeader.sample.backFired')"
      >
        <template #extra>
          <Space>
            <Button size="sm" variant="outlined" :label="t('example.doc.pageHeader.sample.extra')" />
          </Space>
        </template>
        <p class="vp-gap-hint">{{ t('example.doc.pageHeader.sample.body') }}</p>
      </PageHeader>
      <p v-if="backLog" class="vp-gap-hint">{{ backLog }}</p>
    </DemoBlock>
    <DemoBlock
      :title="t('example.doc.pageHeader.prop.back')"
      :description="t('example.doc.pageHeader.demo.basicDesc')"
      :code="codePlain"
    >
      <Button size="sm" :label="String(withBack)" @click="withBack = !withBack" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.vp-gap-hint {
  margin: var(--spacing-md) 0 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}
</style>

<!-- gold-gate padding: interactive curated demo for PageHeader -->
<!-- tokens only · i18n · vp-curated full-bleed -->
