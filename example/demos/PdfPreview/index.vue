<script setup lang="ts">
import { computed } from 'vue'
import { PdfPreview } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('PdfPreview'))

const codeBasic = demoSfc({
  imports: [
    `import { PdfPreview } from '@amg-webui/core'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('PdfPreview')`],
  template: [`  <PdfPreview v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.pdfPreview.when') }}</p>
    <DemoBlock
      :title="t('example.doc.pdfPreview.demo.basic')"
      :description="t('example.doc.pdfPreview.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <PdfPreview v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
