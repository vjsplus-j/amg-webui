# SmsCode

SmsCode：面向企业场景的 Input 组件（成熟度 rc）。

## 组件介绍

SmsCode：面向企业场景的 Input 组件（成熟度 rc）。

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

> `import { SmsCode } from 'amg-webui/form'`

```vue
<script setup>
import { SmsCode } from 'amg-webui/form'
</script>

<template>
  <SmsCode />
</template>
```

Curated demo：`example/demos/SmsCode/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | `` | 绑定值 / Bound value (v-model) |
| `id` | `string` | `undefined` | 元素 id（无障碍）/ Element id for a11y |
| `name` | `string` | `undefined` | 表单字段名 / Form field name |
| `countdown` | `number` | 60 | Countdown seconds after send |
| `length` | `number` | 6 | Expected digit length |
| `phone` | `string` | `undefined` | phone 字符串 |
| `beforeSend` | `() => boolean \| void \| Promise<boolean \| void>` | `undefined` | 是否启用 beforeSend |
| `invalid` | `boolean` | `undefined` | 是否启用 invalid |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string` | v-model 更新 / v-model update |
| `change` | `value: string` | 值变更 / Change |
| `send` | `void` | send 时触发 |
| `complete` | `value: string` | complete 时触发 |
| `send-error` | `error: unknown` | send-error 时触发 |
| `countdown` | `seconds: number` | countdown 时触发 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `SmsCodeProps`
- `SmsCodeEmits`

## 键盘交互

- 状态：`FAIL`
- 按键：`Tab` · `Enter` · `Escape` · `ArrowDown` · `ArrowUp` · `ArrowLeft` · `ArrowRight` · `Home` · `End` · `Space`
- keyboard PASS requires testCases[] with ≥1 PASS case including expected behavior text

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts SmsCode uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts SmsCode RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts SmsCode client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/SmsCode.json` |
| API extract | `generated/component-api/SmsCode.json` |

> 完整 Demo 见 `example/demos/SmsCode`（example 本地调试，不上线）。

