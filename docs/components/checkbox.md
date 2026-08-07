# Checkbox 复选框

Checkbox 为 **Stable** 公共组件（API frozen）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

Checkbox 已通过 Component Hardening 证据门禁；完整交互演示见本地 example curated demo。

## 何时使用 / 何时不用

- **适用**：生产可用的 Stable 组件场景。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

— 见同包组件与 `Form` / `Select` 等表单家族。

## 基础用法

```vue
<script setup>
import { Checkbox } from '@amg-webui/form'
</script>

<template>
  <Checkbox />
</template>
```

Curated demo：`example/demos/Checkbox/index.vue`

## 交互演示

<DocsDemo name="checkbox-basic" />

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | — | 绑定值 / Bound value (v-model) |
| `id` | `string` | — | 元素 id（无障碍）/ Element id for a11y |
| `name` | `string` | — | 表单字段名 / Form field name |
| `value` | `unknown` | — | 表格行数据或绑定值 / Row data or bound value |
| `label` | `string` | — | 显示文案 / Display label |
| `indeterminate` | `boolean` | — | 半选状态 / Indeterminate |
| `invalid` | `boolean` | — | — |
| `skipFormItem` | `boolean` | — | — |
| `size` | `Size` | — | 尺寸：`sm` · `md` · `lg` / Size variant |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: boolean` | v-model 更新 / v-model update |
| `change` | `value: boolean` | 值变更 / Change |

## Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

## Public types

- `CheckboxGroupContext`
- `CheckboxProps`
- `CheckboxEmits`

## 无障碍与键盘

交互行为与键盘路径以 `component-hardening/evidence/Checkbox/a11y.json` · `keyboard.json` 为准；本地可复现：`example/demos/Checkbox/`。

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `stable` |
| apiFreeze | `frozen` |
| API extract | `generated/component-api/Checkbox.json` |

> 上方 **DocsDemo** 为 docs 站内嵌交互演示。完整 curated demo 见 `example/demos/Checkbox`。
