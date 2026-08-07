<script setup lang="ts">
import { computed } from 'vue'
import { BrowserDetect } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('BrowserDetect'))

const codeBasic = demoSfc({
  imports: [
    `import { BrowserDetect } from '@amg-webui/core'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('BrowserDetect')`],
  template: [`  <BrowserDetect v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.browserDetect.when') }}</p>
    <DemoBlock
      :title="t('example.doc.browserDetect.demo.basic')"
      :description="t('example.doc.browserDetect.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <BrowserDetect v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
