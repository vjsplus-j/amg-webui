<script setup lang="ts">
import { computed } from 'vue'
import { AudioTalk } from '@amg-webui/media'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('AudioTalk'))

const codeBasic = demoSfc({
  imports: [
    `import { AudioTalk } from '@amg-webui/media'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('AudioTalk')`],
  template: [`  <AudioTalk v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.audioTalk.when') }}</p>
    <DemoBlock
      :title="t('example.doc.audioTalk.demo.basic')"
      :description="t('example.doc.audioTalk.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <AudioTalk v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
