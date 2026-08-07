# TableDrag

TableDrag：面向企业场景的 Table 组件（成熟度 rc）。

## 组件介绍

TableDrag：面向企业场景的 Table 组件（成熟度 rc）。

## 核心特性

- Table 家族组件
- v-model 双向绑定
- 列配置
- 支持禁用状态
- 加载状态反馈
- 事件回调

## 何时使用 / 不适用

**适用**

- 结构化数据表格
- 排序筛选分页场景
- 需要禁用/只读控制的表单场景
- 异步提交或加载过程反馈

**不适用**

- 少量键值对用 Descriptions
- 无结构化列需求时避免过度使用表格

## 基础用法

> `import { TableDrag } from 'amg-webui/data'`

```vue
<script setup>
import { TableDrag } from 'amg-webui/data'
</script>

<template>
  <TableDrag />
</template>
```

Curated demo：`example/demos/TableDrag/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `undefined` | 标题 / Title |
| `description` | `string` | `undefined` | description 字符串 |
| `rows` | `TableDragRow[]` | `() => []` | 每页行数 / Rows per page |
| `data` | `TableDragRow[]` | `undefined` | 树形数据 / Tree data |
| `modelValue` | `TableDragRow[]` | `undefined` | 绑定值 / Bound value (v-model) |
| `columns` | `TableDragColumn[]` | `() => []` | 列定义 / Column definitions |
| `rowKey` | `string \| ((row: TableDragRow, index: number) => TableDragKey)` | `undefined` | 行唯一键字段 / Unique row key field |
| `selectedKey` | `TableDragKey \| null` | `null` | selectedKey 配置项 |
| `rowDisabled` | `(row: TableDragRow, index: number) => boolean` | `undefined` | 是否启用 rowDisabled |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `loading` | `boolean` | false | 加载中状态 / Loading state |
| `striped` | `boolean` | true | 斑马纹 / Striped rows |
| `emptyText` | `string` | `undefined` | emptyText 字符串 |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: TableDragRow[]` | v-model 更新 / v-model update |
| `update:selectedKey` | `value: TableDragKey` | `selectedKey` 更新时触发（v-model） |
| `change` | `value: TableDragRow[]` | 值变更 / Change |
| `reorder` | `value: TableDragRow[], row: TableDragRow, from: number, to: number,` | reorder 时触发 |
| `dragStart` | `row: TableDragRow, index: number, event: DragEvent` | dragStart 时触发 |
| `dragEnd` | `row: TableDragRow, index: number, event: DragEvent` | dragEnd 时触发 |
| `rowClick` | `row: TableDragRow, index: number, event: MouseEvent` | rowClick 时触发 |
| `click` | `event: MouseEvent` | 点击 / Click |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `TableDragKey`
- `TableDragRow`
- `TableDragColumn`
- `TableDragProps`
- `TableDragEmits`

## 键盘交互

- 状态：`FAIL`
- 按键：`Tab` · `Enter` · `Escape` · `ArrowDown` · `ArrowUp` · `ArrowLeft` · `ArrowRight` · `Home` · `End` · `Space`
- keyboard PASS requires testCases[] with ≥1 PASS case including expected behavior text

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts TableDrag uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts TableDrag RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts TableDrag client mount OK; no required browser-only top-level in package gate

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
| import | `amg-webui/data` |
| metadata | `component-metadata/TableDrag.json` |
| API extract | `generated/component-api/TableDrag.json` |

> 完整 Demo 见 `example/demos/TableDrag`（example 本地调试，不上线）。

