# SchemaRenderer

按 `ComponentRegistry` 将 `CanvasSchema` / 节点列表渲染为真实 Vue 组件树（或 chrome 占位）。

详见 [LOWCODE.md](../LOWCODE.md)。

## 基础用法

```vue
<script setup lang="ts">
import { SchemaRenderer, Button } from '@amg-webui/components/base'
import { createComponentRegistry } from '@amg-webui/lowcode'

const registry = createComponentRegistry([
  { type: 'Button', label: 'Button', component: Button, defaultProps: { label: 'OK' } }
])
</script>

<template>
  <SchemaRenderer :schema="schema" :registry="registry" render-mode="component" />
</template>
```

## Props

| Prop | 类型 | 说明 |
|------|------|------|
| schema / nodes | `CanvasSchema` \| `CanvasNodeData[]` | 数据源 |
| registry | `ComponentRegistry` | `type → component` |
| renderMode | `chrome` \| `component` | 占位或真实挂载 |
| selectedId | `string \| null` | 选中态 |
| interactive | `boolean` | 是否可选中 |
