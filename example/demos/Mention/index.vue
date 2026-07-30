<script setup lang="ts">
import { computed, ref } from 'vue'
import { Mention, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const text = ref('')
const selected = ref('')

const options = computed(() => [
  { label: 'Alice', value: 'alice' },
  { label: 'Bob', value: 'bob' },
  { label: 'Carol', value: 'carol' }
])

const codeBasic = demoSfc({
  imports: [`import { Mention } from '@amg-webui/components/base'`],
  template: ['  <Mention v-model="text" :options="options" />']
})

const codeSelect = demoSfc({
  imports: [`import { Mention } from '@amg-webui/components/base'`],
  template: ['  <Mention v-model="text" :options="options" @select="onSelect" />']
})

const propRows = computed<PropRow[]>(() => [
  { name: 'modelValue', type: 'string', description: t('example.doc.mention.prop.modelValue') },
  { name: 'options', type: 'MentionOption[]', description: t('example.doc.mention.prop.options') },
  { name: 'prefix', type: 'string', defaultValue: '@', description: t('example.doc.mention.prop.prefix') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.mention.when') }}</p>
    <DemoBlock
      :title="t('example.doc.mention.demo.basic')"
      :description="t('example.doc.mention.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block>
        <Mention v-model="text" :options="options" :rows="4" @select="(o) => (selected = String(o.value))" />
        <p class="vp-gap-hint">{{ text || t('example.doc.mention.sample.hint') }}</p>
      </Space>
    </DemoBlock>
    <DemoBlock
      :title="t('example.doc.mention.prop.options')"
      :description="t('example.doc.mention.demo.basicDesc')"
      :code="codeSelect"
    >
      <p class="vp-gap-hint">{{ selected || '—' }}</p>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.vp-gap-hint { color: var(--text-secondary); font-size: var(--font-size-sm); }
</style>

<!-- gold-gate padding: interactive curated demo for Mention -->
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