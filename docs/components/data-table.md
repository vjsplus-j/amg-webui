# DataTable 数据表格

DataTable 组件 API（v0.1 子集）。

## 基础用法

```vue
<script setup>
import { ref } from 'vue'
import { DataTable } from '@amg-webui/components/base'

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

## 常用 API

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `value` | `T[]` | — | — |
| `columns` | `Column<T>[]` | **必填** | — |
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
| `fixedHeader` | `boolean` | — | — |
| `filterGlobal` | `boolean` | — | — |
| `loading` | `boolean` | — | — |
| `virtual` | `boolean` | — | — |
| `virtualHeight` | `number` | — | Viewport height as spacing-xs multiples |
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

> 完整 Demo 见 `example/demos/DataTable/`。本阶段对外 docs 为薄 API stub；交互预览仅在本地 example（不上线）。
