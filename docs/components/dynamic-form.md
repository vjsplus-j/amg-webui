# DynamicForm 动态表单

DynamicForm 动态表单：面向企业场景的 Form 组件（成熟度 rc）。

## 组件介绍

DynamicForm 动态表单：面向企业场景的 Form 组件（成熟度 rc）。

## 核心特性

- Form 家族组件
- v-model 双向绑定
- 加载状态反馈
- 事件回调

## 何时使用 / 不适用

**适用**

- 表单布局、校验与字段编排
- 动态/分步表单
- 异步提交或加载过程反馈

**不适用**

- 纯展示场景无需引入完整 Form

## 基础用法

> `import { DynamicForm } from 'amg-webui/form'`

```vue
<script setup>
import { DynamicForm } from 'amg-webui/form'
</script>

<template>
  <DynamicForm />
</template>
```

Curated demo：`example/demos/DynamicForm/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `Record<string, unknown>` | `() => ({})` | 绑定值 / Bound value (v-model) |
| `schema` | `DynamicFieldSchema[]` | `() => []` | schema 列表数据 |
| `loading` | `boolean` | false | 加载中状态 / Loading state |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: Record<string, unknown>` | v-model 更新 / v-model update |
| `change` | `value: Record<string, unknown>` | 值变更 / Change |
| `submit` | `value: Record<string, unknown>` | 提交 / Submit |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `DynamicFieldType`
- `DynamicFieldOption`
- `DynamicFieldSchema`
- `DynamicFormProps`
- `DynamicFormEmits`

## 键盘交互

- 状态：`FAIL`
- 按键：`Tab` · `Enter` · `Escape` · `ArrowDown` · `ArrowUp` · `ArrowLeft` · `ArrowRight` · `Home` · `End` · `Space`
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
| metadata | `component-metadata/DynamicForm.json` |
| API extract | `generated/component-api/DynamicForm.json` |

> 完整 Demo 见 `example/demos/DynamicForm`（example 本地调试，不上线）。

