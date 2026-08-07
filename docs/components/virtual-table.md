# VirtualTable

VirtualTable 为 **RC** 公共组件（Contract maturity=`rc`）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

VirtualTable 当前成熟度为 **RC**；完整交互见本地 example。

## 何时使用 / 何时不用

- **适用**：RC 阶段的标准 UI 场景（未宣称 Stable）。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

— 见同包组件与 `Form` / `Select` 等表单家族。

## 基础用法

```vue
<script setup>
import { VirtualTable } from '@amg-webui/data'
</script>

<template>
  <VirtualTable />
</template>
```

Curated demo：`example/demos/VirtualTable/index.vue`

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | — | 标题 / Title |
| `description` | `string` | — | — |
| `data` | `Record<string, unknown>[]` | — | 树形数据 / Tree data |
| `rows` | `Record<string, unknown>[]` | — | 每页行数 / Rows per page |
| `columns` | `TableColumn[]` | — | 列定义 / Column definitions |
| `virtual` | `boolean` | — | 虚拟滚动 / Virtual scrolling |
| `rowKey` | `string` | — | 行唯一键字段 / Unique row key field |
| `filterDebounce` | `number` | — | 筛选防抖毫秒 / Filter debounce (ms) |
| `modelValue` | `Record<string, unknown> \| null` | — | 绑定值 / Bound value (v-model) |
| `disabled` | `boolean` | — | 是否禁用 / Whether disabled |
| `loading` | `boolean` | — | 加载中状态 / Loading state |
| `trackId` | `string` | — | Telemetry 追踪 id / Telemetry track id |
| `telemetry` | `boolean` | — | 是否上报 Telemetry / Enable telemetry |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: Record<string, unknown>` | v-model 更新 / v-model update |
| `change` | `value: Record<string, unknown>` | 值变更 / Change |
| `click` | `event: MouseEvent` | 点击 / Click |

## Slots

| Slot | Props | 说明 |
| --- | --- | --- |
| `default` | `—` | — |
| `loading` | `—` | — |
| `empty` | `—` | — |

## Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

## Public types

- `VirtualTableProps`
- `VirtualTableEmits`
- `VirtualTableSlots`


## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| API extract | `generated/component-api/VirtualTable.json` |

> 完整 Demo 见 `example/demos/VirtualTable`。对外 docs 为 API 导向页面；交互预览见本地 example（不上线）。
