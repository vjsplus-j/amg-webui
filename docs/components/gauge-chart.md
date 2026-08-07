# GaugeChart

GaugeChart：面向企业场景的 Charts 组件（成熟度 rc）。

## 组件介绍

GaugeChart：面向企业场景的 Charts 组件（成熟度 rc）。

## 核心特性

- Charts 家族组件
- v-model 双向绑定
- 支持禁用状态
- 加载状态反馈
- 事件回调

## 何时使用 / 不适用

**适用**

- 统计图表可视化
- 仪表盘指标展示

**不适用**

- 极简单数值用 Statistic

## 基础用法

> `import { GaugeChart } from 'amg-webui/charts'`

```vue
<script setup>
import { GaugeChart } from 'amg-webui/charts'
</script>

<template>
  <GaugeChart />
</template>
```

Curated demo：`example/demos/GaugeChart/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `undefined` | 标题 / Title |
| `description` | `string` | `undefined` | description 字符串 |
| `data` | `unknown` | `() => 72` | 树形数据 / Tree data |
| `modelValue` | `number \| null` | `undefined` | 绑定值 / Bound value (v-model) |
| `disabled` | `boolean` | `undefined` | 是否禁用 / Whether disabled |
| `loading` | `boolean` | `undefined` | 加载中状态 / Loading state |
| `min` | `number` | 0 | min 数值 |
| `max` | `number` | 100 | max 数值 |
| `unit` | `string` | `undefined` | unit 字符串 |
| `showValue` | `boolean` | true | 是否启用 showValue |
| `thresholds` | `{ value: number; color: string }[]` | `() => []` | thresholds 数值 |
| `emptyText` | `string` | `undefined` | emptyText 字符串 |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: number` | v-model 更新 / v-model update |
| `change` | `value: number` | 值变更 / Change |
| `click` | `event: MouseEvent` | 点击 / Click |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `GaugeChartProps`
- `GaugeChartEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts GaugeChart interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts GaugeChart uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts GaugeChart RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts GaugeChart client mount OK; no required browser-only top-level in package gate

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
| import | `amg-webui/charts` |
| metadata | `component-metadata/GaugeChart.json` |
| API extract | `generated/component-api/GaugeChart.json` |

> 完整 Demo 见 `example/demos/GaugeChart`（example 本地调试，不上线）。

