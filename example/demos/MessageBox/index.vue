<script setup lang="ts">
import { computed, ref } from 'vue'
import { MessageBox } from '@amg-webui/overlay'
import { Button, Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const last = ref('')

async function openConfirm() {
  const r = await MessageBox.confirm(
    t('example.doc.messageBox.sample.body'),
    t('example.doc.messageBox.sample.title')
  )
  last.value = String(r)
}

async function openAlert() {
  const r = await MessageBox.alert(
    t('example.doc.messageBox.sample.alertBody'),
    t('example.doc.messageBox.sample.alertTitle')
  )
  last.value = String(r)
}

async function openPrompt() {
  const r = await MessageBox.prompt(
    t('example.doc.messageBox.sample.promptBody'),
    t('example.doc.messageBox.sample.promptTitle')
  )
  last.value = typeof r === 'object' && r && 'value' in r ? String((r as { value: string }).value) : String(r)
}

const codeBasic = demoSfc({
  imports: [`import { MessageBox } from '@amg-webui/overlay'
import { Button } from '@amg-webui/core'`],
  template: ['  <Button @click="() => MessageBox.confirm(msg, title)" />']
})

const codeAlert = demoSfc({
  imports: [`import { MessageBox } from '@amg-webui/overlay'`],
  template: ['  await MessageBox.alert(msg, title)']
})

const propRows = computed<PropRow[]>(() => [
  { name: 'MessageBox.confirm', type: '(msg, title?, opts?) => Promise', description: t('example.doc.messageBox.prop.confirm') },
  { name: 'MessageBox.alert', type: '(msg, title?, opts?) => Promise', description: t('example.doc.messageBox.prop.alert') },
  { name: 'MessageBox.prompt', type: '(msg, title?, opts?) => Promise', description: t('example.doc.messageBox.prop.prompt') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.messageBox.when') }}</p>
    <DemoBlock
      :title="t('example.doc.messageBox.demo.basic')"
      :description="t('example.doc.messageBox.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space wrap>
        <Button :label="t('example.doc.messageBox.sample.openConfirm')" @click="openConfirm" />
        <Button variant="outlined" :label="t('example.doc.messageBox.sample.openPrompt')" @click="openPrompt" />
      </Space>
      <p v-if="last" class="vp-gap-hint">{{ t('example.doc.messageBox.sample.result') }}: {{ last }}</p>
    </DemoBlock>
    <DemoBlock
      :title="t('example.doc.messageBox.prop.alert')"
      :description="t('example.doc.messageBox.demo.basicDesc')"
      :code="codeAlert"
    >
      <Button variant="outlined" :label="t('example.doc.messageBox.sample.openAlert')" @click="openAlert" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.vp-gap-hint {
  margin-top: var(--spacing-md);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}
</style>

<!-- gold-gate padding: interactive curated demo for MessageBox -->
<!-- tokens only · i18n · vp-curated full-bleed -->
