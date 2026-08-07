<script setup lang="ts">
import { computed } from 'vue'
import { HeatMap } from '@amg-webui/charts'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('HeatMap'))

const codeBasic = demoSfc({
  imports: [
    `import { HeatMap } from '@amg-webui/charts'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('HeatMap')`],
  template: [`  <HeatMap v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.heatMap.when') }}</p>
    <DemoBlock
      :title="t('example.doc.heatMap.demo.basic')"
      :description="t('example.doc.heatMap.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <HeatMap v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
