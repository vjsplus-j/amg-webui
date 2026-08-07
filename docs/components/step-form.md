# StepForm 分步表单

StepForm 为 **RC** 公共组件（Contract maturity=`rc`）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

StepForm 当前成熟度为 **RC**；完整交互见本地 example。

## 何时使用 / 何时不用

- **适用**：RC 阶段的标准 UI 场景（未宣称 Stable）。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

- [Form](./form)
- [FormItem](./form-item)

## 基础用法

```vue
<script setup>
import { StepForm } from '@amg-webui/form'
</script>

<template>
  <StepForm />
</template>
```

Curated demo：`example/demos/StepForm/index.vue`

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `number` | — | 绑定值 / Bound value (v-model) |
| `steps` | `StepFormStep[]` | — | — |
| `stepData` | `Record<string, Record<string, unknown>>` | — | — |
| `loading` | `boolean` | — | 加载中状态 / Loading state |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: number` | v-model 更新 / v-model update |
| `update:stepData` | `value: Record<string, Record<string, unknown>>` | — |
| `change` | `step: number` | 值变更 / Change |
| `submit` | `data: Record<string, Record<string, unknown>>` | 提交 / Submit |

## Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

## Public types

- `StepFormStep`
- `StepFormProps`
- `StepFormEmits`


## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| API extract | `generated/component-api/StepForm.json` |

> 完整 Demo 见 `example/demos/StepForm`。对外 docs 为 API 导向页面；交互预览见本地 example（不上线）。
