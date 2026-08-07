<script setup lang="ts">
import { computed } from 'vue'
import { VideoVolume } from '@amg-webui/media'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('VideoVolume'))

const codeBasic = demoSfc({
  imports: [
    `import { VideoVolume } from '@amg-webui/media'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('VideoVolume')`],
  template: [`  <VideoVolume v-bind="mountProps" />`]
})

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
</div>
</template>
