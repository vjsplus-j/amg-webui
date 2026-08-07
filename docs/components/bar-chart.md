# BarChart

BarChart 为 **RC** 公共组件（Contract maturity=`rc`）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

BarChart 当前成熟度为 **RC**；完整交互见本地 example。

## 何时使用 / 何时不用

- **适用**：RC 阶段的标准 UI 场景（未宣称 Stable）。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

— 见同包组件与 `Form` / `Select` 等表单家族。

## 基础用法

```vue
<script setup>
import { BarChart } from '@amg-webui/charts'
</script>

<template>
  <BarChart />
</template>
```

Curated demo：`example/demos/BarChart/index.vue`

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | — | 标题 / Title |
| `description` | `string` | — | — |
| `data` | `unknown` | — | 树形数据 / Tree data |
| `modelValue` | `string \| number \| null` | — | 绑定值 / Bound value (v-model) |
| `disabled` | `boolean` | — | 是否禁用 / Whether disabled |
| `loading` | `boolean` | — | 加载中状态 / Loading state |
| `max` | `number` | — | — |
| `height` | `number` | — | — |
| `showValues` | `boolean` | — | — |
| `selectable` | `boolean` | — | — |
| `emptyText` | `string` | — | — |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string \| number` | v-model 更新 / v-model update |
| `change` | `value: { label: string; value: number; index: number }` | 值变更 / Change |
| `click` | `event: MouseEvent` | 点击 / Click |

## Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

## Public types

- `BarChartProps`
- `BarChartEmits`


## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| API extract | `generated/component-api/BarChart.json` |

> 完整 Demo 见 `example/demos/BarChart`。对外 docs 为 API 导向页面；交互预览见本地 example（不上线）。
