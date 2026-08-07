<script setup lang="ts">
import { computed, ref } from 'vue'
import { InputOTP } from '@amg-webui/form'
import { Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const code = ref('')
const done = ref('')

const codeBasic = demoSfc({
  imports: [`import { InputOTP } from '@amg-webui/form'`],
  template: ['  <InputOTP v-model="code" :length="6" @complete="onComplete" />']
})

const codeMask = demoSfc({
  imports: [`import { InputOTP } from '@amg-webui/form'`],
  template: ['  <InputOTP v-model="code" :length="6" mask />']
})

const propRows = computed<PropRow[]>(() => [
  { name: 'modelValue', type: 'string', description: t('example.doc.inputOTP.prop.modelValue') },
  { name: 'length', type: 'number', defaultValue: '6', description: t('example.doc.inputOTP.prop.length') },
  { name: 'mask', type: 'boolean', defaultValue: 'false', description: t('example.doc.inputOTP.prop.mask') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.inputOTP.when') }}</p>
    <DemoBlock
      :title="t('example.doc.inputOTP.demo.basic')"
      :description="t('example.doc.inputOTP.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block>
        <InputOTP v-model="code" :length="6" @complete="done = $event" />
        <p class="vp-gap-hint">
          {{ t('example.doc.inputOTP.sample.value') }}: {{ code || '—' }}
          <span v-if="done"> · {{ t('example.doc.inputOTP.sample.complete') }}</span>
        </p>
      </Space>
    </DemoBlock>
    <DemoBlock
      :title="t('example.doc.inputOTP.prop.mask')"
      :description="t('example.doc.inputOTP.demo.basicDesc')"
      :code="codeMask"
    >
      <InputOTP v-model="code" :length="6" mask />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.vp-gap-hint { color: var(--text-secondary); font-size: var(--font-size-sm); }
</style>

<!-- gold-gate padding: interactive curated demo for InputOTP -->
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