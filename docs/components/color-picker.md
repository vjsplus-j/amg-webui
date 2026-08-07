# ColorPicker 颜色选择

ColorPicker 颜色选择：面向企业场景的 Input 组件（成熟度 rc）。

## 组件介绍

ColorPicker 颜色选择：面向企业场景的 Input 组件（成熟度 rc）。

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

> `import { ColorPicker } from 'amg-webui/form'`

```vue
<script setup>
import { ColorPicker } from 'amg-webui/form'
</script>

<template>
  <ColorPicker />
</template>
```

Curated demo：`example/demos/ColorPicker/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | `undefined` | Native id — falls back to FormItem field id when nested |
| `name` | `string` | `undefined` | Native name — falls back to FormItem `prop` when nested |
| `modelValue` | `string` | `` | 绑定值 / Bound value (v-model) |
| `presets` | `string[]` | `() => [ 'var(--primary-500)', 'var(--success-500)', 'var(--warning-500)', 'var(--danger-500)', 'var(--info-500)', 'var(--text-primary)', 'var(--surface-3)', 'var(--primary-300)', 'var(--success-300)', 'var(--warning-300)', 'var(--danger-300)', 'var(--text-muted)' ]` | presets 字符串 |
| `skipFormItem` | `boolean` | false | When true, skip FormItem inject (composite parents own the hook). |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string` | v-model 更新 / v-model update |
| `change` | `value: string` | 值变更 / Change |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `ColorPickerProps`
- `ColorPickerEmits`

## 键盘交互

- 状态：`FAIL`
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

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| import | `amg-webui/form` |
| metadata | `component-metadata/ColorPicker.json` |
| API extract | `generated/component-api/ColorPicker.json` |

> 完整 Demo 见 `example/demos/ColorPicker`（example 本地调试，不上线）。

