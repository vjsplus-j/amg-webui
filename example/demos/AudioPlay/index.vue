<script setup lang="ts">
import { computed } from 'vue'
import { AudioPlay } from '@amg-webui/media'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('AudioPlay'))

const codeBasic = demoSfc({
  imports: [
    `import { AudioPlay } from '@amg-webui/media'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('AudioPlay')`],
  template: [`  <AudioPlay v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.audioPlay.when') }}</p>
    <DemoBlock
      :title="t('example.doc.audioPlay.demo.basic')"
      :description="t('example.doc.audioPlay.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <AudioPlay v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
