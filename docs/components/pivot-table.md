# PivotTable

PivotTable：面向企业场景的 Table 组件（成熟度 rc）。

## 组件介绍

PivotTable：面向企业场景的 Table 组件（成熟度 rc）。

## 核心特性

- Table 家族组件
- v-model 双向绑定
- 加载状态反馈
- 支持禁用状态
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

> `import { PivotTable } from 'amg-webui/data'`

```vue
<script setup>
import { PivotTable } from 'amg-webui/data'
</script>

<template>
  <PivotTable />
</template>
```

Curated demo：`example/demos/PivotTable/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `undefined` | 标题 / Title |
| `description` | `string` | `undefined` | description 字符串 |
| `data` | `PivotRecord[]` | `() => []` | 树形数据 / Tree data |
| `rows` | `PivotRecord[]` | `() => []` | 每页行数 / Rows per page |
| `rowField` | `string` | `undefined` | rowField 字符串 |
| `columnField` | `string` | `undefined` | columnField 字符串 |
| `colField` | `string` | `undefined` | Backward-compatible alias for columnField. |
| `valueField` | `string` | `undefined` | valueField 字符串 |
| `valueFormatter` | `(value: number, cell?: PivotCell) => string` | `undefined` | valueFormatter 数值 |
| `modelValue` | `string \| null` | `null` | 绑定值 / Bound value (v-model) |
| `rowLabel` | `string` | `undefined` | rowLabel 字符串 |
| `showRowTotals` | `boolean` | true | 是否启用 showRowTotals |
| `showColumnTotals` | `boolean` | true | 是否启用 showColumnTotals |
| `stickyHeader` | `boolean` | true | 是否启用 stickyHeader |
| `loading` | `boolean` | false | 加载中状态 / Loading state |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string \| null` | v-model 更新 / v-model update |
| `change` | `value: string \| null` | 值变更 / Change |
| `cellClick` | `cell: PivotCell, event: MouseEvent` | cellClick 时触发 |
| `rowClick` | `rowKey: string, event: MouseEvent` | rowClick 时触发 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `PivotRecord`
- `PivotAggregator`
- `PivotCell`
- `PivotTableProps`
- `PivotTableEmits`

## 键盘交互

- 状态：`FAIL`
- 按键：`Tab` · `Enter` · `Escape` · `ArrowDown` · `ArrowUp` · `ArrowLeft` · `ArrowRight` · `Home` · `End` · `Space`
- keyboard PASS requires testCases[] with ≥1 PASS case including expected behavior text

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts PivotTable uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts PivotTable RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts PivotTable client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/PivotTable.json` |
| API extract | `generated/component-api/PivotTable.json` |

> 完整 Demo 见 `example/demos/PivotTable`（example 本地调试，不上线）。

