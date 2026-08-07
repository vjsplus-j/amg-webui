# DragVerify

DragVerify 为 **RC** 公共组件（Contract maturity=`rc`）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

DragVerify 当前成熟度为 **RC**；完整交互见本地 example。

## 何时使用 / 何时不用

- **适用**：RC 阶段的标准 UI 场景（未宣称 Stable）。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

— 见同包组件与 `Form` / `Select` 等表单家族。

## 基础用法

```vue
<script setup>
import { DragVerify } from '@amg-webui/core'
</script>

<template>
  <DragVerify />
</template>
```

Curated demo：`example/demos/DragVerify/index.vue`

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | — | 绑定值 / Bound value (v-model) |
| `disabled` | `boolean` | — | 是否禁用 / Whether disabled |
| `threshold` | `number` | — | — |
| `width` | `string` | — | — |
| `resetOnFail` | `boolean` | — | — |
| `keyboardStep` | `number` | — | — |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: boolean` | v-model 更新 / v-model update |
| `success` | `void` | — |
| `fail` | `void` | — |
| `change` | `payload: { passed: boolean; offset: number; progress: number }` | 值变更 / Change |
| `reset` | `void` | — |
| `focus` | `event: FocusEvent` | 聚焦 / Focus |
| `blur` | `event: FocusEvent` | 失焦 / Blur |

## Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

## Public types

- `DragVerifyProps`
- `DragVerifyEmits`


## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| API extract | `generated/component-api/DragVerify.json` |

> 完整 Demo 见 `example/demos/DragVerify`。对外 docs 为 API 导向页面；交互预览见本地 example（不上线）。
