# AdvancedSearch

AdvancedSearch 为 **RC** 公共组件（Contract maturity=`rc`）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

AdvancedSearch 当前成熟度为 **RC**；完整交互见本地 example。

## 何时使用 / 何时不用

- **适用**：RC 阶段的标准 UI 场景（未宣称 Stable）。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

— 见同包组件与 `Form` / `Select` 等表单家族。

## 基础用法

```vue
<script setup>
import { AdvancedSearch } from '@amg-webui/form'
</script>

<template>
  <AdvancedSearch />
</template>
```

Curated demo：`example/demos/AdvancedSearch/index.vue`

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `FilterCondition[]` | — | 绑定值 / Bound value (v-model) |
| `logic` | `SearchLogic` | — | — |
| `fields` | `FilterFieldOption[]` | — | — |
| `templates` | `{ id: string; name: string; conditions: FilterCondition[]; logic: SearchLogic }[]` | — | — |
| `loading` | `boolean` | — | 加载中状态 / Loading state |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: FilterCondition[]` | v-model 更新 / v-model update |
| `update:logic` | `value: SearchLogic` | — |
| `change` | `value: FilterCondition[]` | 值变更 / Change |
| `search` | `payload: { conditions: FilterCondition[]; logic: SearchLogic }` | — |
| `save-template` | `payload: { conditions: FilterCondition[]; logic: SearchLogic }` | — |

## Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

## Public types

- `SearchLogic`
- `AdvancedSearchProps`
- `AdvancedSearchEmits`


## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| API extract | `generated/component-api/AdvancedSearch.json` |

> 完整 Demo 见 `example/demos/AdvancedSearch`。对外 docs 为 API 导向页面；交互预览见本地 example（不上线）。
