# DataTable 数据表格

DataTable 组件 API（v0.1 子集）。

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

## 虚拟滚动（诚实口径）

- **默认开启**固定行高窗口化（`virtual: true`）。
- 视口高度由 `virtualHeight`（`--spacing-xs` 倍数）同时驱动 **CSS** 与 **虚拟数学 fallback**；挂载后以 `ResizeObserver` 实测容器高度为准。
- 行高优先：`rowHeight` prop → `--theme-table-row-height` → 首行 `ResizeObserver` 实测。
- 列：`virtualColumns`（默认列数 ≥ `virtualColumnThreshold` 自动开）提供横向窗口；`Column.fixed` 支持左右冻结；未声明 `width` 时测量表头。
- 本地排序：行数 ≥ `sortWorkerThreshold`（默认 5000）走 Worker，失败回退主线程。
- **尚未实现**：逐行动态行高、分组虚拟化、展开行虚拟化、分片 100k 内核。example `perf/massive` 提供 10k/100k DOM/FPS/内存采样，不等于“任意行高/分组场景也稳”。

## 常用 API

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `value` | `T[]` | — | — |
| `columns` | `Column<T>[]` | **必填** | 支持 `fixed` / `width` / `sortable` / `filter` |
| `rowKey` | `string` | — | Field name used as stable row identity (default `id`) |
| `selection` | `RowKey[]` | — | Selected row keys — use with v-model:selection |
| `selectionMode` | `'single' \| 'multiple'` | — | — |
| `paginator` | `boolean` | — | — |
| `rows` | `number` | — | — |
| `first` | `number` | — | — |
| `totalRecords` | `number` | — | — |
| `sortField` | `string` | — | — |
| `sortOrder` | `SortOrder` | — | — |
| `striped` | `boolean` | — | — |
| `fixedHeader` | `boolean` | `true` | 表头在纵向滚动体外 |
| `filterGlobal` | `boolean` | — | — |
| `loading` | `boolean` | — | — |
| `virtual` | `boolean` | `true` | 固定行高虚拟滚动 |
| `virtualHeight` | `number` | `80` | 视口高度 = `spacing-xs * N` |
| `rowHeight` | `number` | — | 可选固定行高（px） |
| `virtualColumns` | `boolean` | auto | 横向列窗口 |
| `virtualColumnThreshold` | `number` | `8` | 自动开启横向虚拟的列数阈值 |
| `sortWorkerThreshold` | `number` | `5000` | 本地排序切 Worker 的行数阈值 |
| `trackId` | `string` | — | — |
| `telemetry` | `boolean` | — | — |


| 事件 | 说明 |
| --- | --- |
| `update:value` | — |
| `update:selection` | — |
| `update:sortField` | — |
| `update:sortOrder` | — |
| `update:first` | — |
| `update:rows` | — |
| `sort` | — |
| `row-select` | — |
| `row-click` | — |
| `page` | — |
| `filter` | — |

> 完整 Demo 见 `example/demos/DataTable/`；海量实测见 `example/pages/perf/MassiveDataPage.vue`（仅本地调试，不上线）。
