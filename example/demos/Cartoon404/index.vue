<script setup lang="ts">
import { computed } from 'vue'
import { Cartoon404 } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('Cartoon404'))

const codeBasic = demoSfc({
  imports: [
    `import { Cartoon404 } from '@amg-webui/core'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('Cartoon404')`],
  template: [`  <Cartoon404 v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.cartoon404.when') }}</p>
    <DemoBlock
      :title="t('example.doc.cartoon404.demo.basic')"
      :description="t('example.doc.cartoon404.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Cartoon404 v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
