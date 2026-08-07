<script setup lang="ts">
import {  } from 'vue'
import { CanvasNode } from '@amg-webui/lowcode'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { CanvasNodeData } from '@amg-webui/utils'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const sampleNode: CanvasNodeData = {
  id: 'n1',
  type: 'default',
  x: 24,
  y: 24,
  w: 120,
  h: 48,
  label: 'Node',
  props: {}
}

const codeBasic = demoSfc({
  imports: [`import { CanvasNode } from '@amg-webui/lowcode'`],
  template: ['  <CanvasNode :node="sampleNode" />']
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.canvasNode.when') }}</p>
    <DemoBlock
      :title="t('example.doc.canvasNode.demo.basic')"
      :description="t('example.doc.canvasNode.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-canvas-node-stage">
        <CanvasNode :node="sampleNode" />
      </div>
    </DemoBlock>
</div>
</template>

<style scoped>
.vp-canvas-node-stage {
  position: relative;
  width: 100%;
  min-height: calc(var(--spacing-2xl) * 4);
  box-sizing: border-box;
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  background: var(--surface-1);
}
</style>
