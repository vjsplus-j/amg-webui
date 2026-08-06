<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button, CanvasPreview, Tag } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { createComponentRegistry } from '@amg-webui/lowcode'
import { createCanvasNode } from '@amg-webui/utils'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const selected = ref<string | null>(null)

const registry = createComponentRegistry([
  {
    type: 'Button',
    label: 'Button',
    component: Button,
    defaultProps: { label: 'OK' }
  },
  {
    type: 'Tag',
    label: 'Tag',
    component: Tag,
    defaultProps: { label: 'Tag' }
  }
])

const nodes = ref([
  createCanvasNode('Button', 'Button', {
    x: 24,
    y: 24,
    w: 140,
    h: 48,
    props: { label: 'Preview' }
  }),
  createCanvasNode('Tag', 'Tag', {
    x: 200,
    y: 32,
    w: 100,
    h: 40,
    props: { label: 'Schema' }
  })
])

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { Button, CanvasPreview, Tag } from '@amg-webui/components/base'`,
    `import { createComponentRegistry } from '@amg-webui/lowcode'`,
    `import { createCanvasNode } from '@amg-webui/utils'`
  ],
  script: [
    `const selected = ref(null)`,
    `const registry = createComponentRegistry([{ type: 'Button', label: 'Button', component: Button }])`,
    `const nodes = ref([createCanvasNode('Button', 'Button', { props: { label: 'Preview' } })])`
  ],
  template: [
    `  <CanvasPreview v-model="selected" :nodes="nodes" :registry="registry" render-mode="component" />`
  ]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'nodes / modelValue',
    type: 'CanvasNodeData[] / string | null',
    description: t('example.doc.canvasPreview.prop.base')
  },
  {
    name: 'registry / renderMode',
    type: 'ComponentRegistry / chrome | component',
    description: t('example.doc.canvasPreview.when')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.canvasPreview.when') }}</p>
    <DemoBlock
      :title="t('example.doc.canvasPreview.demo.basic')"
      :description="t('example.doc.canvasPreview.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <CanvasPreview
        v-model="selected"
        :nodes="nodes"
        :registry="registry"
        render-mode="component"
        :canvas-width="640"
        :canvas-height="240"
      />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
