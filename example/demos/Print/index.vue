<script setup lang="ts">
import { computed } from 'vue'
import { Print } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('Print'))

const codeBasic = demoSfc({
  imports: [
    `import { Print } from '@amg-webui/core'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('Print')`],
  template: [`  <Print v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.print.when') }}</p>
    <DemoBlock
      :title="t('example.doc.print.demo.basic')"
      :description="t('example.doc.print.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Print v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
