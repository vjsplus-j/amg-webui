# Calendar

Calendar 为 **RC** 公共组件（Contract maturity=`rc`）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

Calendar 当前成熟度为 **RC**；完整交互见本地 example。

## 何时使用 / 何时不用

- **适用**：RC 阶段的标准 UI 场景（未宣称 Stable）。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

- [DatePicker](./date-picker)
- [DateTimePicker](./date-time-picker)

## 基础用法

```vue
<script setup>
import { Calendar } from '@amg-webui/data'
</script>

<template>
  <Calendar />
</template>
```

Curated demo：`example/demos/Calendar/index.vue`

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `CalendarValue` | — | 绑定值 / Bound value (v-model) |
| `valueFormat` | `"date" \| "iso"` | — | — |
| `viewDate` | `CalendarValue` | — | — |
| `min` | `CalendarValue` | — | — |
| `max` | `CalendarValue` | — | — |
| `disabledDate` | `(date: Date) => boolean` | — | — |
| `firstDayOfWeek` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | — | — |
| `showAdjacent` | `boolean` | — | — |
| `showToday` | `boolean` | — | — |
| `disabled` | `boolean` | — | 是否禁用 / Whether disabled |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: CalendarValue` | v-model 更新 / v-model update |
| `update:viewDate` | `value: Date` | — |
| `select` | `value: string \| Date` | 选中 / Select |
| `change` | `value: CalendarValue` | 值变更 / Change |
| `monthChange` | `value: Date` | — |

## Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

## Public types

- `CalendarValue`
- `CalendarProps`
- `CalendarEmits`


## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| API extract | `generated/component-api/Calendar.json` |

> 完整 Demo 见 `example/demos/Calendar`。对外 docs 为 API 导向页面；交互预览见本地 example（不上线）。
