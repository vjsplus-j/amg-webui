# BatchPanel

BatchPanel：面向企业场景的 Table 组件（成熟度 rc）。

## 组件介绍

BatchPanel：面向企业场景的 Table 组件（成熟度 rc）。

## 核心特性

- Table 家族组件
- 事件回调

## 何时使用 / 不适用

**适用**

- 结构化数据表格
- 排序筛选分页场景

**不适用**

- 少量键值对用 Descriptions
- 无结构化列需求时避免过度使用表格

## 基础用法

> `import { BatchPanel } from 'amg-webui/data'`

```vue
<script setup>
import { BatchPanel } from 'amg-webui/data'
</script>

<template>
  <BatchPanel />
</template>
```

Curated demo：`example/demos/BatchPanel/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `selectedCount` | `number` | 0 | selectedCount 数值 |
| `totalCount` | `number` | 0 | totalCount 数值 |
| `showEmpty` | `boolean` | false | When true, show empty hint instead of hiding the panel |
| `actions` | `BatchPanelAction[]` | `undefined` | Custom action buttons; falls back to built-in edit/delete/export/clear |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `action` | `action: string` | action 时触发 |
| `clear` | `void` | clear 时触发 |

### Public Types

- `BatchPanelAction`
- `BatchPanelProps`
- `BatchPanelEmits`

## 键盘交互

- 状态：`FAIL`
- 按键：`Tab` · `Enter` · `Escape` · `ArrowDown` · `ArrowUp` · `ArrowLeft` · `ArrowRight` · `Home` · `End` · `Space`
- keyboard PASS requires testCases[] with ≥1 PASS case including expected behavior text

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts BatchPanel uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts BatchPanel RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts BatchPanel client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/BatchPanel.json` |
| API extract | `generated/component-api/BatchPanel.json` |

> 完整 Demo 见 `example/demos/BatchPanel`（example 本地调试，不上线）。

