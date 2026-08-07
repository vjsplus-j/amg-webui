# Dashboard

Dashboard：面向企业场景的 Table 组件（成熟度 rc）。

## 组件介绍

Dashboard：面向企业场景的 Table 组件（成熟度 rc）。

## 核心特性

- Table 家族组件
- 列配置
- 加载状态反馈
- 事件回调

## 何时使用 / 不适用

**适用**

- 结构化数据表格
- 排序筛选分页场景
- 异步提交或加载过程反馈

**不适用**

- 少量键值对用 Descriptions
- 无结构化列需求时避免过度使用表格

## 基础用法

> `import { Dashboard } from 'amg-webui/data'`

```vue
<script setup>
import { Dashboard } from 'amg-webui/data'
</script>

<template>
  <Dashboard />
</template>
```

Curated demo：`example/demos/Dashboard/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `stats` | `DashboardStat[]` | `() => []` | stats 列表数据 |
| `widgets` | `DashboardWidget[]` | `() => []` | Named widget slots: #widget-{id} |
| `columns` | `number` | 3 | Responsive grid column count |
| `loading` | `boolean` | false | 加载中状态 / Loading state |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `refresh` | `void` | refresh 时触发 |
| `select-stat` | `stat: DashboardStat` | select-stat 时触发 |

### Public Types

- `DashboardStat`
- `DashboardWidget`
- `DashboardProps`
- `DashboardEmits`

## 键盘交互

- 状态：`FAIL`
- 按键：`Tab` · `Enter` · `Escape` · `ArrowDown` · `ArrowUp` · `ArrowLeft` · `ArrowRight` · `Home` · `End` · `Space`
- keyboard PASS requires testCases[] with ≥1 PASS case including expected behavior text

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Dashboard uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Dashboard RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Dashboard client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Dashboard.json` |
| API extract | `generated/component-api/Dashboard.json` |

> 完整 Demo 见 `example/demos/Dashboard`（example 本地调试，不上线）。

