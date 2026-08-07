# DragSortNode

DragSortNode 为 **RC** 公共组件（Contract maturity=`rc`）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

DragSortNode 当前成熟度为 **RC**；完整交互见本地 example。

## 何时使用 / 何时不用

- **适用**：RC 阶段的标准 UI 场景（未宣称 Stable）。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

— 见同包组件与 `Form` / `Select` 等表单家族。

## 基础用法

```vue
<script setup>
import { DragSortNode } from '@amg-webui/lowcode'
</script>

<template>
  <DragSortNode />
</template>
```

Curated demo：`example/demos/DragSortNode/index.vue`

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `CanvasNodeData[]` | — | 绑定值 / Bound value (v-model) |
| `nodes` | `CanvasNodeData[]` | — | — |
| `selectedId` | `string \| null` | — | — |
| `loading` | `boolean` | — | 加载中状态 / Loading state |
| `disabled` | `boolean` | — | 是否禁用 / Whether disabled |
| `clearable` | `boolean` | — | 可一键清空 / Show clear button |
| `title` | `string` | — | 标题 / Title |
| `emptyText` | `string` | — | — |
| `ariaLabel` | `string` | — | 无障碍标签 / ARIA label |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `nodes: CanvasNodeData[]` | v-model 更新 / v-model update |
| `update:selectedId` | `id: string \| null` | — |
| `change` | `nodes: CanvasNodeData[]` | 值变更 / Change |
| `reorder` | `nodes: CanvasNodeData[]` | — |
| `move` | `node: CanvasNodeData, from: number, to: number` | — |
| `select` | `node: CanvasNodeData` | 选中 / Select |
| `dragStart` | `node: CanvasNodeData, event: DragEvent` | — |
| `dragEnd` | `node: CanvasNodeData, event: DragEvent` | — |
| `clear` | `void` | — |

## Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

## Public types

- `DragSortNodeProps`
- `DragSortNodeEmits`


## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| API extract | `generated/component-api/DragSortNode.json` |

> 完整 Demo 见 `example/demos/DragSortNode`。对外 docs 为 API 导向页面；交互预览见本地 example（不上线）。
