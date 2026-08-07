# Tree

Tree 为 **RC** 公共组件（Contract maturity=`rc`）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

Tree 当前成熟度为 **RC**；下方 DocsDemo 提供 docs 站内嵌交互，完整场景见 example。

## 何时使用 / 何时不用

- **适用**：RC 阶段的标准 UI 场景（未宣称 Stable）。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

— 见同包组件与 `Form` / `Select` 等表单家族。

## 基础用法

```vue
<script setup>
import { Tree } from '@amg-webui/data'
</script>

<template>
  <Tree />
</template>
```

Curated demo：`example/demos/Tree/index.vue`

## 交互演示

<DocsDemo name="tree-basic" />

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `virtual` | `boolean` | — | 虚拟滚动 / Virtual scrolling |
| `virtualThreshold` | `number` | — | — |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: unknown` | v-model 更新 / v-model update |
| `change` | `value: unknown` | 值变更 / Change |
| `node-click` | `node: TreeNode` | — |
| `check-change` | `node: TreeNode, checked: boolean, indeterminate: boolean,` | — |
| `node-expand` | `node: TreeNode` | — |
| `node-collapse` | `node: TreeNode` | — |

## Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

## Public types

- `BaseTreeProps`
- `TreeProps`
- `TreeEmits`
- `VirtualTreeProps`
- `VirtualTreeEmits`
- `LazyTreeProps`
- `LazyTreeEmits`


## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| API extract | `generated/component-api/Tree.json` |

> 上方 **DocsDemo** 为 docs 站内嵌交互演示。完整 curated demo 见 `example/demos/Tree`。
