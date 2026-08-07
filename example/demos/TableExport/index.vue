<script setup lang="ts">
import { computed } from 'vue'
import { TableExport } from '@amg-webui/data'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('TableExport'))

const codeBasic = demoSfc({
  imports: [
    `import { TableExport } from '@amg-webui/data'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('TableExport')`],
  template: [`  <TableExport v-bind="mountProps" />`]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'class / style',
    type: 'BaseProps',
    description: t('example.doc.tableExport.prop.base')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.tableExport.when') }}</p>
    <DemoBlock
      :title="t('example.doc.tableExport.demo.basic')"
      :description="t('example.doc.tableExport.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <TableExport v-bind="mountProps" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
