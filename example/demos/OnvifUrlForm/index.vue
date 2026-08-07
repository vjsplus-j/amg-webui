<script setup lang="ts">
import { computed } from 'vue'
import { OnvifUrlForm } from '@amg-webui/components/industry'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('OnvifUrlForm'))

const codeBasic = demoSfc({
  imports: [
    `import { OnvifUrlForm } from '@amg-webui/components/industry'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('OnvifUrlForm')`],
  template: [`  <OnvifUrlForm v-bind="mountProps" />`]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'class / style',
    type: 'BaseProps',
    description: t('example.doc.onvifUrlForm.prop.base')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.onvifUrlForm.when') }}</p>
    <DemoBlock
      :title="t('example.doc.onvifUrlForm.demo.basic')"
      :description="t('example.doc.onvifUrlForm.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <OnvifUrlForm v-bind="mountProps" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
