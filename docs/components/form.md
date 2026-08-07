# Form

Form 为 **Stable** 公共组件（API frozen）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

Form 已通过 Component Hardening 证据门禁；完整交互演示见本地 example curated demo。

## 何时使用 / 何时不用

- **适用**：生产可用的 Stable 组件场景。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

- [FormItem](./form-item)
- [FormGroup](./form-group)
- [FormTabs](./form-tabs)
- [DynamicForm](./dynamic-form)
- [StepForm](./step-form)
- [InputText](./input-text)

## 基础用法

```vue
<script setup>
import { ref } from 'vue'
import { Form, FormItem, InputText } from '@amg-webui/form'

const model = ref({ name: '' })
</script>

<template>
  <Form :model="model">
    <FormItem label="Name" prop="name">
      <InputText v-model="model.name" />
    </FormItem>
  </Form>
</template>
```

Curated demo：`example/demos/Form/index.vue`

## 交互演示

<DocsDemo name="form-basic" />

## FormItem 集成

`FormItem` provides field context; form controls auto-integrate via `useFormItem` (`id` / `name` / `disabled` / `aria-*` / blur-or-change validate):

- Text-like: `InputText` / `Textarea` / `InputNumber` / `Password` / `Mention` / `InputOTP` / `InputCaptcha` — native attrs via `useNativeInputAttrs`
- Boolean: `Checkbox` / `Radio` / `Switch`
- Composite: `Select` / `Cascader` / `TreeSelect` / `DatePicker` / `DateTimePicker` / `TimePicker` / `TimeSelect` / `ColorPicker` / `Slider` / `Rate` / `Transfer`

Undeclared native attrs (`pattern`, `inputmode`, `minlength`, `aria-labelledby`, …) are forwarded onto the real control via `useNativeInputAttrs` — not the wrapper host.

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `model` | `Record<string, unknown>` | — | — |
| `rules` | `FormRules` | — | — |
| `disabled` | `boolean` | — | — |
| `labelWidth` | `string` | — | — |
| `labelPosition` | `'left' \| 'top'` | — | — |
| `sanitizeOnSubmit` | `boolean` | — | — |
| `trackId` | `string` | — | — |
| `telemetry` | `boolean` | — | — |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `validate` | `valid: boolean, errors: Record<string, string>` | — |
| `submit` | `void` | — |

## Public types

- `FormRules`
- `FormRule`
- `FormContext`
- `FormProps`
- `FormEmits`

## 无障碍与键盘

交互行为与键盘路径以 `component-hardening/evidence/Form/a11y.json` · `keyboard.json` 为准；本地可复现：`example/demos/Form/`。

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `stable` |
| apiFreeze | `frozen` |
| API extract | `generated/component-api/Form.json` |

> 完整 Demo 见 `example/demos/Form`。对外 docs 为 API 导向页面；交互预览仅在本地 example（不上线）。
