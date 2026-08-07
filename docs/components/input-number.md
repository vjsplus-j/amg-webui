# InputNumber

InputNumber：面向企业场景的 Input 组件（成熟度 rc）。

## 组件介绍

InputNumber：面向企业场景的 Input 组件（成熟度 rc）。

## 核心特性

- Input 家族组件
- v-model 双向绑定
- 多尺寸规格
- 宽度 100%
- 只读模式
- 占位提示
- 事件回调

## 何时使用 / 不适用

**适用**

- 表单文本/数值输入
- 受控与非受控输入场景

**不适用**

- 极复杂富文本编辑请使用 RichText / MdEditor

## 基础用法

> `import { InputNumber } from 'amg-webui/form'`

```vue
<script setup>
import { InputNumber } from 'amg-webui/form'
</script>

<template>
  <InputNumber />
</template>
```

Curated demo：`example/demos/InputNumber/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `number \| null` | `null` | 绑定值 / Bound value (v-model) |
| `id` | `string` | `undefined` | 元素 id（无障碍）/ Element id for a11y |
| `name` | `string` | `undefined` | 表单字段名 / Form field name |
| `autocomplete` | `string` | `undefined` | autocomplete 字符串 |
| `min` | `number` | `undefined` | min 数值 |
| `max` | `number` | `undefined` | max 数值 |
| `step` | `number` | 1 | step 数值 |
| `precision` | `number` | `undefined` | precision 数值 |
| `controls` | `boolean` | true | 是否启用 controls |
| `size` | `Size` | `md` | 尺寸：`sm` · `md` · `lg` / Size variant |
| `fluid` | `boolean` | `undefined` | 宽度 100% / Full width |
| `invalid` | `boolean` | `undefined` | 是否启用 invalid |
| `readonly` | `boolean` | `undefined` | 是否只读 / Read-only |
| `placeholder` | `string` | `undefined` | 占位提示 / Placeholder text |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |
| `skipFormItem` | `boolean` | false | 是否启用 skipFormItem |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: number \| null` | v-model 更新 / v-model update |
| `change` | `value: number \| null` | 值变更 / Change |
| `focus` | `event: FocusEvent` | 聚焦 / Focus |
| `blur` | `event: FocusEvent` | 失焦 / Blur |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `InputNumberProps`
- `InputNumberEmits`

## 键盘交互

- 状态：`PASS`
- 按键：`Type` · `Key7`
- Type: typing updates InputNumber modelValue; Key7: disabled InputNumber does not emit update:modelValue on key interaction

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
| metadata | `component-metadata/InputNumber.json` |
| API extract | `generated/component-api/InputNumber.json` |

> 完整 Demo 见 `example/demos/InputNumber`（example 本地调试，不上线）。

