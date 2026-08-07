<script setup lang="ts">
import { computed } from 'vue'
import { VideoPlayer } from '@amg-webui/media'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('VideoPlayer'))

const codeBasic = demoSfc({
  imports: [
    `import { VideoPlayer } from '@amg-webui/media'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('VideoPlayer')`],
  template: [`  <VideoPlayer v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.videoPlayer.when') }}</p>
    <DemoBlock
      :title="t('example.doc.videoPlayer.demo.basic')"
      :description="t('example.doc.videoPlayer.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <VideoPlayer v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
