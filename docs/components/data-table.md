# DataTable 数据表格

DataTable 数据表格：面向企业场景的 Table 组件（成熟度 rc）。

## 组件介绍

DataTable 数据表格：面向企业场景的 Table 组件（成熟度 rc）。

## 核心特性

- Table 家族组件
- 列配置
- 加载状态反馈
- 远程/懒加载数据
- 虚拟滚动
- 事件回调
- 插槽自定义
- 实例方法暴露
- v-model 双向绑定

## 何时使用 / 不适用

**适用**

- 结构化数据表格
- 排序筛选分页场景
- 异步提交或加载过程反馈
- 大数据量列表/表格性能场景

**不适用**

- 少量键值对用 Descriptions
- 无结构化列需求时避免过度使用表格

## 基础用法

> `import { DataTable } from 'amg-webui/data'`

```vue
<script setup>
import { ref } from 'vue'
import { DataTable } from 'amg-webui/data'

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

## 示例

<DocsDemo name="data-table-basic" />

## 虚拟滚动（诚实口径）

- **默认开启**固定行高窗口化（`virtual: true`）。
- 视口高度由 `virtualHeight`（`--spacing-xs` 倍数）同时驱动 **CSS** 与 **虚拟数学 fallback**；挂载后以 `ResizeObserver` 实测容器高度为准。
- 行高优先：`rowHeight` prop → `--theme-table-row-height` → 首行 `ResizeObserver` 实测。
- 列：`virtualColumns`（默认列数 ≥ `virtualColumnThreshold` 自动开）提供横向窗口；`Column.fixed` 支持左右冻结。
- 本地排序：行数 ≥ `sortWorkerThreshold`（默认 5000）走 Worker，失败回退主线程。
- **尚未实现**：逐行动态行高、分组虚拟化、展开行虚拟化、分片 100k 内核。

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `value` | `T[]` | `() => []` | 行数据源 / Row data source |
| `columns` | `Column<T>[]` | `() => []` | 列配置数组 / Column config array |
| `rowKey` | `string` | `id` | Field name used as stable row identity (default `id`). Required when selection or virtual scroll is enabled. |
| `selection` | `RowKey[]` | `() => []` | Selected row keys — use with v-model:selection |
| `selectionMode` | `"single" \| "multiple"` | `undefined` | 选择模式：`single` · `multiple` / Selection mode |
| `paginator` | `boolean` | `undefined` | 是否显示分页 / Show paginator |
| `rows` | `number` | 10 | 每页行数 / Rows per page |
| `first` | `number` | 0 | 分页起始索引 / Pagination offset |
| `totalRecords` | `number` | 0 | 总记录数（远程分页）/ Total records |
| `sortField` | `string` | `undefined` | 排序字段 / Sort field |
| `sortOrder` | `SortOrder` | `undefined` | 排序方向 / Sort order |
| `striped` | `boolean` | false | 斑马纹 / Striped rows |
| `fixedHeader` | `boolean` | true | 固定表头 / Fixed header |
| `filterGlobal` | `boolean` | false | 全局筛选 / Global filter |
| `loading` | `boolean` | `undefined` | 加载中状态 / Loading state |
| `lazy` | `boolean` | false | Delegate sorting, filtering and pagination to the consumer. |
| `filterDebounce` | `number` | 200 | Delay local filtering and lazy filter events. |
| `virtual` | `boolean` | true | Virtual scroll for the current display set. Default ON. Works with paginator (virtualizes the current page). Set false to render full DOM for the page/list. |
| `virtualHeight` | `number` | 80 | Viewport height as spacing-xs multiples (synced into virtual math + CSS). |
| `rowHeight` | `number` | `undefined` | Optional fixed row height in CSS px. When omitted, uses `--theme-table-row-height` then refines via ResizeObserver on the first rendered row. |
| `virtualColumns` | `boolean` | `undefined` | Horizontal column windowing. Default: auto-enable when column count ≥ `virtualColumnThreshold`. |
| `virtualColumnThreshold` | `number` | 8 | Column count that triggers auto horizontal virtualization (default 8). |
| `sortWorkerThreshold` | `number` | `SORT_WORKER_THRESHOLD` | Local sort switches to Worker above this row count (default 5000). |
| `trackId` | `string` | `undefined` | Telemetry 追踪 id / Telemetry track id |
| `telemetry` | `boolean` | `undefined` | 是否上报 Telemetry / Enable telemetry |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:value` | `value: T[]` | value 更新 / value update |
| `update:selection` | `keys: RowKey[]` | 选中行更新 / selection update |
| `update:sortField` | `field: string` | 排序字段更新 / sortField update |
| `update:sortOrder` | `order: SortOrder` | 排序方向更新 / sortOrder update |
| `update:first` | `first: number` | 分页偏移更新 / first update |
| `update:rows` | `rows: number` | 每页行数更新 / rows update |
| `sort` | `event: { field: string; order: SortOrder }` | 排序 / Sort |
| `row-select` | `event: DataTableRowSelectEvent<T>` | 行选择 / Row select |
| `row-click` | `event: DataTableRowClickEvent<T>` | 行点击 / Row click |
| `page` | `event: { first: number; rows: number; page: number; pageCount: number },` | 翻页 / Page change |
| `filter` | `event: { global: string; fields: Record<string, string> },` | 筛选 / Filter |

### Slots

| Slot | Props | 说明 |
| --- | --- | --- |
| `header` | `—` | header 插槽 |
| `footer` | `—` | footer 插槽 |
| `empty` | `—` | empty 插槽 |
| `loading` | `—` | loading 插槽 |
| `[key: `body-${string}`]` | `props: { value: unknown; row: T }` | index signature slot |

### Expose

| 方法 / 属性 | 类型 | 说明 |
| --- | --- | --- |
| `scrollTo` | `(options: { rowIndex?: number; key?: RowKey }) => void` | Scroll the virtual viewport to a row index or stable row key |

### Models

| Model | 说明 |
| --- | --- |
| `selection` | v-model:selection |

### Public Types

- `SortOrder`
- `RowKey`
- `DataTableRowInteractionEvent`
- `DataTableInstance`
- `DataTableRowSelectEvent`
- `DataTableRowClickEvent`
- `Column`
- `DataTableProps`
- `DataTableEmits`
- `DataTableSlots`
- `DataTableExpose`

## 键盘交互

- 状态：`PASS`
- 按键：`ArrowDown` · `Enter` · `Escape`
- ArrowDown: ArrowDown/ArrowUp/Home/End move grid row focus; Enter: Enter selects focused row and emits update:selection; Escape: Escape clears row focus without additional selection

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`N/A`
- optional

## RTL

- 状态：`N/A`
- optional

## SSR

- 状态：`PASS`
- structural top-level DOM clean

## 当前限制

- Interactive actions no-op when disabled
- API 尚未冻结，可能随 hardening 批次调整

## 相关组件

- [Pagination](./pagination)
- [Form](./form)

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| import | `amg-webui/data` |
| metadata | `component-metadata/DataTable.json` |
| API extract | `generated/component-api/DataTable.json` |

> **DocsDemo** 为 docs 站内嵌演示；完整 curated demo 见 `example/demos/DataTable`。

