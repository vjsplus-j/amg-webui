# RangeInput

RangeInput：面向企业场景的 Input 组件（成熟度 rc）。

## 组件介绍

RangeInput：面向企业场景的 Input 组件（成熟度 rc）。

## 核心特性

- Input 家族组件
- v-model 双向绑定
- 事件回调

## 何时使用 / 不适用

**适用**

- 表单文本/数值输入
- 受控与非受控输入场景

**不适用**

- 极复杂富文本编辑请使用 RichText / MdEditor

## 基础用法

> `import { RangeInput } from 'amg-webui/form'`

```vue
<script setup>
import { RangeInput } from 'amg-webui/form'
</script>

<template>
  <RangeInput />
</template>
```

Curated demo：`example/demos/RangeInput/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `RangeValue` | `() => ({ min: null, max: null })` | 绑定值 / Bound value (v-model) |
| `id` | `string` | `undefined` | 元素 id（无障碍）/ Element id for a11y |
| `precision` | `number` | 0 | precision 数值 |
| `step` | `number` | 1 | step 数值 |
| `min` | `number` | `undefined` | min 数值 |
| `max` | `number` | `undefined` | max 数值 |
| `allowCross` | `boolean` | false | 是否启用 allowCross |
| `invalid` | `boolean` | `undefined` | 是否启用 invalid |
| `startPlaceholder` | `string` | `undefined` | startPlaceholder 字符串 |
| `endPlaceholder` | `string` | `undefined` | endPlaceholder 字符串 |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: RangeValue` | v-model 更新 / v-model update |
| `change` | `value: RangeValue` | 值变更 / Change |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `RangeValue`
- `RangeInputProps`
- `RangeInputEmits`

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
- structural DOM clean

## 当前限制

- Interactive actions no-op when disabled
- API 尚未冻结，可能随 hardening 批次调整

## 相关组件

- [Form](./form)
- [FormItem](./form-item)
- [InputNumber](./input-number)

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| import | `amg-webui/form` |
| metadata | `component-metadata/RangeInput.json` |
| API extract | `generated/component-api/RangeInput.json` |

> 完整 Demo 见 `example/demos/RangeInput`（example 本地调试，不上线）。

