# MergeTable

MergeTable：面向企业场景的 Table 组件（成熟度 rc）。

## 组件介绍

MergeTable：面向企业场景的 Table 组件（成熟度 rc）。

## 核心特性

- Table 家族组件
- 列配置
- v-model 双向绑定
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

> `import { MergeTable } from 'amg-webui/data'`

```vue
<script setup>
import { MergeTable } from 'amg-webui/data'
</script>

<template>
  <MergeTable />
</template>
```

Curated demo：`example/demos/MergeTable/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `undefined` | 标题 / Title |
| `description` | `string` | `undefined` | description 字符串 |
| `data` | `MergeTableRow[]` | `() => []` | 树形数据 / Tree data |
| `rows` | `MergeTableRow[]` | `() => []` | 每页行数 / Rows per page |
| `columns` | `MergeTableColumn[]` | `() => []` | 列定义 / Column definitions |
| `mergeField` | `string` | `` | mergeField 字符串 |
| `mergeFields` | `string[]` | `() => []` | mergeFields 字符串 |
| `rowKey` | `MergeTableRowKey` | `undefined` | 行唯一键字段 / Unique row key field |
| `modelValue` | `string \| number \| MergeTableRow \| null` | `null` | 绑定值 / Bound value (v-model) |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `loading` | `boolean` | false | 加载中状态 / Loading state |
| `bordered` | `boolean` | true | 是否启用 bordered |
| `striped` | `boolean` | false | 斑马纹 / Striped rows |
| `stickyHeader` | `boolean` | false | 是否启用 stickyHeader |
| `emptyText` | `string` | `undefined` | emptyText 字符串 |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string \| number \| MergeTableRow` | v-model 更新 / v-model update |
| `change` | `row: MergeTableRow, rowIndex: number` | 值变更 / Change |
| `rowClick` | `row: MergeTableRow, rowIndex: number, event: MouseEvent \| KeyboardEvent,` | rowClick 时触发 |
| `sortChange` | `field: string \| null, direction: "asc" \| "desc" \| null,` | sortChange 时触发 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `MergeTableRow`
- `MergeTableRowKey`
- `MergeTableColumn`
- `MergeTableProps`
- `MergeTableEmits`

## 键盘交互

- 状态：`FAIL`
- 按键：`Tab` · `Enter` · `Escape` · `ArrowDown` · `ArrowUp` · `ArrowLeft` · `ArrowRight` · `Home` · `End` · `Space`
- keyboard PASS requires testCases[] with ≥1 PASS case including expected behavior text

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts MergeTable uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts MergeTable RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts MergeTable client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/MergeTable.json` |
| API extract | `generated/component-api/MergeTable.json` |

> 完整 Demo 见 `example/demos/MergeTable`（example 本地调试，不上线）。

