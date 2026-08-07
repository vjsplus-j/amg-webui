# DataTable 数据表格

DataTable 为 **Stable** 公共组件（API frozen）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

DataTable 已通过 Component Hardening 证据门禁；下方 **DocsDemo** 提供 docs 站内嵌交互，完整 curated demo 见 example。

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

## 交互演示

<DocsDemo name="data-table-basic" />

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
| `value` | `T[]` | — | 行数据源 / Row data source |
| `columns` | `Column<T>[]` | **必填** | 列配置数组 / Column config array |
| `rowKey` | `string` | — | 行唯一键字段 / Unique row key field |
| `selection` | `RowKey[]` | — | 选中行 keys / Selected row keys |
| `selectionMode` | `"single" \| "multiple"` | — | 选择模式：`single` · `multiple` / Selection mode |
| `paginator` | `boolean` | — | 是否显示分页 / Show paginator |
| `rows` | `number` | — | 每页行数 / Rows per page |
| `first` | `number` | — | 分页起始索引 / Pagination offset |
| `totalRecords` | `number` | — | 总记录数（远程分页）/ Total records |
| `sortField` | `string` | — | 排序字段 / Sort field |
| `sortOrder` | `SortOrder` | — | 排序方向 / Sort order |
| `striped` | `boolean` | — | 斑马纹 / Striped rows |
| `fixedHeader` | `boolean` | — | 固定表头 / Fixed header |
| `filterGlobal` | `boolean` | — | 全局筛选 / Global filter |
| `loading` | `boolean` | — | 加载中状态 / Loading state |
| `lazy` | `boolean` | — | 远程数据模式 / Lazy remote data |
| `filterDebounce` | `number` | — | 筛选防抖毫秒 / Filter debounce (ms) |
| `virtual` | `boolean` | — | 虚拟滚动 / Virtual scrolling |
| `virtualHeight` | `number` | — | 虚拟视口高度（spacing 倍数）/ Virtual viewport height |
| `rowHeight` | `number` | — | 行高（px）/ Row height |
| `virtualColumns` | `boolean` | — | 横向虚拟列 / Virtual columns |
| `virtualColumnThreshold` | `number` | — | 自动开启虚拟列的列数阈值 / Column threshold |
| `sortWorkerThreshold` | `number` | — | Worker 排序行数阈值 / Worker sort threshold |
| `trackId` | `string` | — | Telemetry 追踪 id / Telemetry track id |
| `telemetry` | `boolean` | — | 是否上报 Telemetry / Enable telemetry |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:value` | `value: T[]` | value 更新 / value update |
| `update:selection` | `keys: RowKey[]` | 选中行更新 / selection update |
| `update:sortField` | `field: string` | 排序字段更新 / sortField update |
| `update:sortOrder` | `order: SortOrder` | 排序方向更新 / sortOrder update |
| `update:first` | `first: number` | 分页偏移更新 / first update |
| `update:rows` | `rows: number` | 每页行数更新 / rows update |
| `sort` | `event: { field: string; order: SortOrder }` | 排序 / Sort |
| `row-select` | `event: { originalEvent: DataTableRowInteractionEvent; data: T; checked: boolean }` | 行选择 / Row select |
| `row-click` | `event: { originalEvent: DataTableRowInteractionEvent; data: T }` | 行点击 / Row click |
| `page` | `event: { first: number; rows: number; page: number; pageCount: number },` | 翻页 / Page change |
| `filter` | `event: { global: string; fields: Record<string, string> },` | 筛选 / Filter |

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

> 上方 **DocsDemo** 为 docs 站内嵌交互演示。完整 curated demo 见 `example/demos/DataTable`。
