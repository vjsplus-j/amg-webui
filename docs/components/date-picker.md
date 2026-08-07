# DatePicker 日期选择

DatePicker 为 **RC** 公共组件（Contract maturity=`rc`）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

DatePicker 当前成熟度为 **RC**；下方 DocsDemo 提供 docs 站内嵌交互，完整场景见 example。

## 何时使用 / 何时不用

- **适用**：RC 阶段的标准 UI 场景（未宣称 Stable）。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

- [Form](./form)
- [FormItem](./form-item)
- [DateTimePicker](./date-time-picker)
- [TimePicker](./time-picker)
- [Calendar](./calendar)

## 基础用法

```vue
<script setup>
import { DatePicker } from '@amg-webui/form'
</script>

<template>
  <DatePicker />
</template>
```

Curated demo：`example/demos/DatePicker/index.vue`

## 交互演示

<DocsDemo name="date-picker-basic" />

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | — | 元素 id（无障碍）/ Element id for a11y |
| `name` | `string` | — | 表单字段名 / Form field name |
| `modelValue` | `string \| Date \| null` | — | 绑定值 / Bound value (v-model) |
| `placeholder` | `string` | — | 占位提示 / Placeholder text |
| `valueFormat` | `'date' \| 'iso'` | — | — |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string \| Date \| null` | v-model 更新 / v-model update |
| `change` | `value: string \| Date \| null` | 值变更 / Change |

## Slots

| Slot | Props | 说明 |
| --- | --- | --- |
| `default` | `props: Record<string, never>` | — |

## Expose

| Expose | 类型 | 说明 |
| --- | --- | --- |
| `focus` | `() => void` | — |
| `blur` | `() => void` | — |
| `open` | `() => void` | — |
| `close` | `() => void` | — |

## Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

## Public types

- `DatePickerInstance`
- `DatePickerProps`
- `DatePickerEmits`
- `DatePickerSlots`
- `DatePickerExpose`


## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| API extract | `generated/component-api/DatePicker.json` |

> 上方 **DocsDemo** 为 docs 站内嵌交互演示。完整 curated demo 见 `example/demos/DatePicker`。
