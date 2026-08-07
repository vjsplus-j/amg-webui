<script setup lang="ts">
import { computed, ref } from 'vue'
import { StepNav, VerticalStepNav, Space } from '@amg-webui/core'
import type { NavItem } from '@amg-webui/utils/nav'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const horizontal = ref<string | number>(0)
const vertical = ref<string | number>(0)

const items = computed<NavItem[]>(() => [
  { label: t('example.doc.stepNav.sample.s1'), value: 0 },
  { label: t('example.doc.stepNav.sample.s2'), value: 1 },
  { label: t('example.doc.stepNav.sample.s3'), value: 2 }
])

const codeHorizontal = demoSfc({
  imports: [`import { StepNav } from '@amg-webui/core'`],
  template: ['  <StepNav v-model="step" :items="items" />']
})

const codeVertical = demoSfc({
  imports: [`import { VerticalStepNav } from '@amg-webui/core'`],
  template: ['  <VerticalStepNav v-model="step" :items="items" />']
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.stepNav.when') }}</p>

    <DemoBlock
      :title="t('example.doc.stepNav.demo.horizontal')"
      :description="t('example.doc.stepNav.demo.horizontalDesc')"
      :code="codeHorizontal"
      default-open
    >
      <Space direction="vertical" block size="md">
        <StepNav v-model="horizontal" :items="items" />
        <p class="hint">
          {{ t('example.doc.stepNav.sample.active', { key: String(horizontal) }) }}
        </p>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.stepNav.demo.vertical')"
      :description="t('example.doc.stepNav.demo.verticalDesc')"
      :code="codeVertical"
    >
      <Space direction="vertical" block size="md">
        <VerticalStepNav v-model="vertical" :items="items" />
        <p class="hint">
          {{ t('example.doc.stepNav.sample.active', { key: String(vertical) }) }}
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
