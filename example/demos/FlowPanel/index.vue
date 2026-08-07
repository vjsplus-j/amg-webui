<script setup lang="ts">
import { computed, ref } from 'vue'
import { FlowPanel } from '@amg-webui/data'
import { StatusTip } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const current = ref('review')
const navLog = ref('')

const steps = computed(() => [
  {
    id: 'draft',
    title: t('example.doc.flowPanel.sample.s1'),
    description: t('example.doc.flowPanel.sample.d1'),
    status: 'done' as const,
    time: '2026-07-30 09:00'
  },
  {
    id: 'review',
    title: t('example.doc.flowPanel.sample.s2'),
    description: t('example.doc.flowPanel.sample.d2'),
    status: 'active' as const,
    time: '2026-07-30 10:15'
  },
  {
    id: 'publish',
    title: t('example.doc.flowPanel.sample.s3'),
    description: t('example.doc.flowPanel.sample.d3'),
    status: 'pending' as const
  }
])

const codeBasic = demoSfc({
  imports: [`import { FlowPanel } from '@amg-webui/data'`],
  template: [
    '  <FlowPanel v-model:current="current" :steps="steps" show-nav @prev="onPrev" @next="onNext" />'
  ]
})

const propRows = computed<PropRow[]>(() => [
  { name: 'steps', type: 'FlowStep[]', description: t('example.doc.flowPanel.prop.steps') },
  { name: 'current', type: 'string', description: t('example.doc.flowPanel.prop.current') },
  { name: 'showNav', type: 'boolean', defaultValue: 'false', description: t('example.doc.flowPanel.prop.showNav') }
])

const stepIds = computed(() => steps.value.map((s) => s.id))

const goPrev = () => {
  const idx = stepIds.value.indexOf(current.value)
  if (idx > 0) current.value = stepIds.value[idx - 1]
  navLog.value = t('example.doc.flowPanel.sample.prev', { step: current.value })
}

const goNext = () => {
  const idx = stepIds.value.indexOf(current.value)
  if (idx < stepIds.value.length - 1) current.value = stepIds.value[idx + 1]
  navLog.value = t('example.doc.flowPanel.sample.next', { step: current.value })
}
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.flowPanel.when') }}</p>

    <DemoBlock
      :title="t('example.doc.flowPanel.demo.wizard')"
      :description="t('example.doc.flowPanel.demo.wizardDesc')"
      :code="codeBasic"
    >
      <div class="vp-curated__stack">
        <FlowPanel
          v-model:current="current"
          :steps="steps"
          show-nav
          @prev="goPrev"
          @next="goNext"
        >
          <p class="vp-curated__body">{{ t('example.doc.flowPanel.sample.body', { step: current }) }}</p>
        </FlowPanel>
        <StatusTip v-if="navLog" severity="info" :message="navLog" />
      </div>
    </DemoBlock>

    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.vp-curated__stack {
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
  width: 100%;
}
.vp-curated__body {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}
</style>
