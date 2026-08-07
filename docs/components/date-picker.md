# DatePicker 日期选择

DatePicker 日期选择：面向企业场景的 DateTime 组件（成熟度 rc）。

## 组件介绍

DatePicker 日期选择：面向企业场景的 DateTime 组件（成熟度 rc）。

## 核心特性

- DateTime 家族组件
- v-model 双向绑定
- 占位提示
- 事件回调
- 插槽自定义
- 实例方法暴露

## 何时使用 / 不适用

**适用**

- 日期/时间选择与范围输入
- 表单与筛选面板

**不适用**

- 需要非标准历法或复杂排班规则时需自定义

## 基础用法

> `import { DatePicker } from 'amg-webui/form'`

```vue
<script setup>
import { DatePicker } from 'amg-webui/form'
</script>

<template>
  <DatePicker />
</template>
```

Curated demo：`example/demos/DatePicker/index.vue`

## 示例

<DocsDemo name="date-picker-basic" />

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | `undefined` | Native id — falls back to FormItem field id when nested |
| `name` | `string` | `undefined` | Native name — falls back to FormItem `prop` when nested |
| `modelValue` | `string \| Date \| null` | `null` | 绑定值 / Bound value (v-model) |
| `placeholder` | `string` | `undefined` | 占位提示 / Placeholder text |
| `valueFormat` | `'date' \| 'iso'` | `iso` | valueFormat 配置项 |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string \| Date \| null` | v-model 更新 / v-model update |
| `change` | `value: string \| Date \| null` | 值变更 / Change |

### Slots

| Slot | Props | 说明 |
| --- | --- | --- |
| `default` | `props: Record<string, never>` | Trailing auxiliary content beside the control |

### Expose

| 方法 / 属性 | 类型 | 说明 |
| --- | --- | --- |
| `focus` | `() => void` | Focus the trigger button |
| `blur` | `() => void` | Blur the trigger button |
| `open` | `() => void` | Open the calendar panel |
| `close` | `() => void` | Close the calendar panel |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `DatePickerInstance`
- `DatePickerProps`
- `DatePickerEmits`
- `DatePickerSlots`
- `DatePickerExpose`

## 键盘交互

- 状态：`FAIL`
- 按键：`Enter` · `ArrowDown` · `Escape`
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
- structural top-level DOM clean

## 当前限制

- Interactive actions no-op when disabled
- API 尚未冻结，可能随 hardening 批次调整

## 相关组件

- [Form](./form)
- [FormItem](./form-item)
- [DateTimePicker](./date-time-picker)
- [TimePicker](./time-picker)
- [Calendar](./calendar)

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| import | `amg-webui/form` |
| metadata | `component-metadata/DatePicker.json` |
| API extract | `generated/component-api/DatePicker.json` |

> **DocsDemo** 为 docs 站内嵌演示；完整 curated demo 见 `example/demos/DatePicker`。

