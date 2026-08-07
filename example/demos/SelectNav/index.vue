<script setup lang="ts">
import { computed, ref } from 'vue'
import { SelectNav } from '@amg-webui/form'
import { Space } from '@amg-webui/core'
import type { SelectNavItem } from '@amg-webui/form/SelectNav'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const active = ref<string | number>('home')

const options = computed<SelectNavItem[]>(() => [
  { label: t('example.doc.selectNav.sample.home'), value: 'home' },
  { label: t('example.doc.selectNav.sample.docs'), value: 'docs' },
  { label: t('example.doc.selectNav.sample.lab'), value: 'lab' }
])

const codeBasic = demoSfc({
  imports: [`import { SelectNav } from '@amg-webui/form'`],
  template: ['  <SelectNav v-model="active" :options="options" />']
})

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
</div>
</template>

<style scoped>
.hint {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}
</style>
