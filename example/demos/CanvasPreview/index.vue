<script setup lang="ts">
import { computed } from 'vue'
import { CanvasPreview } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('CanvasPreview'))

const codeBasic = demoSfc({
  imports: [
    `import { CanvasPreview } from '@amg-webui/components/base'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('CanvasPreview')`],
  template: [`  <CanvasPreview v-bind="mountProps" />`]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'class / style',
    type: 'BaseProps',
    description: t('example.doc.canvasPreview.prop.base')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.canvasPreview.when') }}</p>
    <DemoBlock
      :title="t('example.doc.canvasPreview.demo.basic')"
      :description="t('example.doc.canvasPreview.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <CanvasPreview v-bind="mountProps" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
