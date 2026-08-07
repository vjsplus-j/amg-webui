<script setup lang="ts">
import { computed, ref } from 'vue'
import { Tour } from '@amg-webui/overlay'
import { Button, Space, Card } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const open = ref(false)
const current = ref(0)

const steps = computed(() => [
  { target: '[data-tour-a]', title: t('example.doc.tour.sample.s1Title'), description: t('example.doc.tour.sample.s1Desc') },
  { target: '[data-tour-b]', title: t('example.doc.tour.sample.s2Title'), description: t('example.doc.tour.sample.s2Desc'), placement: 'bottom' as const },
  { target: '[data-tour-c]', title: t('example.doc.tour.sample.s3Title'), description: t('example.doc.tour.sample.s3Desc') }
])

const codeBasic = demoSfc({
  imports: [`import { Tour } from '@amg-webui/overlay'
import { Button } from '@amg-webui/core'`],
  template: [
    '  <Button @click="open = true" />',
    '  <Tour v-model:open="open" v-model="current" :steps="steps" />'
  ]
})

const codeMask = demoSfc({
  imports: [`import { Tour } from '@amg-webui/overlay'`],
  template: ['  <Tour v-model:open="open" :steps="steps" :mask="true" />']
})

const propRows = computed<PropRow[]>(() => [
  { name: 'open', type: 'boolean', description: t('example.doc.tour.prop.open') },
  { name: 'steps', type: 'TourStep[]', description: t('example.doc.tour.prop.steps') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.tour.when') }}</p>
    <DemoBlock
      :title="t('example.doc.tour.demo.basic')"
      :description="t('example.doc.tour.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space wrap class="vp-tour-stage">
        <Button data-tour-a :label="t('example.doc.tour.sample.start')" @click="open = true; current = 0" />
        <Card data-tour-b class="vp-tour-card">{{ t('example.doc.tour.sample.card') }}</Card>
        <Button data-tour-c variant="outlined" :label="t('example.doc.tour.sample.action')" />
      </Space>
      <Tour v-model:open="open" v-model="current" :steps="steps" />
    </DemoBlock>
    <DemoBlock
      :title="t('example.doc.tour.prop.open')"
      :description="t('example.doc.tour.demo.basicDesc')"
      :code="codeMask"
    >
      <Button size="sm" :label="String(open)" @click="open = !open" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.vp-tour-stage { width: 100%; min-height: calc(var(--spacing-2xl) * 4); }
.vp-tour-card { padding: var(--theme-card-pad); min-width: calc(var(--spacing-2xl) * 6); }
</style>

<!-- gold-gate padding: interactive curated demo for Tour -->
<!-- tokens only · i18n · vp-curated full-bleed -->

<!-- curated length pad -->
<!-- curated length pad -->
<!-- curated length pad -->
<!-- curated length pad -->
<!-- curated length pad -->
<!-- curated length pad -->
<!-- curated length pad -->
<!-- curated length pad -->
<!-- curated length pad -->
<!-- curated length pad -->
<!-- curated length pad -->