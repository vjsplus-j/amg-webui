# InputOTP

InputOTP：面向企业场景的 Input 组件（成熟度 rc）。

## 组件介绍

InputOTP：面向企业场景的 Input 组件（成熟度 rc）。

## 核心特性

- Input 家族组件
- v-model 双向绑定
- 多尺寸规格
- 事件回调

## 何时使用 / 不适用

**适用**

- 表单文本/数值输入
- 受控与非受控输入场景

**不适用**

- 极复杂富文本编辑请使用 RichText / MdEditor

## 基础用法

> `import { InputOTP } from 'amg-webui/form'`

```vue
<script setup>
import { InputOTP } from 'amg-webui/form'
</script>

<template>
  <InputOTP />
</template>
```

Curated demo：`example/demos/InputOTP/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | `undefined` | Native id — falls back to FormItem field id when nested; applied to first cell |
| `name` | `string` | `undefined` | Native name — falls back to FormItem `prop` when nested |
| `modelValue` | `string` | `` | 绑定值 / Bound value (v-model) |
| `length` | `number` | 6 | length 数值 |
| `mask` | `boolean` | false | 是否启用 mask |
| `autofocus` | `boolean` | false | 挂载后自动聚焦 / Autofocus on mount |
| `type` | `'text' \| 'number'` | `text` | 输入类型 / Input type |
| `size` | `Size` | `md` | 尺寸：`sm` · `md` · `lg` / Size variant |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string` | v-model 更新 / v-model update |
| `change` | `value: string` | 值变更 / Change |
| `complete` | `value: string` | complete 时触发 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `InputOTPProps`
- `InputOTPEmits`

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

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| import | `amg-webui/form` |
| metadata | `component-metadata/InputOTP.json` |
| API extract | `generated/component-api/InputOTP.json` |

> 完整 Demo 见 `example/demos/InputOTP`（example 本地调试，不上线）。

