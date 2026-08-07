# Statistic

Statistic：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

Statistic：面向企业场景的 Foundation 组件（成熟度 rc）。

## 核心特性

- Foundation 家族组件
- 事件回调

## 何时使用 / 不适用

**适用**

- 基础 UI 交互与页面操作
- 按钮、标签、图标等原子组件

**不适用**

- 需要复杂业务编排时优先业务组件或组合模式

## 基础用法

> `import { Statistic } from 'amg-webui/core'`

```vue
<script setup>
import { Statistic } from 'amg-webui/core'
</script>

<template>
  <Statistic />
</template>
```

Curated demo：`example/demos/Statistic/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `undefined` | 标题 / Title |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |
| `value` | `number \| string` | **必填** | 表格行数据或绑定值 / Row data or bound value |
| `precision` | `number` | `undefined` | precision 数值 |
| `prefix` | `string` | `undefined` | prefix 字符串 |
| `suffix` | `string` | `undefined` | suffix 字符串 |
| `groupSeparator` | `string` | `,` | groupSeparator 字符串 |
| `decimalSeparator` | `string` | `.` | decimalSeparator 字符串 |
| `trend` | `StatisticTrend` | `none` | trend 配置项 |
| `animate` | `boolean` | false | 是否启用 animate |
| `duration` | `number` | 1000 | duration 数值 |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `finish` | `value: number \| string` | Count-up animation finished (or skipped when animate=false) |

### Public Types

- `StatisticTrend`
- `StatisticProps`
- `StatisticEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Statistic non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Statistic uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Statistic RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Statistic client mount OK; no required browser-only top-level in package gate

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
| import | `amg-webui/core` |
| metadata | `component-metadata/Statistic.json` |
| API extract | `generated/component-api/Statistic.json` |

> 完整 Demo 见 `example/demos/Statistic`（example 本地调试，不上线）。

