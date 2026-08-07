<script setup lang="ts">
import { ref } from 'vue'
import { DragCanvas, DragMaterial } from '@amg-webui/lowcode'
import type { CanvasNodeData } from '@amg-webui/utils'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const nodes = ref<CanvasNodeData[]>([])
const materials = [
  { type: 'button', label: 'Button', group: 'base' },
  { type: 'input', label: 'Input', group: 'base' },
  { type: 'card', label: 'Card', group: 'layout' }
]

const codeBasic = demoSfc({
  imports: [`import { DragCanvas, DragMaterial } from '@amg-webui/lowcode'`],
  template: [
    '  <Space>',
    '    <DragMaterial :materials="materials" />',
    '    <DragCanvas v-model="nodes" />',
    '  </Space>'
  ]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.dragCanvas.when') }}</p>
    <DemoBlock :title="t('example.doc.dragCanvas.demo.basic')" :description="t('example.doc.dragCanvas.demo.basicDesc')" :code="codeBasic" default-open>
      <div class="lc-row">
        <DragMaterial :materials="materials" />
        <DragCanvas v-model="nodes" class="lc-canvas" />
      </div>
    </DemoBlock>
</div>
</template>

<style scoped>
.lc-row {
  display: flex;
  gap: var(--spacing-md);
  width: 100%;
  min-height: 16rem;
}
.lc-canvas {
  flex: 1;
  min-width: 0;
}
</style>