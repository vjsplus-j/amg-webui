<script setup lang="ts">
import { ref } from 'vue'
import { Split, Button, Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const size = ref<number | string>('40%')
const direction = ref<'horizontal' | 'vertical'>('horizontal')

const codeBasic = demoSfc({
  imports: [`import { Split } from '@amg-webui/core'`],
  template: [
    '  <Split v-model:size="size" :direction="direction" class="demo-split">',
    '    <template #first><div class="pane">A</div></template>',
    '    <template #second><div class="pane">B</div></template>',
    '  </Split>'
  ]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.split.when') }}</p>
    <DemoBlock
      :title="t('example.doc.split.demo.basic')"
      :description="t('example.doc.split.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block size="md">
        <Space wrap>
          <Button
            size="sm"
            :variant="direction === 'horizontal' ? 'solid' : 'outlined'"
            @click="direction = 'horizontal'"
          >
            {{ t('example.doc.split.sample.horizontal') }}
          </Button>
          <Button
            size="sm"
            :variant="direction === 'vertical' ? 'solid' : 'outlined'"
            @click="direction = 'vertical'"
          >
            {{ t('example.doc.split.sample.vertical') }}
          </Button>
          <Button size="sm" variant="outlined" @click="size = '30%'">30%</Button>
          <Button size="sm" variant="outlined" @click="size = '50%'">50%</Button>
          <Button size="sm" variant="outlined" @click="size = '70%'">70%</Button>
        </Space>
        <p class="vp-curated__hint">{{ t('example.doc.split.sample.size', { size: String(size) }) }}</p>
        <Split v-model:size="size" :direction="direction" class="demo-split">
          <template #first>
            <div class="pane">{{ t('example.doc.split.sample.paneA') }}</div>
          </template>
          <template #second>
            <div class="pane">{{ t('example.doc.split.sample.paneB') }}</div>
          </template>
        </Split>
      </Space>
    </DemoBlock>
</div>
</template>

<style scoped>
.demo-split {
  width: 100%;
  min-height: calc(var(--spacing-2xl) * 6);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  overflow: hidden;
}
.pane {
  height: 100%;
  min-height: calc(var(--spacing-2xl) * 4);
  padding: var(--theme-card-pad);
  background: var(--surface-2);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  box-sizing: border-box;
}
</style>
