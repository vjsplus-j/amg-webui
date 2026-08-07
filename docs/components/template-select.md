# TemplateSelect

TemplateSelect 为 **Stable** 公共组件（API frozen）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

TemplateSelect 已通过 Component Hardening 证据门禁；完整交互演示见本地 example curated demo。

## 何时使用 / 何时不用

- **适用**：生产可用的 Stable 组件场景。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

— 见同包组件与 `Form` / `Select` 等表单家族。

## 基础用法

```vue
<script setup>
import { TemplateSelect } from '@amg-webui/lowcode'
</script>

<template>
  <TemplateSelect />
</template>
```

Curated demo：`example/demos/TemplateSelect/index.vue`

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| null` | — | — |
| `templates` | `FormTemplate[]` | — | — |
| `layout` | `'dropdown' \| 'cards'` | — | — |
| `searchable` | `boolean` | — | — |
| `searchableMin` | `number` | — | — |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string \| null` | — |
| `change` | `template: FormTemplate \| null` | — |
| `apply` | `data: Record<string, unknown>` | — |

## Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

## Public types

- `FormTemplate`
- `TemplateSelectProps`
- `TemplateSelectEmits`

## 无障碍与键盘

交互行为与键盘路径以 `component-hardening/evidence/TemplateSelect/a11y.json` · `keyboard.json` 为准；本地可复现：`example/demos/TemplateSelect/`。

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `stable` |
| apiFreeze | `frozen` |
| API extract | `generated/component-api/TemplateSelect.json` |

> 完整 Demo 见 `example/demos/TemplateSelect`。对外 docs 为 API 导向页面；交互预览仅在本地 example（不上线）。
