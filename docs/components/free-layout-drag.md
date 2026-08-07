# FreeLayoutDrag

FreeLayoutDrag 为 **RC** 公共组件（Contract maturity=`rc`）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

FreeLayoutDrag 当前成熟度为 **RC**；完整交互见本地 example。

## 何时使用 / 何时不用

- **适用**：RC 阶段的标准 UI 场景（未宣称 Stable）。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

— 见同包组件与 `Form` / `Select` 等表单家族。

## 基础用法

```vue
<script setup>
import { FreeLayoutDrag } from '@amg-webui/lowcode'
</script>

<template>
  <FreeLayoutDrag />
</template>
```

Curated demo：`example/demos/FreeLayoutDrag/index.vue`

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `enabled` | `boolean` | — | — |
| `loading` | `boolean` | — | 加载中状态 / Loading state |
| `disabled` | `boolean` | — | 是否禁用 / Whether disabled |
| `title` | `string` | — | 标题 / Title |
| `telemetry` | `boolean` | — | 是否上报 Telemetry / Enable telemetry |
| `trackId` | `string` | — | Telemetry 追踪 id / Telemetry track id |
| `modelValue` | `{ x: number; y: number }` | — | 绑定值 / Bound value (v-model) |
| `draggable` | `boolean` | — | — |
| `axis` | `"both" \| "x" \| "y"` | — | — |
| `constrainToParent` | `boolean` | — | — |
| `activeText` | `string` | — | — |
| `inactiveText` | `string` | — | — |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `mode` | `mode: "free"` | — |
| `toggle` | `enabled: boolean` | — |
| `update:enabled` | `enabled: boolean` | — |
| `update:modelValue` | `value: { x: number; y: number }` | v-model 更新 / v-model update |
| `change` | `value: { x: number; y: number }` | 值变更 / Change |
| `drag-start` | `value: { x: number; y: number }, event: PointerEvent` | — |
| `drag` | `value: { x: number; y: number }, event: PointerEvent` | — |
| `drag-end` | `value: { x: number; y: number }, event: PointerEvent` | — |

## Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

## Public types

- `FreeLayoutDragProps`
- `FreeLayoutDragEmits`


## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| API extract | `generated/component-api/FreeLayoutDrag.json` |

> 完整 Demo 见 `example/demos/FreeLayoutDrag`。对外 docs 为 API 导向页面；交互预览见本地 example（不上线）。
