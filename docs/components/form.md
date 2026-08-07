# Form

Form 组件 API（v0.1 子集）。

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

`FormItem` provides field context; form controls auto-integrate via `useFormItem` (`id` / `name` / `disabled` / `aria-*` / blur-or-change validate):

- Text-like: `InputText` / `Textarea` / `InputNumber` / `Password` / `Mention` / `InputOTP` / `InputCaptcha` — native attrs via `useNativeInputAttrs`
- Boolean: `Checkbox` / `Radio` / `Switch`
- Composite: `Select` / `Cascader` / `TreeSelect` / `DatePicker` / `DateTimePicker` / `TimePicker` / `TimeSelect` / `ColorPicker` / `Slider` / `Rate` / `Transfer`

Undeclared native attrs (`pattern`, `inputmode`, `minlength`, `aria-labelledby`, …) are forwarded onto the real control via `useNativeInputAttrs` — not the wrapper host. Declared props never appear in `$attrs`; the helper only excludes keys the caller opts out of, so it does not maintain a prop-name blacklist that drifts from each component’s bindings.

## 常用 API

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `model` | `Record<string, unknown>` | — | — |
| `rules` | `FormRules` | — | — |
| `disabled` | `boolean` | — | — |
| `labelWidth` | `string` | — | — |
| `labelPosition` | `'left' \| 'top'` | — | — |
| `trackId` | `string` | — | — |
| `telemetry` | `boolean` | — | — |


| 事件 | 说明 |
| --- | --- |
| `validate` | — |
| `submit` | — |

> 完整 Demo 见 `example/demos/Form/`。本阶段对外 docs 为薄 API stub；交互预览仅在本地 example（不上线）。
