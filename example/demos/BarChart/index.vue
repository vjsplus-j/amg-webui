<script setup lang="ts">
import { ref } from 'vue'
import { BarChart } from '@amg-webui/charts'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const chartData = ref([40, 65, 30, 80, 55, 70])
const codeBasic = demoSfc({
  imports: [`import { BarChart } from '@amg-webui/charts'`],
  template: [`  <BarChart :data="chartData" />`]
})
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.barChart.when') }}</p>
    <DemoBlock :title="t('example.doc.barChart.demo.basic')" :description="t('example.doc.barChart.demo.basicDesc')" :code="codeBasic" default-open>
      <BarChart :data="chartData" />
    </DemoBlock>
</div>
</template>
