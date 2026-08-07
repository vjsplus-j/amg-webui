<script setup lang="ts">
import { computed } from 'vue'
import { OnvifDeviceList } from '@amg-webui/components/industry'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('OnvifDeviceList'))

const codeBasic = demoSfc({
  imports: [
    `import { OnvifDeviceList } from '@amg-webui/components/industry'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('OnvifDeviceList')`],
  template: [`  <OnvifDeviceList v-bind="mountProps" />`]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'class / style',
    type: 'BaseProps',
    description: t('example.doc.onvifDeviceList.prop.base')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.onvifDeviceList.when') }}</p>
    <DemoBlock
      :title="t('example.doc.onvifDeviceList.demo.basic')"
      :description="t('example.doc.onvifDeviceList.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <OnvifDeviceList v-bind="mountProps" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
