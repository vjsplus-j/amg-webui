<script setup lang="ts">
import { computed } from 'vue'
import { OnvifAlarmPanel } from '@amg-webui/onvif'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('OnvifAlarmPanel'))

const codeBasic = demoSfc({
  imports: [
    `import { OnvifAlarmPanel } from '@amg-webui/onvif'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('OnvifAlarmPanel')`],
  template: [`  <OnvifAlarmPanel v-bind="mountProps" />`]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'class / style',
    type: 'BaseProps',
    description: t('example.doc.onvifAlarmPanel.prop.base')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.onvifAlarmPanel.when') }}</p>
    <DemoBlock
      :title="t('example.doc.onvifAlarmPanel.demo.basic')"
      :description="t('example.doc.onvifAlarmPanel.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <OnvifAlarmPanel v-bind="mountProps" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
