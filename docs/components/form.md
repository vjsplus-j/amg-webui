# Form 表单

Form 表单：面向企业场景的 Form 组件（成熟度 rc）。

## 组件介绍

Form 表单：面向企业场景的 Form 组件（成熟度 rc）。

## 核心特性

- Form 家族组件
- 校验规则
- 支持禁用状态
- 事件回调

## 何时使用 / 不适用

**适用**

- 表单布局、校验与字段编排
- 动态/分步表单
- 需要禁用/只读控制的表单场景

**不适用**

- 纯展示场景无需引入完整 Form

## 基础用法

> `import { Form } from 'amg-webui/form'`

```vue
<script setup>
import { ref } from 'vue'
import { Form, FormItem, InputText } from 'amg-webui/form'

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

## 示例

<DocsDemo name="form-basic" />

## FormItem 集成

`FormItem` provides field context; form controls auto-integrate via `useFormItem` (`id` / `name` / `disabled` / `aria-*` / blur-or-change validate):

- Text-like: `InputText` / `Textarea` / `InputNumber` / `Password` / `Mention` / `InputOTP` / `InputCaptcha` — native attrs via `useNativeInputAttrs`
- Boolean: `Checkbox` / `Radio` / `Switch`
- Composite: `Select` / `Cascader` / `TreeSelect` / `DatePicker` / `DateTimePicker` / `TimePicker` / `TimeSelect` / `ColorPicker` / `Slider` / `Rate` / `Transfer`

Undeclared native attrs (`pattern`, `inputmode`, `minlength`, `aria-labelledby`, …) are forwarded onto the real control via `useNativeInputAttrs` — not the wrapper host.

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `model` | `Record<string, unknown>` | `() => ({})` | 表单数据对象（响应式）/ Reactive form model |
| `rules` | `FormRules` | `undefined` | 字段校验规则映射 / Field validation rules |
| `disabled` | `boolean` | `undefined` | 是否禁用 / Whether disabled |
| `labelWidth` | `string` | `undefined` | 标签宽度 / Label width |
| `labelPosition` | `'left' \| 'top'` | `left` | 标签位置 / Label position |
| `sanitizeOnSubmit` | `boolean` | false | Before successful submit, deep-filter string fields with `sanitizeModelStrings`. Mutates `model` in place when provided as a reactive object. |
| `trackId` | `string` | `undefined` | Telemetry 追踪 id / Telemetry track id |
| `telemetry` | `boolean` | `undefined` | 是否上报 Telemetry / Enable telemetry |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `validate` | `valid: boolean, errors: Record<string, string>` | validate 时触发 |
| `submit` | `void` | 提交 / Submit |

### Public Types

- `FormRules`
- `FormRule`
- `FormContext`
- `FormProps`
- `FormEmits`

## 键盘交互

- 状态：`PASS`
- 按键：`Enter`
- Enter: Enter in field triggers native form submission and Form emits submit when valid; Enter: invalid Form emits validate(false) and does not emit submit

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

- [FormItem](./form-item)
- [FormGroup](./form-group)
- [FormTabs](./form-tabs)
- [DynamicForm](./dynamic-form)
- [StepForm](./step-form)
- [InputText](./input-text)

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| import | `amg-webui/form` |
| metadata | `component-metadata/Form.json` |
| API extract | `generated/component-api/Form.json` |

> **DocsDemo** 为 docs 站内嵌演示；完整 curated demo 见 `example/demos/Form`。

