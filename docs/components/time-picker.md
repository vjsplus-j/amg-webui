# TimePicker 时间选择

TimePicker 时间选择：面向企业场景的 DateTime 组件（成熟度 rc）。

## 组件介绍

TimePicker 时间选择：面向企业场景的 DateTime 组件（成熟度 rc）。

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

> `import { TimePicker } from 'amg-webui/form'`

```vue
<script setup>
import { TimePicker } from 'amg-webui/form'
</script>

<template>
  <TimePicker />
</template>
```

Curated demo：`example/demos/TimePicker/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | `undefined` | Native id — falls back to FormItem field id when nested |
| `name` | `string` | `undefined` | Native name — falls back to FormItem `prop` when nested |
| `modelValue` | `string \| Date \| null` | `null` | 绑定值 / Bound value (v-model) |
| `placeholder` | `string` | `undefined` | 占位提示 / Placeholder text |
| `showSeconds` | `boolean` | true | 是否启用 showSeconds |
| `valueFormat` | `'time' \| 'date'` | `time` | valueFormat 配置项 |
| `minuteStep` | `number` | 1 | minuteStep 数值 |
| `secondStep` | `number` | 1 | secondStep 数值 |
| `clearable` | `boolean` | false | 可一键清空 / Show clear button |
| `readonly` | `boolean` | false | 是否只读 / Read-only |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |
| `skipFormItem` | `boolean` | false | When true, skip FormItem inject (composite parents own the hook). |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string \| Date \| null` | v-model 更新 / v-model update |
| `change` | `value: string \| Date \| null` | 值变更 / Change |
| `clear` | `void` | clear 时触发 |
| `open-change` | `open: boolean` | open-change 时触发 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `TimePickerProps`
- `TimePickerEmits`

## 键盘交互

- 状态：`PASS`
- 按键：`ArrowDown` · `Escape`
- ArrowDown: ArrowDown opens panel and moves hour selection in column; Escape: Escape closes TimePicker panel

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
- [DateTimePicker](./date-time-picker)
- [TimeSelect](./time-select)

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| import | `amg-webui/form` |
| metadata | `component-metadata/TimePicker.json` |
| API extract | `generated/component-api/TimePicker.json` |

> 完整 Demo 见 `example/demos/TimePicker`（example 本地调试，不上线）。

