# TimeRangeInput

TimeRangeInput 为 **RC** 公共组件（Contract maturity=`rc`）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

TimeRangeInput 当前成熟度为 **RC**；完整交互见本地 example。

## 何时使用 / 何时不用

- **适用**：RC 阶段的标准 UI 场景（未宣称 Stable）。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

- [Form](./form)
- [FormItem](./form-item)
- [TimePicker](./time-picker)
- [RangeInput](./range-input)

## 基础用法

```vue
<script setup>
import { TimeRangeInput } from '@amg-webui/form'
</script>

<template>
  <TimeRangeInput />
</template>
```

Curated demo：`example/demos/TimeRangeInput/index.vue`

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `TimeRangeValue` | — | 绑定值 / Bound value (v-model) |
| `id` | `string` | — | 元素 id（无障碍）/ Element id for a11y |
| `name` | `string` | — | 表单字段名 / Form field name |
| `invalid` | `boolean` | — | — |
| `showSeconds` | `boolean` | — | — |
| `clearable` | `boolean` | — | 可一键清空 / Show clear button |
| `ariaLabel` | `string` | — | 无障碍标签 / ARIA label |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: TimeRangeValue` | v-model 更新 / v-model update |
| `change` | `value: TimeRangeValue` | 值变更 / Change |
| `clear` | `void` | — |

## Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

## Public types

- `TimeRangeValue`
- `TimeRangeInputProps`
- `TimeRangeInputEmits`


## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| API extract | `generated/component-api/TimeRangeInput.json` |

> 完整 Demo 见 `example/demos/TimeRangeInput`。对外 docs 为 API 导向页面；交互预览见本地 example（不上线）。
