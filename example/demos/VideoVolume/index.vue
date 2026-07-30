<script setup lang="ts">
import { computed } from 'vue'
import { VideoVolume } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('VideoVolume'))

const codeBasic = demoSfc({
  imports: [
    `import { VideoVolume } from '@amg-webui/components/base'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('VideoVolume')`],
  template: [`  <VideoVolume v-bind="mountProps" />`]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'class / style',
    type: 'BaseProps',
    description: t('example.doc.videoVolume.prop.base')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.videoVolume.when') }}</p>
    <DemoBlock
      :title="t('example.doc.videoVolume.demo.basic')"
      :description="t('example.doc.videoVolume.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <VideoVolume v-bind="mountProps" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
