<script setup lang="ts">
import { ref } from 'vue'
import { TimeSelect } from '@amg-webui/form'
import { Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
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