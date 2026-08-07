# Textarea

Textarea：面向企业场景的 Input 组件（成熟度 rc）。

## 组件介绍

Textarea：面向企业场景的 Input 组件（成熟度 rc）。

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

> `import { Textarea } from 'amg-webui/form'`

```vue
<script setup>
import { Textarea } from 'amg-webui/form'
</script>

<template>
  <Textarea />
</template>
```

Curated demo：`example/demos/Textarea/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | `` | 绑定值 / Bound value (v-model) |
| `id` | `string` | `undefined` | 元素 id（无障碍）/ Element id for a11y |
| `name` | `string` | `undefined` | 表单字段名 / Form field name |
| `autocomplete` | `string` | `undefined` | autocomplete 字符串 |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |
| `placeholder` | `string` | `undefined` | 占位提示 / Placeholder text |
| `disabled` | `boolean` | `undefined` | 是否禁用 / Whether disabled |
| `readonly` | `boolean` | `undefined` | 是否只读 / Read-only |
| `maxlength` | `number` | `undefined` | 最大长度 / Max length |
| `rows` | `number` | 4 | 每页行数 / Rows per page |
| `cols` | `number` | 50 | cols 数值 |
| `size` | `Size` | `md` | 尺寸：`sm` · `md` · `lg` / Size variant |
| `invalid` | `boolean` | `undefined` | 是否启用 invalid |
| `fluid` | `boolean` | `undefined` | 宽度 100% / Full width |
| `autoResize` | `boolean` | `undefined` | 是否启用 autoResize |
| `showCounter` | `boolean` | `undefined` | 是否启用 showCounter |
| `sanitizeInput` | `boolean \| 'blur' \| 'input' \| 'off'` | false | Opt-in field filter via `@amg-webui/security` (not XSS defense). Default `false`. Use `true` / `'blur'` on blur, `'input'` for keystroke filtering. |

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

- `TextareaProps`
- `TextareaEmits`

## 键盘交互

- 状态：`PASS`
- 按键：`Type` · `KeyA`
- Type: typing updates Textarea modelValue through update:modelValue emit; KeyA: disabled Textarea does not emit update:modelValue on key interaction

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
| metadata | `component-metadata/Textarea.json` |
| API extract | `generated/component-api/Textarea.json` |

> 完整 Demo 见 `example/demos/Textarea`（example 本地调试，不上线）。

