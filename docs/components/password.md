# Password

Password：面向企业场景的 Input 组件（成熟度 rc）。

## 组件介绍

Password：面向企业场景的 Input 组件（成熟度 rc）。

## 核心特性

- Input 家族组件
- v-model 双向绑定
- 占位提示
- 多尺寸规格
- 宽度 100%
- 只读模式
- 事件回调

## 何时使用 / 不适用

**适用**

- 表单文本/数值输入
- 受控与非受控输入场景

**不适用**

- 极复杂富文本编辑请使用 RichText / MdEditor

## 基础用法

> `import { Password } from 'amg-webui/form'`

```vue
<script setup>
import { Password } from 'amg-webui/form'
</script>

<template>
  <Password />
</template>
```

Curated demo：`example/demos/Password/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | `` | 绑定值 / Bound value (v-model) |
| `id` | `string` | `undefined` | 元素 id（无障碍）/ Element id for a11y |
| `name` | `string` | `undefined` | 表单字段名 / Form field name |
| `autocomplete` | `string` | `current-password` | autocomplete 字符串 |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |
| `showToggle` | `boolean` | true | 是否启用 showToggle |
| `placeholder` | `string` | `undefined` | 占位提示 / Placeholder text |
| `size` | `Size` | `md` | 尺寸：`sm` · `md` · `lg` / Size variant |
| `fluid` | `boolean` | `undefined` | 宽度 100% / Full width |
| `invalid` | `boolean` | `undefined` | 是否启用 invalid |
| `readonly` | `boolean` | `undefined` | 是否只读 / Read-only |
| `maxlength` | `number` | `undefined` | 最大长度 / Max length |
| `sanitizeInput` | `boolean \| 'blur' \| 'input' \| 'off'` | false | Opt-in field filter via `@amg-webui/security` (not XSS defense). Default `false`. Use `true` / `'blur'` on blur, `'input'` for keystroke filtering. |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string` | v-model 更新 / v-model update |
| `input` | `event: Event` | 输入 / Input |
| `change` | `event: Event` | 值变更 / Change |
| `focus` | `event: FocusEvent` | 聚焦 / Focus |
| `blur` | `event: FocusEvent` | 失焦 / Blur |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `PasswordProps`
- `PasswordEmits`

## 键盘交互

- 状态：`PASS`
- 按键：`Type` · `KeyS`
- Type: typing updates Password modelValue through update:modelValue emit; KeyS: disabled Password does not emit update:modelValue on key interaction

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
- [InputText](./input-text)

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| import | `amg-webui/form` |
| metadata | `component-metadata/Password.json` |
| API extract | `generated/component-api/Password.json` |

> 完整 Demo 见 `example/demos/Password`（example 本地调试，不上线）。

