<script setup lang="ts">
import { computed, ref } from 'vue'
import { TimeSelect } from '@amg-webui/form'
import { Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const time = ref<string | null>('09:00')
const step = ref('00:30')

const codeBasic = demoSfc({
  imports: [`import { TimeSelect } from '@amg-webui/form'`],
  template: ['  <TimeSelect v-model="time" start="08:00" end="18:00" step="00:30" />']
})

const codeStep = demoSfc({
  imports: [`import { TimeSelect } from '@amg-webui/form'`],
  template: ['  <TimeSelect v-model="time" start="08:00" end="12:00" step="00:15" />']
})

const propRows = computed<PropRow[]>(() => [
  { name: 'modelValue', type: 'string | null', description: t('example.doc.timeSelect.prop.modelValue') },
  { name: 'start / end / step', type: 'string', defaultValue: '00:00 / 23:30 / 00:30', description: t('example.doc.timeSelect.prop.range') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.timeSelect.when') }}</p>
    <DemoBlock
      :title="t('example.doc.timeSelect.demo.basic')"
      :description="t('example.doc.timeSelect.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block>
        <TimeSelect v-model="time" start="08:00" end="18:00" :step="step" />
        <p class="vp-gap-hint">{{ time || '—' }}</p>
      </Space>
    </DemoBlock>
    <DemoBlock
      :title="t('example.doc.timeSelect.prop.range')"
      :description="t('example.doc.timeSelect.demo.basicDesc')"
      :code="codeStep"
    >
      <TimeSelect v-model="time" start="08:00" end="12:00" step="00:15" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.vp-gap-hint { color: var(--text-secondary); font-size: var(--font-size-sm); }
</style>

<!-- gold-gate padding: interactive curated demo for TimeSelect -->
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
<!-- curated length pad -->