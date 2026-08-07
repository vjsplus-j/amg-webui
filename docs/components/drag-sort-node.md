# DragSortNode

DragSortNode：面向企业场景的 Lowcode 组件（成熟度 rc）。

## 组件介绍

DragSortNode：面向企业场景的 Lowcode 组件（成熟度 rc）。

## 核心特性

- Lowcode 家族组件
- v-model 双向绑定
- 加载状态反馈
- 支持禁用状态
- 可一键清空
- 事件回调

## 何时使用 / 不适用

**适用**

- 低代码画布与物料拖拽
- Schema 渲染

**不适用**

- 标准后台 CRUD 无需低代码层

## 基础用法

> `import { DragSortNode } from 'amg-webui/lowcode'`

```vue
<script setup>
import { DragSortNode } from 'amg-webui/lowcode'
</script>

<template>
  <DragSortNode />
</template>
```

Curated demo：`example/demos/DragSortNode/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `CanvasNodeData[]` | `undefined` | 绑定值 / Bound value (v-model) |
| `nodes` | `CanvasNodeData[]` | `() => []` | nodes 列表数据 |
| `selectedId` | `string \| null` | `undefined` | selectedId 字符串 |
| `loading` | `boolean` | false | 加载中状态 / Loading state |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `clearable` | `boolean` | true | 可一键清空 / Show clear button |
| `title` | `string` | `undefined` | 标题 / Title |
| `emptyText` | `string` | `undefined` | emptyText 字符串 |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `nodes: CanvasNodeData[]` | v-model 更新 / v-model update |
| `update:selectedId` | `id: string \| null` | `selectedId` 更新时触发（v-model） |
| `change` | `nodes: CanvasNodeData[]` | 值变更 / Change |
| `reorder` | `nodes: CanvasNodeData[]` | reorder 时触发 |
| `move` | `node: CanvasNodeData, from: number, to: number` | move 时触发 |
| `select` | `node: CanvasNodeData` | 选中 / Select |
| `dragStart` | `node: CanvasNodeData, event: DragEvent` | dragStart 时触发 |
| `dragEnd` | `node: CanvasNodeData, event: DragEvent` | dragEnd 时触发 |
| `clear` | `void` | clear 时触发 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `DragSortNodeProps`
- `DragSortNodeEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts DragSortNode interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts DragSortNode uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts DragSortNode RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts DragSortNode client mount OK; no required browser-only top-level in package gate

## 当前限制

- Interactive actions no-op when disabled
- API 尚未冻结，可能随 hardening 批次调整

## 相关组件

— 见同包组件与 `Form` / `Select` 等表单家族。

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| import | `amg-webui/lowcode` |
| metadata | `component-metadata/DragSortNode.json` |
| API extract | `generated/component-api/DragSortNode.json` |

> 完整 Demo 见 `example/demos/DragSortNode`（example 本地调试，不上线）。

