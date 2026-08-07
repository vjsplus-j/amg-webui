<script setup lang="ts">
import { computed } from 'vue'
import { CanvasShortcut } from '@amg-webui/lowcode'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('CanvasShortcut'))

const codeBasic = demoSfc({
  imports: [
    `import { CanvasShortcut } from '@amg-webui/lowcode'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('CanvasShortcut')`],
  template: [`  <CanvasShortcut v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.canvasShortcut.when') }}</p>
    <DemoBlock
      :title="t('example.doc.canvasShortcut.demo.basic')"
      :description="t('example.doc.canvasShortcut.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <CanvasShortcut v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
