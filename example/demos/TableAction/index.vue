<script setup lang="ts">
import { computed } from 'vue'
import { TableAction } from '@amg-webui/data'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('TableAction'))

const codeBasic = demoSfc({
  imports: [
    `import { TableAction } from '@amg-webui/data'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('TableAction')`],
  template: [`  <TableAction v-bind="mountProps" />`]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'class / style',
    type: 'BaseProps',
    description: t('example.doc.tableAction.prop.base')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.tableAction.when') }}</p>
    <DemoBlock
      :title="t('example.doc.tableAction.demo.basic')"
      :description="t('example.doc.tableAction.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <TableAction v-bind="mountProps" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
