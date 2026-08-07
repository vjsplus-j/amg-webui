# DataTable 数据表格

DataTable 为 **Stable** 公共组件（API frozen）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

DataTable 已通过 Component Hardening 证据门禁；完整交互演示见本地 example curated demo。

## 何时使用 / 何时不用

- **适用**：生产可用的 Stable 组件场景。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

- [Pagination](./pagination)
- [Form](./form)

## 基础用法

```vue
<script setup>
import { ref } from 'vue'
import { DataTable } from '@amg-webui/data'

const rows = ref([
  { id: 1, name: 'Alpha' },
  { id: 2, name: 'Beta' }
])
const columns = [
  { field: 'id', header: 'ID' },
  { field: 'name', header: 'Name' }
]
</script>

<template>
  <DataTable :value="rows" :columns="columns" />
</template>
```

Curated demo：`example/demos/DataTable/index.vue`

## 虚拟滚动（诚实口径）

- **默认开启**固定行高窗口化（`virtual: true`）。
- 视口高度由 `virtualHeight`（`--spacing-xs` 倍数）同时驱动 **CSS** 与 **虚拟数学 fallback**；挂载后以 `ResizeObserver` 实测容器高度为准。
- 行高优先：`rowHeight` prop → `--theme-table-row-height` → 首行 `ResizeObserver` 实测。
- 列：`virtualColumns`（默认列数 ≥ `virtualColumnThreshold` 自动开）提供横向窗口；`Column.fixed` 支持左右冻结。
- 本地排序：行数 ≥ `sortWorkerThreshold`（默认 5000）走 Worker，失败回退主线程。
- **尚未实现**：逐行动态行高、分组虚拟化、展开行虚拟化、分片 100k 内核。

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `value` | `T[]` | — | — |
| `columns` | `Column<T>[]` | **必填** | — |
| `rowKey` | `string` | — | — |
| `selection` | `RowKey[]` | — | — |
| `selectionMode` | `"single" \| "multiple"` | — | — |
| `paginator` | `boolean` | — | — |
| `rows` | `number` | — | — |
| `first` | `number` | — | — |
| `totalRecords` | `number` | — | — |
| `sortField` | `string` | — | — |
| `sortOrder` | `SortOrder` | — | — |
| `striped` | `boolean` | — | — |
| `fixedHeader` | `boolean` | — | — |
| `filterGlobal` | `boolean` | — | — |
| `loading` | `boolean` | — | — |
| `lazy` | `boolean` | — | — |
| `filterDebounce` | `number` | — | — |
| `virtual` | `boolean` | — | — |
| `virtualHeight` | `number` | — | — |
| `rowHeight` | `number` | — | — |
| `virtualColumns` | `boolean` | — | — |
| `virtualColumnThreshold` | `number` | — | — |
| `sortWorkerThreshold` | `number` | — | — |
| `trackId` | `string` | — | — |
| `telemetry` | `boolean` | — | — |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:value` | `value: T[]` | — |
| `update:selection` | `keys: RowKey[]` | — |
| `update:sortField` | `field: string` | — |
| `update:sortOrder` | `order: SortOrder` | — |
| `update:first` | `first: number` | — |
| `update:rows` | `rows: number` | — |
| `sort` | `event: { field: string; order: SortOrder }` | — |
| `row-select` | `event: { originalEvent: MouseEvent; data: T; checked: boolean },` | — |
| `row-click` | `event: { originalEvent: MouseEvent; data: T }` | — |
| `page` | `event: { first: number; rows: number; page: number; pageCount: number },` | — |
| `filter` | `event: { global: string; fields: Record<string, string> },` | — |

## Slots

| Slot | Props | 说明 |
| --- | --- | --- |
| `header` | `—` | — |
| `footer` | `—` | — |
| `empty` | `—` | — |
| `loading` | `—` | — |
| `[key: `body-${string}`]` | `props: { value: unknown; row: T }` | index signature slot |

## Expose

| Expose | 类型 | 说明 |
| --- | --- | --- |
| `scrollTo` | `(options: { rowIndex?: number; key?: RowKey }) => void` | — |

## Models

| Model | 说明 |
| --- | --- |
| `selection` | v-model:selection |

## Public types

- `SortOrder`
- `RowKey`
- `DataTableInstance`
- `Column`
- `DataTableProps`
- `DataTableEmits`
- `DataTableSlots`
- `DataTableExpose`

## 无障碍与键盘

交互行为与键盘路径以 `component-hardening/evidence/DataTable/a11y.json` · `keyboard.json` 为准；本地可复现：`example/demos/DataTable/`。

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `stable` |
| apiFreeze | `frozen` |
| API extract | `generated/component-api/DataTable.json` |

> 完整 Demo 见 `example/demos/DataTable`。对外 docs 为 API 导向页面；交互预览仅在本地 example（不上线）。
