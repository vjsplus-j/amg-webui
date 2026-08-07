<script setup lang="ts">
import { computed } from 'vue'
import { CanvasLayer } from '@amg-webui/lowcode'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('CanvasLayer'))

const codeBasic = demoSfc({
  imports: [
    `import { CanvasLayer } from '@amg-webui/lowcode'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('CanvasLayer')`],
  template: [`  <CanvasLayer v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.canvasLayer.when') }}</p>
    <DemoBlock
      :title="t('example.doc.canvasLayer.demo.basic')"
      :description="t('example.doc.canvasLayer.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <CanvasLayer v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
