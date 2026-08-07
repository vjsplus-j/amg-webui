<script setup lang="ts">
import { computed } from 'vue'
import { WarnModal } from '@amg-webui/overlay'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('WarnModal'))

const codeBasic = demoSfc({
  imports: [
    `import { WarnModal } from '@amg-webui/overlay'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('WarnModal')`],
  template: [`  <WarnModal v-bind="mountProps" />`]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'class / style',
    type: 'BaseProps',
    description: t('example.doc.warnModal.prop.base')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.warnModal.when') }}</p>
    <DemoBlock
      :title="t('example.doc.warnModal.demo.basic')"
      :description="t('example.doc.warnModal.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <WarnModal v-bind="mountProps" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
