<script setup lang="ts">
import { computed } from 'vue'
import { DragVerify } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('DragVerify'))

const codeBasic = demoSfc({
  imports: [
    `import { DragVerify } from '@amg-webui/core'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('DragVerify')`],
  template: [`  <DragVerify v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.dragVerify.when') }}</p>
    <DemoBlock
      :title="t('example.doc.dragVerify.demo.basic')"
      :description="t('example.doc.dragVerify.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <DragVerify v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
