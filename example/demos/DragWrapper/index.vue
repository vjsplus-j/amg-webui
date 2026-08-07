<script setup lang="ts">
import { computed } from 'vue'
import { DragWrapper } from '@amg-webui/lowcode'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('DragWrapper'))

const codeBasic = demoSfc({
  imports: [
    `import { DragWrapper } from '@amg-webui/lowcode'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('DragWrapper')`],
  template: [`  <DragWrapper v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.dragWrapper.when') }}</p>
    <DemoBlock
      :title="t('example.doc.dragWrapper.demo.basic')"
      :description="t('example.doc.dragWrapper.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <DragWrapper v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
