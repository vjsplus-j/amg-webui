# Transfer

Transfer 为 **RC** 公共组件（Contract maturity=`rc`）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

Transfer 当前成熟度为 **RC**；完整交互见本地 example。

## 何时使用 / 何时不用

- **适用**：RC 阶段的标准 UI 场景（未宣称 Stable）。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

— 见同包组件与 `Form` / `Select` 等表单家族。

## 基础用法

```vue
<script setup>
import { Transfer } from '@amg-webui/form'
</script>

<template>
  <Transfer />
</template>
```

Curated demo：`example/demos/Transfer/index.vue`

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | — | 元素 id（无障碍）/ Element id for a11y |
| `name` | `string` | — | 表单字段名 / Form field name |
| `data` | `TransferItem[]` | — | 树形数据 / Tree data |
| `modelValue` | `(string \| number)[]` | — | 绑定值 / Bound value (v-model) |
| `filterable` | `boolean` | — | — |
| `leftTitle` | `string` | — | — |
| `rightTitle` | `string` | — | — |
| `filterPlaceholder` | `string` | — | — |
| `emptyText` | `string` | — | — |
| `filterDebounce` | `number` | — | 筛选防抖毫秒 / Filter debounce (ms) |
| `filterMethod` | `( query: string, item: TransferItem, direction: "left" \| "right", ) => boolean` | — | — |
| `virtual` | `boolean` | — | 虚拟滚动 / Virtual scrolling |
| `loading` | `boolean` | — | 加载中状态 / Loading state |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `filter-change` | `payload: { direction: "left" \| "right"; query: string },` | — |
| `reach-end` | `direction: "left" \| "right"` | — |

## Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

## Public types

- `TransferItem`
- `TransferProps`
- `TransferEmits`


## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| API extract | `generated/component-api/Transfer.json` |

> 完整 Demo 见 `example/demos/Transfer`。对外 docs 为 API 导向页面；交互预览见本地 example（不上线）。
