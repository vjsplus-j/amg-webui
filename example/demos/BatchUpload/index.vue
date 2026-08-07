<script setup lang="ts">
import { computed } from 'vue'
import { BatchUpload } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('BatchUpload'))

const codeBasic = demoSfc({
  imports: [
    `import { BatchUpload } from '@amg-webui/form'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('BatchUpload')`],
  template: [`  <BatchUpload v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.batchUpload.when') }}</p>
    <DemoBlock
      :title="t('example.doc.batchUpload.demo.basic')"
      :description="t('example.doc.batchUpload.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <BatchUpload v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
