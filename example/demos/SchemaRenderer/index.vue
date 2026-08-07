<script setup lang="ts">
import { computed } from 'vue'
import { Button, Card } from '@amg-webui/core'
import { SchemaRenderer, createComponentRegistry } from '@amg-webui/lowcode'
import type { CanvasSchema } from '@amg-webui/utils'
import { CANVAS_SCHEMA_VERSION, createCanvasNode } from '@amg-webui/utils'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const registry = createComponentRegistry([
  {
    type: 'Card',
    label: 'Card',
    component: Card,
    group: 'layout',
    isContainer: true,
    defaultProps: {},
    defaultSize: { w: 280, h: 120 },
    propsSchema: { title: { type: 'string' } }
  },
  {
    type: 'Button',
    label: 'Button',
    component: Button,
    group: 'general',
    defaultProps: { label: t('example.doc.configProvider.sample.btn') },
    defaultSize: { w: 140, h: 40 },
    propsSchema: { label: { type: 'string' } }
  }
])

const card = createCanvasNode('Card', 'Card', {
  x: 0,
  y: 0,
  w: 320,
  h: 120,
  props: { title: t('component.schema-renderer.title') }
})
const button = createCanvasNode('Button', 'Button', {
  x: 16,
  y: 56,
  w: 120,
  h: 40,
  props: { label: t('example.doc.configProvider.sample.btn') },
  parentId: card.id
})

const schema: CanvasSchema = {
  version: CANVAS_SCHEMA_VERSION,
  mode: 'free',
  nodes: [card, button]
}

const codeBasic = demoSfc({
  imports: [
    `import { SchemaRenderer, createComponentRegistry } from '@amg-webui/lowcode'`,
    `import { Button, Card } from '@amg-webui/core'`
  ],
  template: [
    `  <SchemaRenderer`,
    `    :schema="schema"`,
    `    :registry="registry"`,
    `    render-mode="component"`,
    `  />`
  ]
})

const emptySchema: CanvasSchema = {
  version: CANVAS_SCHEMA_VERSION,
  mode: 'free',
  nodes: []
}

const codeEmpty = demoSfc({
  imports: [
    `import { SchemaRenderer, createComponentRegistry } from '@amg-webui/lowcode'`,
    `import type { CanvasSchema } from '@amg-webui/utils'`,
    `import { CANVAS_SCHEMA_VERSION } from '@amg-webui/utils'`
  ],
  script: [
    `const emptySchema: CanvasSchema = {`,
    `  version: CANVAS_SCHEMA_VERSION,`,
    `  mode: 'free',`,
    `  nodes: []`,
    `}`,
    `const registry = createComponentRegistry([])`
  ],
  template: [
    `  <SchemaRenderer`,
    `    :schema="emptySchema"`,
    `    :registry="registry"`,
    `    render-mode="component"`,
    `  />`
  ]
})

const demoTitle = computed(() => t(LocaleKeys.exampleDoc.basicMount))
const demoDesc = computed(() => t('page.lab.lowcode.lead'))
const demoEmptyTitle = computed(() => t(LocaleKeys.component.schemaRenderer.empty))
const demoEmptyDesc = computed(() => t('page.lab.lowcode.lead'))
const emptyRegistry = createComponentRegistry([])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock :title="demoTitle" :description="demoDesc" :code="codeBasic" default-open>
      <SchemaRenderer :schema="schema" :registry="registry" render-mode="component" />
    </DemoBlock>
    <DemoBlock :title="demoEmptyTitle" :description="demoEmptyDesc" :code="codeEmpty">
      <SchemaRenderer :schema="emptySchema" :registry="emptyRegistry" render-mode="component" />
    </DemoBlock>
  </div>
</template>
