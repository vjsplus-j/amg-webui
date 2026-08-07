<script setup lang="ts">
import { computed } from 'vue'
import { TablePrint } from '@amg-webui/data'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('TablePrint'))

const codeBasic = demoSfc({
  imports: [
    `import { TablePrint } from '@amg-webui/data'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('TablePrint')`],
  template: [`  <TablePrint v-bind="mountProps" />`]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'class / style',
    type: 'BaseProps',
    description: t('example.doc.tablePrint.prop.base')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.tablePrint.when') }}</p>
    <DemoBlock
      :title="t('example.doc.tablePrint.demo.basic')"
      :description="t('example.doc.tablePrint.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <TablePrint v-bind="mountProps" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
