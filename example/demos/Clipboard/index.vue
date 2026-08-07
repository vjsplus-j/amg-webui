<script setup lang="ts">
import { computed } from 'vue'
import { Clipboard } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('Clipboard'))

const codeBasic = demoSfc({
  imports: [
    `import { Clipboard } from '@amg-webui/core'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('Clipboard')`],
  template: [`  <Clipboard v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.clipboard.when') }}</p>
    <DemoBlock
      :title="t('example.doc.clipboard.demo.basic')"
      :description="t('example.doc.clipboard.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Clipboard v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
