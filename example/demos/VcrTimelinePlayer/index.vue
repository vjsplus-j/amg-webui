<script setup lang="ts">
import { computed } from 'vue'
import { VcrTimelinePlayer } from '@amg-webui/media'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('VcrTimelinePlayer'))

const codeBasic = demoSfc({
  imports: [
    `import { VcrTimelinePlayer } from '@amg-webui/media'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('VcrTimelinePlayer')`],
  template: [`  <VcrTimelinePlayer v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.vcrTimelinePlayer.when') }}</p>
    <DemoBlock
      :title="t('example.doc.vcrTimelinePlayer.demo.basic')"
      :description="t('example.doc.vcrTimelinePlayer.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <VcrTimelinePlayer v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
