<script setup lang="ts">
import { computed } from 'vue'
import { VcrClipCut } from '@amg-webui/media'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('VcrClipCut'))

const codeBasic = demoSfc({
  imports: [
    `import { VcrClipCut } from '@amg-webui/media'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('VcrClipCut')`],
  template: [`  <VcrClipCut v-bind="mountProps" />`]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'class / style',
    type: 'BaseProps',
    description: t('example.doc.vcrClipCut.prop.base')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.vcrClipCut.when') }}</p>
    <DemoBlock
      :title="t('example.doc.vcrClipCut.demo.basic')"
      :description="t('example.doc.vcrClipCut.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <VcrClipCut v-bind="mountProps" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
