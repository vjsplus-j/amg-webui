<script setup lang="ts">
import { computed } from 'vue'
import { Pixel404 } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('Pixel404'))

const codeBasic = demoSfc({
  imports: [
    `import { Pixel404 } from '@amg-webui/core'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('Pixel404')`],
  template: [`  <Pixel404 v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.pixel404.when') }}</p>
    <DemoBlock
      :title="t('example.doc.pixel404.demo.basic')"
      :description="t('example.doc.pixel404.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Pixel404 v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
