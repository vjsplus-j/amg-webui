# Switch

Switch 为 **Stable** 公共组件（API frozen）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

Switch 已通过 Component Hardening 证据门禁；完整交互演示见本地 example curated demo。

## 何时使用 / 何时不用

- **适用**：生产可用的 Stable 组件场景。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

— 见同包组件与 `Form` / `Select` 等表单家族。

## 基础用法

```vue
<script setup>
import { Switch } from '@amg-webui/form'
</script>

<template>
  <Switch />
</template>
```

Curated demo：`example/demos/Switch/index.vue`

## 交互演示

<DocsDemo name="switch-basic" />

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | — | 绑定值 / Bound value (v-model) |
| `id` | `string` | — | 元素 id（无障碍）/ Element id for a11y |
| `name` | `string` | — | 表单字段名 / Form field name |
| `size` | `Size` | — | 尺寸：`sm` · `md` · `lg` / Size variant |
| `inlinePrompt` | `boolean` | — | — |
| `activeText` | `string` | — | — |
| `inactiveText` | `string` | — | — |
| `invalid` | `boolean` | — | — |
| `ariaLabel` | `string` | — | 无障碍标签 / ARIA label |

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

- `SwitchProps`
- `SwitchEmits`

## 无障碍与键盘

交互行为与键盘路径以 `component-hardening/evidence/Switch/a11y.json` · `keyboard.json` 为准；本地可复现：`example/demos/Switch/`。

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `stable` |
| apiFreeze | `frozen` |
| API extract | `generated/component-api/Switch.json` |

> 上方 **DocsDemo** 为 docs 站内嵌交互演示。完整 curated demo 见 `example/demos/Switch`。
