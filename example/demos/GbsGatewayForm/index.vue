<script setup lang="ts">
import { computed } from 'vue'
import { GbsGatewayForm } from '@amg-webui/gb28181'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('GbsGatewayForm'))

const codeBasic = demoSfc({
  imports: [
    `import { GbsGatewayForm } from '@amg-webui/gb28181'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('GbsGatewayForm')`],
  template: [`  <GbsGatewayForm v-bind="mountProps" />`]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'class / style',
    type: 'BaseProps',
    description: t('example.doc.gbsGatewayForm.prop.base')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.gbsGatewayForm.when') }}</p>
    <DemoBlock
      :title="t('example.doc.gbsGatewayForm.demo.basic')"
      :description="t('example.doc.gbsGatewayForm.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <GbsGatewayForm v-bind="mountProps" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
