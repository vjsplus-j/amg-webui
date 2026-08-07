# InputText 文本输入

InputText 文本输入：面向企业场景的 Input 组件（成熟度 rc）。

## 组件介绍

InputText 文本输入：面向企业场景的 Input 组件（成熟度 rc）。

## 核心特性

- Input 家族组件
- v-model 双向绑定
- 占位提示
- 支持禁用状态
- 只读模式
- 多尺寸规格
- 宽度 100%
- 事件回调

## 何时使用 / 不适用

**适用**

- 表单文本/数值输入
- 受控与非受控输入场景
- 需要禁用/只读控制的表单场景

**不适用**

- 极复杂富文本编辑请使用 RichText / MdEditor

## 基础用法

> `import { InputText } from 'amg-webui/form'`

```vue
<script setup>
import { InputText } from 'amg-webui/form'
</script>

<template>
  <InputText />
</template>
```

Curated demo：`example/demos/InputText/index.vue`

## 示例

<DocsDemo name="input-text-basic" />

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | `` | 绑定值 / Bound value (v-model) |
| `id` | `string` | `undefined` | Native input id — falls back to FormItem field id when nested |
| `name` | `string` | `undefined` | Native name — falls back to FormItem `prop` when nested |
| `autocomplete` | `string` | `undefined` | autocomplete 字符串 |
| `ariaLabel` | `string` | `undefined` | Maps to aria-label on the native input |
| `placeholder` | `string` | `undefined` | 占位提示 / Placeholder text |
| `disabled` | `boolean` | `undefined` | 是否禁用 / Whether disabled |
| `readonly` | `boolean` | `undefined` | 是否只读 / Read-only |
| `maxlength` | `number` | `undefined` | 最大长度 / Max length |
| `size` | `Size` | `md` | 尺寸：`sm` · `md` · `lg` / Size variant |
| `invalid` | `boolean` | `undefined` | 是否启用 invalid |
| `fluid` | `boolean` | `undefined` | 宽度 100% / Full width |
| `type` | `'text' \| 'password' \| 'email' \| 'tel' \| 'url' \| 'search'` | `text` | 输入类型 / Input type |
| `sanitizeInput` | `boolean \| 'blur' \| 'input' \| 'off'` | false | Opt-in field filter via `@amg-webui/security` (not XSS defense). Default `false`. Use `true` / `'blur'` on blur, `'input'` for keystroke filtering. |
| `skipFormItem` | `boolean` | false | When true, skip FormItem inject (composite parents own the hook). |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `keydown` | `event: KeyboardEvent` | keydown 时触发 |
| `keyup` | `event: KeyboardEvent` | keyup 时触发 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `InputTextProps`
- `InputTextEmits`

## 键盘交互

- 状态：`PASS`
- 按键：`Type` · `KeyA`
- Type: typing updates modelValue through update:modelValue emit; KeyA: disabled input does not emit update:modelValue on key interaction

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
- [Textarea](./textarea)
- [Password](./password)
- [InputNumber](./input-number)

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| import | `amg-webui/form` |
| metadata | `component-metadata/InputText.json` |
| API extract | `generated/component-api/InputText.json` |

> **DocsDemo** 为 docs 站内嵌演示；完整 curated demo 见 `example/demos/InputText`。

