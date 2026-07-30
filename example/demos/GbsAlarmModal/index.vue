<script setup lang="ts">
import { computed } from 'vue'
import { GbsAlarmModal } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('GbsAlarmModal'))

const codeBasic = demoSfc({
  imports: [
    `import { GbsAlarmModal } from '@amg-webui/components/base'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('GbsAlarmModal')`],
  template: [`  <GbsAlarmModal v-bind="mountProps" />`]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'class / style',
    type: 'BaseProps',
    description: t('example.doc.gbsAlarmModal.prop.base')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.gbsAlarmModal.when') }}</p>
    <DemoBlock
      :title="t('example.doc.gbsAlarmModal.demo.basic')"
      :description="t('example.doc.gbsAlarmModal.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <GbsAlarmModal v-bind="mountProps" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
