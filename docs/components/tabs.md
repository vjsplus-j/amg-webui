# Tabs

Tabs 为 **RC** 公共组件（Contract maturity=`rc`）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

Tabs 当前成熟度为 **RC**；下方 DocsDemo 提供 docs 站内嵌交互，完整场景见 example。

## 何时使用 / 何时不用

- **适用**：RC 阶段的标准 UI 场景（未宣称 Stable）。
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


## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| API extract | `generated/component-api/Tabs.json` |

> 上方 **DocsDemo** 为 docs 站内嵌交互演示。完整 curated demo 见 `example/demos/Tabs`。
