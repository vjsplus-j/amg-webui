# ScaleLayout

ScaleLayout 为 **RC** 公共组件（Contract maturity=`rc`）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

ScaleLayout 当前成熟度为 **RC**；完整交互见本地 example。

## 何时使用 / 何时不用

- **适用**：RC 阶段的标准 UI 场景（未宣称 Stable）。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

— 见同包组件与 `Form` / `Select` 等表单家族。

## 基础用法

```vue
<script setup>
import { ScaleLayout } from '@amg-webui/core'
</script>

<template>
  <ScaleLayout />
</template>
```

Curated demo：`example/demos/ScaleLayout/index.vue`

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `scale` | `number` | — | — |
| `width` | `number` | — | — |
| `height` | `number` | — | — |
| `fit` | `ScaleLayoutFit` | — | — |
| `origin` | `ScaleLayoutOrigin` | — | — |
| `fill` | `boolean` | — | — |
| `ariaLabel` | `string` | — | 无障碍标签 / ARIA label |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `scaleChange` | `scale: number, hostSize: { width: number; height: number },` | — |

## Public types

- `ScaleLayoutFit`
- `ScaleLayoutOrigin`
- `ScaleLayoutProps`
- `ScaleLayoutEmits`


## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| API extract | `generated/component-api/ScaleLayout.json` |

> 完整 Demo 见 `example/demos/ScaleLayout`。对外 docs 为 API 导向页面；交互预览见本地 example（不上线）。
