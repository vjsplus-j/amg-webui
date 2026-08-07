<script setup lang="ts">
import { computed } from 'vue'
import { FilePreview } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('FilePreview'))

const codeBasic = demoSfc({
  imports: [
    `import { FilePreview } from '@amg-webui/core'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('FilePreview')`],
  template: [`  <FilePreview v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.filePreview.when') }}</p>
    <DemoBlock
      :title="t('example.doc.filePreview.demo.basic')"
      :description="t('example.doc.filePreview.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <FilePreview v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
