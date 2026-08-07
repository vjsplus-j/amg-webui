<script setup lang="ts">
import { computed } from 'vue'
import { LineChart } from '@amg-webui/charts'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('LineChart'))

const codeBasic = demoSfc({
  imports: [
    `import { LineChart } from '@amg-webui/charts'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('LineChart')`],
  template: [`  <LineChart v-bind="mountProps" />`]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'class / style',
    type: 'BaseProps',
    description: t('example.doc.lineChart.prop.base')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.lineChart.when') }}</p>
    <DemoBlock
      :title="t('example.doc.lineChart.demo.basic')"
      :description="t('example.doc.lineChart.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <LineChart v-bind="mountProps" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
