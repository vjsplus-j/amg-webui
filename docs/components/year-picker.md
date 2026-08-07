# YearPicker

YearPicker：面向企业场景的 DateTime 组件（成熟度 rc）。

## 组件介绍

YearPicker：面向企业场景的 DateTime 组件（成熟度 rc）。

## 核心特性

- DateTime 家族组件
- v-model 双向绑定
- 占位提示
- 可一键清空
- 只读模式
- 事件回调

## 何时使用 / 不适用

**适用**

- 日期/时间选择与范围输入
- 表单与筛选面板

**不适用**

- 需要非标准历法或复杂排班规则时需自定义

## 基础用法

> `import { YearPicker } from 'amg-webui/form'`

```vue
<script setup>
import { YearPicker } from 'amg-webui/form'
</script>

<template>
  <YearPicker />
</template>
```

Curated demo：`example/demos/YearPicker/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| Date \| number \| null` | `null` | 绑定值 / Bound value (v-model) |
| `id` | `string` | `undefined` | 元素 id（无障碍）/ Element id for a11y |
| `invalid` | `boolean` | `undefined` | 是否启用 invalid |
| `placeholder` | `string` | `undefined` | 占位提示 / Placeholder text |
| `valueFormat` | `"number" \| "date" \| "iso"` | `number` | valueFormat 数值 |
| `yearRange` | `number` | 12 | yearRange 数值 |
| `min` | `string \| Date \| number` | `undefined` | min 数值 |
| `max` | `string \| Date \| number` | `undefined` | max 数值 |
| `clearable` | `boolean` | false | 可一键清空 / Show clear button |
| `readonly` | `boolean` | false | 是否只读 / Read-only |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string \| Date \| number \| null` | v-model 更新 / v-model update |
| `change` | `value: string \| Date \| number \| null` | 值变更 / Change |
| `clear` | `void` | clear 时触发 |
| `openChange` | `open: boolean` | openChange 时触发 |
| `focus` | `event: FocusEvent` | 聚焦 / Focus |
| `blur` | `event: FocusEvent` | 失焦 / Blur |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `YearPickerProps`
- `YearPickerEmits`

## 键盘交互

- 状态：`FAIL`
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

— 见同包组件与 `Form` / `Select` 等表单家族。

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| import | `amg-webui/form` |
| metadata | `component-metadata/YearPicker.json` |
| API extract | `generated/component-api/YearPicker.json` |

> 完整 Demo 见 `example/demos/YearPicker`（example 本地调试，不上线）。

