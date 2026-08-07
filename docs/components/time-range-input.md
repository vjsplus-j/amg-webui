# TimeRangeInput

TimeRangeInput：面向企业场景的 DateTime 组件（成熟度 rc）。

## 组件介绍

TimeRangeInput：面向企业场景的 DateTime 组件（成熟度 rc）。

## 核心特性

- DateTime 家族组件
- v-model 双向绑定
- 可一键清空
- 事件回调

## 何时使用 / 不适用

**适用**

- 日期/时间选择与范围输入
- 表单与筛选面板

**不适用**

- 需要非标准历法或复杂排班规则时需自定义

## 基础用法

> `import { TimeRangeInput } from 'amg-webui/form'`

```vue
<script setup>
import { TimeRangeInput } from 'amg-webui/form'
</script>

<template>
  <TimeRangeInput />
</template>
```

Curated demo：`example/demos/TimeRangeInput/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `TimeRangeValue` | `() => ({ start: null, end: null })` | 绑定值 / Bound value (v-model) |
| `id` | `string` | `undefined` | 元素 id（无障碍）/ Element id for a11y |
| `name` | `string` | `undefined` | 表单字段名 / Form field name |
| `invalid` | `boolean` | `undefined` | 是否启用 invalid |
| `showSeconds` | `boolean` | true | 是否启用 showSeconds |
| `clearable` | `boolean` | false | 可一键清空 / Show clear button |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: TimeRangeValue` | v-model 更新 / v-model update |
| `change` | `value: TimeRangeValue` | 值变更 / Change |
| `clear` | `void` | clear 时触发 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `TimeRangeValue`
- `TimeRangeInputProps`
- `TimeRangeInputEmits`

## 键盘交互

- 状态：`FAIL`
- 按键：`Tab` · `Enter` · `Escape` · `ArrowDown` · `ArrowUp` · `ArrowLeft` · `ArrowRight` · `Home` · `End` · `Space`
- keyboard PASS requires testCases[] with ≥1 PASS case including expected behavior text

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`N/A`
- optional

## RTL

- 状态：`N/A`
- optional

## SSR

- 状态：`PASS`
- structural DOM + component entry

## 当前限制

- Interactive actions no-op when disabled
- API 尚未冻结，可能随 hardening 批次调整

## 相关组件

- [Form](./form)
- [FormItem](./form-item)
- [TimePicker](./time-picker)
- [RangeInput](./range-input)

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| import | `amg-webui/form` |
| metadata | `component-metadata/TimeRangeInput.json` |
| API extract | `generated/component-api/TimeRangeInput.json` |

> 完整 Demo 见 `example/demos/TimeRangeInput`（example 本地调试，不上线）。

