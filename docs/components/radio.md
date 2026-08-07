# Radio

Radio 为 **Stable** 公共组件（API frozen）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

Radio 已通过 Component Hardening 证据门禁；完整交互演示见本地 example curated demo。

## 何时使用 / 何时不用

- **适用**：生产可用的 Stable 组件场景。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

— 见同包组件与 `Form` / `Select` 等表单家族。

## 基础用法

```vue
<script setup>
import { Radio } from '@amg-webui/form'
</script>

<template>
  <Radio />
</template>
```

Curated demo：`example/demos/Radio/index.vue`

## 交互演示

<DocsDemo name="radio-basic" />

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `unknown` | — | 绑定值 / Bound value (v-model) |
| `id` | `string` | — | 元素 id（无障碍）/ Element id for a11y |
| `value` | `unknown` | **必填** | 表格行数据或绑定值 / Row data or bound value |
| `label` | `string` | — | 显示文案 / Display label |
| `name` | `string` | — | 表单字段名 / Form field name |
| `invalid` | `boolean` | — | — |
| `skipFormItem` | `boolean` | — | — |
| `size` | `Size` | — | 尺寸：`sm` · `md` · `lg` / Size variant |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: unknown` | v-model 更新 / v-model update |
| `change` | `value: unknown` | 值变更 / Change |

## Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

## Public types

- `RadioGroupContext`
- `RadioProps`
- `RadioEmits`

## 无障碍与键盘

交互行为与键盘路径以 `component-hardening/evidence/Radio/a11y.json` · `keyboard.json` 为准；本地可复现：`example/demos/Radio/`。

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `stable` |
| apiFreeze | `frozen` |
| API extract | `generated/component-api/Radio.json` |

> 上方 **DocsDemo** 为 docs 站内嵌交互演示。完整 curated demo 见 `example/demos/Radio`。
