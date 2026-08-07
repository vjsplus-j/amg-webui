# PieChart

PieChart：面向企业场景的 Charts 组件（成熟度 rc）。

## 组件介绍

PieChart：面向企业场景的 Charts 组件（成熟度 rc）。

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

> `import { PieChart } from 'amg-webui/charts'`

```vue
<script setup>
import { PieChart } from 'amg-webui/charts'
</script>

<template>
  <PieChart />
</template>
```

Curated demo：`example/demos/PieChart/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `undefined` | 标题 / Title |
| `description` | `string` | `undefined` | description 字符串 |
| `data` | `PieChartDatum[] \| number[]` | `() => []` | 树形数据 / Tree data |
| `modelValue` | `PieChartKey \| null` | `null` | 绑定值 / Bound value (v-model) |
| `selectionValue` | `"key" \| "value"` | `key` | selectionValue 配置项 |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `loading` | `boolean` | false | 加载中状态 / Loading state |
| `radius` | `number` | 64 | radius 数值 |
| `innerRadius` | `number` | 0 | innerRadius 数值 |
| `startAngle` | `number` | -90 | startAngle 数值 |
| `showLegend` | `boolean` | true | 是否启用 showLegend |
| `showLabels` | `boolean` | false | 是否启用 showLabels |
| `showPercent` | `boolean` | true | 是否启用 showPercent |
| `emptyText` | `string` | `undefined` | emptyText 字符串 |
| `valueFormatter` | `(value: number, datum: PieChartDatum) => string` | `undefined` | valueFormatter 数值 |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: PieChartKey` | v-model 更新 / v-model update |
| `change` | `value: PieChartKey, datum: PieChartDatum, index: number` | 值变更 / Change |
| `click` | `event: MouseEvent \| KeyboardEvent` | 点击 / Click |
| `sliceClick` | `datum: PieChartDatum, index: number, event: MouseEvent \| KeyboardEvent,` | sliceClick 时触发 |
| `legendClick` | `datum: PieChartDatum, index: number, event: MouseEvent \| KeyboardEvent,` | legendClick 时触发 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `PieChartKey`
- `PieChartDatum`
- `PieChartProps`
- `PieChartEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts PieChart non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts PieChart uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts PieChart RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts PieChart client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/PieChart.json` |
| API extract | `generated/component-api/PieChart.json` |

> 完整 Demo 见 `example/demos/PieChart`（example 本地调试，不上线）。

