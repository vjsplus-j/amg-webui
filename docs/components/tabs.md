# Tabs

Tabs 为 **Stable** 公共组件（API frozen）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

Tabs 已通过 Component Hardening 证据门禁；完整交互演示见本地 example curated demo。

## 何时使用 / 何时不用

- **适用**：生产可用的 Stable 组件场景。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

— 见同包组件与 `Form` / `Select` 等表单家族。

## 基础用法

```vue
<script setup>
import { ref } from 'vue'
import { Tabs, TabPane } from '@amg-webui/core'

const active = ref('a')
</script>

<template>
  <Tabs v-model="active" aria-label="Demo tabs">
    <TabPane name="a" label="Tab A">Content A</TabPane>
    <TabPane name="b" label="Tab B">Content B</TabPane>
  </Tabs>
</template>
```

Curated demo：`example/demos/Tabs/index.vue`

## 交互演示

<DocsDemo name="tabs-basic" />

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| number` | — | 绑定值 / Bound value (v-model) |
| `ariaLabel` | `string` | — | 无障碍标签 / ARIA label |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string \| number` | v-model 更新 / v-model update |
| `change` | `value: string \| number` | 值变更 / Change |
| `tabClick` | `value: string \| number, event: MouseEvent \| KeyboardEvent` | — |

## Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

## Public types

- `TabsPaneMeta`
- `TabsProps`
- `TabsEmits`
- `TabPaneProps`

## 无障碍与键盘

交互行为与键盘路径以 `component-hardening/evidence/Tabs/a11y.json` · `keyboard.json` 为准；本地可复现：`example/demos/Tabs/`。

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `stable` |
| apiFreeze | `frozen` |
| API extract | `generated/component-api/Tabs.json` |

> 上方 **DocsDemo** 为 docs 站内嵌交互演示。完整 curated demo 见 `example/demos/Tabs`。
