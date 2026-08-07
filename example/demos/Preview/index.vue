<script setup lang="ts">
import { computed } from 'vue'
import { Preview } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('Preview'))

const codeBasic = demoSfc({
  imports: [
    `import { Preview } from '@amg-webui/core'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('Preview')`],
  template: [`  <Preview v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.preview.when') }}</p>
    <DemoBlock
      :title="t('example.doc.preview.demo.basic')"
      :description="t('example.doc.preview.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Preview v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
