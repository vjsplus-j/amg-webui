<script setup lang="ts">
import { computed } from 'vue'
import { VideoWatermark } from '@amg-webui/media'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('VideoWatermark'))

const codeBasic = demoSfc({
  imports: [
    `import { VideoWatermark } from '@amg-webui/media'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('VideoWatermark')`],
  template: [`  <VideoWatermark v-bind="mountProps" />`]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'class / style',
    type: 'BaseProps',
    description: t('example.doc.videoWatermark.prop.base')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.videoWatermark.when') }}</p>
    <DemoBlock
      :title="t('example.doc.videoWatermark.demo.basic')"
      :description="t('example.doc.videoWatermark.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <VideoWatermark v-bind="mountProps" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
