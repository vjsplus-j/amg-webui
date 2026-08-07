# CanvasPreview

CanvasPreview 为 **RC** 公共组件（Contract maturity=`rc`）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

CanvasPreview 当前成熟度为 **RC**；完整交互见本地 example。

## 何时使用 / 何时不用

- **适用**：RC 阶段的标准 UI 场景（未宣称 Stable）。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

— 见同包组件与 `Form` / `Select` 等表单家族。

## 基础用法

```vue
<script setup>
import { CanvasPreview } from '@amg-webui/lowcode'
</script>

<template>
  <CanvasPreview />
</template>
```

Curated demo：`example/demos/CanvasPreview/index.vue`

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `nodes` | `CanvasNodeData[]` | — | — |
| `modelValue` | `string \| null` | — | 绑定值 / Bound value (v-model) |
| `mode` | `"free" \| "grid"` | — | — |
| `scale` | `number \| "fit"` | — | — |
| `minScale` | `number` | — | — |
| `maxScale` | `number` | — | — |
| `canvasWidth` | `number` | — | — |
| `canvasHeight` | `number` | — | — |
| `columns` | `number` | — | 列定义 / Column definitions |
| `showGrid` | `boolean` | — | — |
| `loading` | `boolean` | — | 加载中状态 / Loading state |
| `disabled` | `boolean` | — | 是否禁用 / Whether disabled |
| `interactive` | `boolean` | — | — |
| `title` | `string` | — | 标题 / Title |
| `emptyText` | `string` | — | — |
| `ariaLabel` | `string` | — | 无障碍标签 / ARIA label |
| `registry` | `ComponentRegistry` | — | — |
| `renderMode` | `SchemaRenderMode` | — | — |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `id: string \| null` | v-model 更新 / v-model update |
| `change` | `id: string \| null` | 值变更 / Change |
| `select` | `id: string` | 选中 / Select |
| `nodeActivate` | `node: CanvasNodeData, event: MouseEvent \| KeyboardEvent,` | — |
| `scaleChange` | `scale: number` | — |
| `refresh` | `void` | — |

## Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

## Public types

- `CanvasPreviewProps`
- `CanvasPreviewEmits`


## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| API extract | `generated/component-api/CanvasPreview.json` |

> 完整 Demo 见 `example/demos/CanvasPreview`。对外 docs 为 API 导向页面；交互预览见本地 example（不上线）。
