<script setup lang="ts">
import { computed } from 'vue'
import { ChunkUpload } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('ChunkUpload'))

const codeBasic = demoSfc({
  imports: [
    `import { ChunkUpload } from '@amg-webui/form'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('ChunkUpload')`],
  template: [`  <ChunkUpload v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.chunkUpload.when') }}</p>
    <DemoBlock
      :title="t('example.doc.chunkUpload.demo.basic')"
      :description="t('example.doc.chunkUpload.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <ChunkUpload v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
