<script setup lang="ts">
import { computed } from 'vue'
import { InfoModal } from '@amg-webui/overlay'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('InfoModal'))

const codeBasic = demoSfc({
  imports: [
    `import { InfoModal } from '@amg-webui/overlay'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('InfoModal')`],
  template: [`  <InfoModal v-bind="mountProps" />`]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'class / style',
    type: 'BaseProps',
    description: t('example.doc.infoModal.prop.base')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.infoModal.when') }}</p>
    <DemoBlock
      :title="t('example.doc.infoModal.demo.basic')"
      :description="t('example.doc.infoModal.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <InfoModal v-bind="mountProps" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
