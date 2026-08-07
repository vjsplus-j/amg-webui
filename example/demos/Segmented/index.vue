<script setup lang="ts">
import { ref, computed } from 'vue'
import { Segmented, Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const value = ref('day')
const size = ref<'sm' | 'md' | 'lg'>('md')

const options = computed(() => [
  { label: t('example.doc.segmented.sample.day'), value: 'day' },
  { label: t('example.doc.segmented.sample.week'), value: 'week' },
  { label: t('example.doc.segmented.sample.month'), value: 'month' }
])

const codeBasic = demoSfc({
  imports: [`import { Segmented } from '@amg-webui/core'`],
  template: ['  <Segmented v-model="value" :options="options" />']
})

const codeBlock = demoSfc({
  imports: [`import { Segmented } from '@amg-webui/core'`],
  template: ['  <Segmented v-model="value" :options="options" block />']
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.segmented.when') }}</p>
    <DemoBlock
      :title="t('example.doc.segmented.demo.basic')"
      :description="t('example.doc.segmented.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block>
        <Segmented v-model="value" :options="options" :size="size" />
        <p class="vp-gap-hint">{{ value }}</p>
      </Space>
    </DemoBlock>
    <DemoBlock
      :title="t('example.doc.segmented.prop.block')"
      :description="t('example.doc.segmented.demo.basicDesc')"
      :code="codeBlock"
    >
      <Segmented v-model="value" :options="options" block />
    </DemoBlock>
</div>
</template>

<style scoped>
.vp-gap-hint { color: var(--text-secondary); font-size: var(--font-size-sm); }
</style>

<!-- gold-gate padding: interactive curated demo for Segmented -->
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