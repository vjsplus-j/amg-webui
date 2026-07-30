<script setup lang="ts">
import { computed, ref } from 'vue'
import { ResizeBox, Button, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const width = ref(280)
const height = ref(160)
const last = ref('')

const codeBasic = demoSfc({
  imports: [`import { ResizeBox } from '@amg-webui/components/base'`],
  template: [
    '  <ResizeBox :width="width" :height="height" :min-width="160" :min-height="120" @resize="onResize">',
    `    {{ t('example.doc.resizeBox.sample.body') }}`,
    '  </ResizeBox>'
  ]
})

function onResize(payload: { width: number; height: number }) {
  width.value = payload.width
  height.value = payload.height
  last.value = `${Math.round(payload.width)}×${Math.round(payload.height)}`
}

const propRows = computed<PropRow[]>(() => [
  {
    name: 'width / height',
    type: 'number | string',
    defaultValue: "'100%' / 'auto'",
    description: t('example.doc.resizeBox.prop.size')
  },
  {
    name: 'minWidth / minHeight / max*',
    type: 'number',
    defaultValue: '120 / 80',
    description: t('example.doc.resizeBox.prop.minMax')
  },
  {
    name: 'directions',
    type: 'ResizeDirection[]',
    defaultValue: "['right','bottom','bottom-right']",
    description: t('example.doc.resizeBox.prop.directions')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.resizeBox.when') }}</p>
    <DemoBlock
      :title="t('example.doc.resizeBox.demo.basic')"
      :description="t('example.doc.resizeBox.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block size="md">
        <Space wrap>
          <Button size="sm" variant="outlined" @click="width = 240; height = 140">
            {{ t('example.doc.resizeBox.sample.reset') }}
          </Button>
        </Space>
        <p v-if="last" class="vp-curated__hint">
          {{ t('example.doc.resizeBox.sample.resized', { size: last }) }}
        </p>
        <div class="frame">
          <ResizeBox :width="width" :height="height" :min-width="160" :min-height="120" @resize="onResize">
            <div class="body">{{ t('example.doc.resizeBox.sample.body') }}</div>
          </ResizeBox>
        </div>
      </Space>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.frame {
  width: 100%;
  min-height: calc(var(--spacing-2xl) * 8);
  padding: var(--spacing-md);
  background: var(--surface-1);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  box-sizing: border-box;
}
.body {
  height: 100%;
  padding: var(--theme-card-pad);
  background: var(--surface-2);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  box-sizing: border-box;
}
</style>
