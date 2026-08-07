# TableDrag

TableDrag 为 **RC** 公共组件（Contract maturity=`rc`）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

TableDrag 当前成熟度为 **RC**；完整交互见本地 example。

## 何时使用 / 何时不用

- **适用**：RC 阶段的标准 UI 场景（未宣称 Stable）。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

— 见同包组件与 `Form` / `Select` 等表单家族。

## 基础用法

```vue
<script setup>
import { TableDrag } from '@amg-webui/data'
</script>

<template>
  <TableDrag />
</template>
```

Curated demo：`example/demos/TableDrag/index.vue`

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | — | 标题 / Title |
| `description` | `string` | — | — |
| `rows` | `TableDragRow[]` | — | 每页行数 / Rows per page |
| `data` | `TableDragRow[]` | — | 树形数据 / Tree data |
| `modelValue` | `TableDragRow[]` | — | 绑定值 / Bound value (v-model) |
| `columns` | `TableDragColumn[]` | — | 列定义 / Column definitions |
| `rowKey` | `string \| ((row: TableDragRow, index: number) => TableDragKey)` | — | 行唯一键字段 / Unique row key field |
| `selectedKey` | `TableDragKey \| null` | — | — |
| `rowDisabled` | `(row: TableDragRow, index: number) => boolean` | — | — |
| `disabled` | `boolean` | — | 是否禁用 / Whether disabled |
| `loading` | `boolean` | — | 加载中状态 / Loading state |
| `striped` | `boolean` | — | 斑马纹 / Striped rows |
| `emptyText` | `string` | — | — |
| `ariaLabel` | `string` | — | 无障碍标签 / ARIA label |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: TableDragRow[]` | v-model 更新 / v-model update |
| `update:selectedKey` | `value: TableDragKey` | — |
| `change` | `value: TableDragRow[]` | 值变更 / Change |
| `reorder` | `value: TableDragRow[], row: TableDragRow, from: number, to: number,` | — |
| `dragStart` | `row: TableDragRow, index: number, event: DragEvent` | — |
| `dragEnd` | `row: TableDragRow, index: number, event: DragEvent` | — |
| `rowClick` | `row: TableDragRow, index: number, event: MouseEvent` | — |
| `click` | `event: MouseEvent` | 点击 / Click |

## Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

## Public types

- `TableDragKey`
- `TableDragRow`
- `TableDragColumn`
- `TableDragProps`
- `TableDragEmits`


## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| API extract | `generated/component-api/TableDrag.json` |

> 完整 Demo 见 `example/demos/TableDrag`。对外 docs 为 API 导向页面；交互预览见本地 example（不上线）。
