# TimeSelect

TimeSelect：面向企业场景的 DateTime 组件（成熟度 rc）。

## 组件介绍

TimeSelect：面向企业场景的 DateTime 组件（成熟度 rc）。

## 核心特性

- DateTime 家族组件
- v-model 双向绑定
- 占位提示
- 可一键清空
- 多尺寸规格
- 事件回调

## 何时使用 / 不适用

**适用**

- 日期/时间选择与范围输入
- 表单与筛选面板

**不适用**

- 需要非标准历法或复杂排班规则时需自定义

## 基础用法

> `import { TimeSelect } from 'amg-webui/form'`

```vue
<script setup>
import { TimeSelect } from 'amg-webui/form'
</script>

<template>
  <TimeSelect />
</template>
```

Curated demo：`example/demos/TimeSelect/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | `undefined` | Native id — falls back to FormItem field id when nested |
| `name` | `string` | `undefined` | Native name — falls back to FormItem `prop` when nested |
| `modelValue` | `string \| null` | `null` | 绑定值 / Bound value (v-model) |
| `start` | `string` | `00:00` | start 字符串 |
| `end` | `string` | `23:30` | end 字符串 |
| `step` | `string` | `00:30` | step 字符串 |
| `placeholder` | `string` | `undefined` | 占位提示 / Placeholder text |
| `clearable` | `boolean` | true | 可一键清空 / Show clear button |
| `size` | `Size` | `md` | 尺寸：`sm` · `md` · `lg` / Size variant |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string \| null` | v-model 更新 / v-model update |
| `change` | `value: string \| null` | 值变更 / Change |
| `clear` | `void` | clear 时触发 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `TimeSelectProps`
- `TimeSelectEmits`

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

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| import | `amg-webui/form` |
| metadata | `component-metadata/TimeSelect.json` |
| API extract | `generated/component-api/TimeSelect.json` |

> 完整 Demo 见 `example/demos/TimeSelect`（example 本地调试，不上线）。

