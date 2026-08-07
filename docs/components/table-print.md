# TablePrint

TablePrint：面向企业场景的 Table 组件（成熟度 rc）。

## 组件介绍

TablePrint：面向企业场景的 Table 组件（成熟度 rc）。

## 核心特性

- Table 家族组件
- 列配置
- 支持禁用状态
- 事件回调

## 何时使用 / 不适用

**适用**

- 结构化数据表格
- 排序筛选分页场景
- 需要禁用/只读控制的表单场景

**不适用**

- 少量键值对用 Descriptions
- 无结构化列需求时避免过度使用表格

## 基础用法

> `import { TablePrint } from 'amg-webui/data'`

```vue
<script setup>
import { TablePrint } from 'amg-webui/data'
</script>

<template>
  <TablePrint />
</template>
```

Curated demo：`example/demos/TablePrint/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `columns` | `{ key: string; label?: string; formatter?: ( value: unknown, row: Record<string, unknown>, index: number, ) => string; }[]` | `() => []` | 列定义 / Column definitions |
| `data` | `Record<string, unknown>[]` | `() => []` | 树形数据 / Tree data |
| `title` | `string` | `undefined` | 标题 / Title |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `bordered` | `boolean` | true | 是否启用 bordered |
| `showToolbar` | `boolean` | true | 是否启用 showToolbar |
| `emptyText` | `string` | `undefined` | emptyText 字符串 |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `print` | `void` | print 时触发 |
| `before-print` | `void` | before-print 时触发 |
| `after-print` | `void` | after-print 时触发 |
| `error` | `error: Error` | error 时触发 |

### Public Types

- `TablePrintProps`
- `TablePrintEmits`

## 键盘交互

- 状态：`FAIL`
- 按键：`Tab` · `Enter` · `Escape` · `ArrowDown` · `ArrowUp` · `ArrowLeft` · `ArrowRight` · `Home` · `End` · `Space`
- keyboard PASS requires testCases[] with ≥1 PASS case including expected behavior text

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts TablePrint uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts TablePrint RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts TablePrint client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/TablePrint.json` |
| API extract | `generated/component-api/TablePrint.json` |

> 完整 Demo 见 `example/demos/TablePrint`（example 本地调试，不上线）。

