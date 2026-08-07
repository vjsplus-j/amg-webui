<script setup lang="ts">
import { computed } from 'vue'
import { GaugeChart } from '@amg-webui/charts'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('GaugeChart'))

const codeBasic = demoSfc({
  imports: [
    `import { GaugeChart } from '@amg-webui/charts'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('GaugeChart')`],
  template: [`  <GaugeChart v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.gaugeChart.when') }}</p>
    <DemoBlock
      :title="t('example.doc.gaugeChart.demo.basic')"
      :description="t('example.doc.gaugeChart.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <GaugeChart v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
