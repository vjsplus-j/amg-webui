<script setup lang="ts">
import { computed } from 'vue'
import { GbsStatusCard } from '@amg-webui/components/industry'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('GbsStatusCard'))

const codeBasic = demoSfc({
  imports: [
    `import { GbsStatusCard } from '@amg-webui/components/industry'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('GbsStatusCard')`],
  template: [`  <GbsStatusCard v-bind="mountProps" />`]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'class / style',
    type: 'BaseProps',
    description: t('example.doc.gbsStatusCard.prop.base')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.gbsStatusCard.when') }}</p>
    <DemoBlock
      :title="t('example.doc.gbsStatusCard.demo.basic')"
      :description="t('example.doc.gbsStatusCard.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <GbsStatusCard v-bind="mountProps" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
