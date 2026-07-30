<script setup lang="ts">
import { computed, ref } from 'vue'
import { SelectNav, Space } from '@amg-webui/components/base'
import type { SelectNavItem } from '@amg-webui/components/base/SelectNav'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const active = ref<string | number>('home')

const options = computed<SelectNavItem[]>(() => [
  { label: t('example.doc.selectNav.sample.home'), value: 'home' },
  { label: t('example.doc.selectNav.sample.docs'), value: 'docs' },
  { label: t('example.doc.selectNav.sample.lab'), value: 'lab' }
])

const codeBasic = demoSfc({
  imports: [`import { SelectNav } from '@amg-webui/components/base'`],
  template: ['  <SelectNav v-model="active" :options="options" />']
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'modelValue',
    type: 'string | number',
    defaultValue: '-',
    description: t('example.doc.selectNav.prop.model')
  },
  {
    name: 'options',
    type: 'SelectNavItem[]',
    defaultValue: '[]',
    description: t('example.doc.selectNav.prop.options')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.selectNav.when') }}</p>

    <DemoBlock
      :title="t('example.doc.selectNav.demo.basic')"
      :description="t('example.doc.selectNav.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block size="md">
        <SelectNav v-model="active" :options="options" />
        <p class="hint">
          {{ t('example.doc.selectNav.sample.active', { key: String(active) }) }}
        </p>
      </Space>
    </DemoBlock>

    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.hint {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}
</style>
