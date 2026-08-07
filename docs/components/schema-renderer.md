# SchemaRenderer

按 `ComponentRegistry` 将 `CanvasSchema` / 节点列表渲染为真实 Vue 组件树（或 chrome 占位）。

详见 [LOWCODE.md](../LOWCODE.md)。

## 基础用法

```vue
<script setup lang="ts">
import { SchemaRenderer } from '@amg-webui/lowcode'
import { Button } from '@amg-webui/core'
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
| context | `Record<string, unknown>` | `__bindings` 路径上下文（建议 reactive） |
| handlers | `Record<string, Function>` | `__events` / 声明 events 的命名处理器 |

内部通过 **`SchemaNodeRenderer`** 递归挂载任意深度 `parentId` 子树；Binding / Event 与 `generateVueSfc` 同键同语义（路径白名单，无 eval）。

## Emits

| Event | 说明 |
|-------|------|
| select | 选中节点 id |
| nodeActivate | 节点激活 |
| nodeEvent | 运行时事件旁路（`{ nodeId, event, handler, args }`） |
