# InputCaptcha

InputCaptcha：面向企业场景的 Input 组件（成熟度 rc）。

## 组件介绍

InputCaptcha：面向企业场景的 Input 组件（成熟度 rc）。

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

> `import { InputCaptcha } from 'amg-webui/form'`

```vue
<script setup>
import { InputCaptcha } from 'amg-webui/form'
</script>

<template>
  <InputCaptcha />
</template>
```

Curated demo：`example/demos/InputCaptcha/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | `undefined` | Native id — falls back to FormItem field id when nested |
| `name` | `string` | `undefined` | Native name — falls back to FormItem `prop` when nested |
| `modelValue` | `string` | `` | 绑定值 / Bound value (v-model) |
| `length` | `number` | 4 | length 数值 |
| `caseSensitive` | `boolean` | false | 是否启用 caseSensitive |
| `refreshDelay` | `number` | 300 | refreshDelay 数值 |
| `showRefreshButton` | `boolean` | false | 是否启用 showRefreshButton |
| `generator` | `(length: number) => string` | `undefined` | generator 数值 |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string` | v-model 更新 / v-model update |
| `change` | `value: string` | 值变更 / Change |
| `verify` | `valid: boolean` | verify 时触发 |
| `refresh` | `void` | refresh 时触发 |
| `generated` | `code: string` | generated 时触发 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `InputCaptchaProps`
- `InputCaptchaEmits`

## 键盘交互

- 状态：`FAIL`
- 按键：`Tab` · `Enter` · `Escape` · `ArrowDown` · `ArrowUp` · `ArrowLeft` · `ArrowRight` · `Home` · `End` · `Space`
- keyboard PASS requires testCases[] with ≥1 PASS case including expected behavior text

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts InputCaptcha uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts InputCaptcha RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts InputCaptcha client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/InputCaptcha.json` |
| API extract | `generated/component-api/InputCaptcha.json` |

> 完整 Demo 见 `example/demos/InputCaptcha`（example 本地调试，不上线）。

