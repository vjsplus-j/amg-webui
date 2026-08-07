# LineChart

LineChart：面向企业场景的 Charts 组件（成熟度 rc）。

## 组件介绍

LineChart：面向企业场景的 Charts 组件（成熟度 rc）。

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

> `import { LineChart } from 'amg-webui/charts'`

```vue
<script setup>
import { LineChart } from 'amg-webui/charts'
</script>

<template>
  <LineChart />
</template>
```

Curated demo：`example/demos/LineChart/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `undefined` | 标题 / Title |
| `description` | `string` | `undefined` | description 字符串 |
| `data` | `unknown` | `() => []` | 树形数据 / Tree data |
| `modelValue` | `unknown` | `undefined` | 绑定值 / Bound value (v-model) |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `loading` | `boolean` | false | 加载中状态 / Loading state |
| `height` | `number` | 160 | height 数值 |
| `max` | `number` | `undefined` | max 数值 |
| `showArea` | `boolean` | true | 是否启用 showArea |
| `showPoints` | `boolean` | true | 是否启用 showPoints |
| `selectable` | `boolean` | true | 是否启用 selectable |
| `emptyText` | `string` | `undefined` | emptyText 字符串 |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string` | v-model 更新 / v-model update |
| `change` | `item: LineChartItem` | 值变更 / Change |
| `select` | `item: LineChartItem, event?: MouseEvent \| KeyboardEvent` | 选中 / Select |
| `click` | `event: MouseEvent` | 点击 / Click |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `LineChartItem`
- `LineChartProps`
- `LineChartEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts LineChart non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts LineChart uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts LineChart RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts LineChart client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/LineChart.json` |
| API extract | `generated/component-api/LineChart.json` |

> 完整 Demo 见 `example/demos/LineChart`（example 本地调试，不上线）。

